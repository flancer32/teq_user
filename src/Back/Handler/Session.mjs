/**
 * Web request handler to validate sessions and load users profiles.
 *
 * @namespace Fl32_Teq_User_Back_Handler_Session
 */
// MODULE'S IMPORT
import {constants as H2} from 'http2';

// MODULE'S VARS
const NS = 'Fl32_Teq_User_Back_Handler_Session';

// MODULE'S CLASSES
/**
 * Factory to setup execution context and to create handler.
 *
 * @implements TeqFw_Web_Back_Api_Request_IHandler
 */
export default class Fl32_Teq_User_Back_Handler_Session {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {Fl32_Teq_User_Back_Defaults} */
        const DEF = spec['Fl32_Teq_User_Back_Defaults$'];
        /** @type {TeqFw_Core_Shared_Logger} */
        const logger = spec['TeqFw_Core_Shared_Logger$'];
        /** @type {Fl32_Teq_User_App_Cache_Session} */
        const cache = spec['Fl32_Teq_User_App_Cache_Session$'];
        /** @type {TeqFw_Db_Back_RDb_IConnect} */
        const conn = spec['TeqFw_Db_Back_RDb_IConnect$'];
        /** @type {TeqFw_Db_Back_Api_RDb_CrudEngine} */
        const crud = spec['TeqFw_Db_Back_Api_RDb_CrudEngine$'];
        /** @type {Fl32_Teq_User_Back_Process_User_Load.process|function} */
        const procLoad = spec['Fl32_Teq_User_Back_Process_User_Load$'];
        /** @type {TeqFw_Web_Back_Mod_Address} */
        const mAddr = spec['TeqFw_Web_Back_Mod_Address$'];
        /** @type {Function|TeqFw_Web_Back_Util.cookieClear} */
        const cookieClear = spec['TeqFw_Web_Back_Util#cookieClear'];
        /** @type {Fl32_Teq_User_Back_Store_RDb_Schema_Auth_Session} */
        const metaSess = spec['Fl32_Teq_User_Back_Store_RDb_Schema_Auth_Session$'];

        // DEFINE WORKING VARS / PROPS
        /** @type {typeof Fl32_Teq_User_Back_Store_RDb_Schema_Auth_Session.ATTR} */
        const A_SESS = metaSess.getAttributes();

        // DEFINE INNER FUNCTIONS

        /**
         * Try to validate sessions and load users profiles.
         * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest}req
         * @param {module:http.ServerResponse|module:http2.Http2ServerResponse} res
         */
        async function process(req, res) {
            // DEFINE INNER FUNCTIONS

            /**
             * Extract session ID from cookies or HTTP headers.
             * @param {Object<string, string>} headers
             * @returns {String|null}
             */
            function extractSessionId(headers) {
                let result = null;
                if (headers[H2.HTTP2_HEADER_COOKIE]) {
                    const cookies = headers[H2.HTTP2_HEADER_COOKIE];
                    const name = DEF.SESSION_COOKIE_NAME;
                    const value = cookies.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || '';
                    if (value.length) {
                        // there is session cookie in HTTP request
                        result = value;
                    }
                } else if (headers[H2.HTTP2_HEADER_AUTHORIZATION]) {
                    const value = headers[H2.HTTP2_HEADER_AUTHORIZATION];
                    result = value.replace('Bearer ', '').trim();
                }
                return result;
            }

            /**
             * Load user data using session ID and place it to the report's additional shared objects.
             * Compose "Clear cookie" HTTP header for wrong session ID.
             *
             * @param {String} sessId
             * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest}req
             * @param {module:http.ServerResponse|module:http2.Http2ServerResponse} res
             * @returns {Promise<void>}
             */
            async function loadUserData(sessId, req, res) {
                const trx = await conn.startTransaction();
                try {
                    /** @type {TeqFw_Core_Shared_Mod_Map} */
                    const share = req[DEF.MOD_WEB.HNDL_SHARE];
                    /** @type {Fl32_Teq_User_Back_Store_RDb_Schema_Auth_Session.Dto} */
                    const sess = await crud.readOne(trx, metaSess, {[A_SESS.SESSION_ID]: sessId});
                    if (sess) {
                        const userId = sess.user_ref;
                        const dateInit = sess.date_created;
                        /** @type {Fl32_Teq_User_Shared_Dto_User} */
                        const user = await procLoad({trx, userId});
                        user.dateLoggedIn = dateInit;
                        // get parent data
                        if (user.parentId !== user.id) {
                            const parent = await procLoad({trx, userId: user.parentId});
                            user.parentName = parent.name;
                        } else {
                            user.parentName = user.name;
                        }
                        share.set(DEF.SHARE_USER, user);
                        share.set(DEF.SHARE_SESSION_ID, sessId);
                        cache.set(sessId, user);
                        logger.info(`User #${user.id} is saved to cache for session '${sessId.substr(0, 8)}...'.`);
                    } else {
                        // clear session id from cookies
                        const {url} = req;
                        const addr = mAddr.parsePath(url);
                        const path = addr.door ? `/${addr.door}` : '/';
                        const name = DEF.SESSION_COOKIE_NAME;
                        const cookie = cookieClear({name, path});
                        res.setHeader(H2.HTTP2_HEADER_SET_COOKIE, cookie);
                        logger.error(`Invalid session '${sessId}'. Cleanup cookie is set.`);
                    }
                    await trx.commit();
                } catch (e) {
                    await trx.rollback();
                    throw e;
                }
            }

            // MAIN FUNCTIONALITY

            const {headers} = req;
            try {
                // process request, compose response and write it to the 'stream'
                const sessId = extractSessionId(headers);
                if (sessId) {
                    const userCached = cache.get(sessId);
                    if (userCached) {
                        /** @type {TeqFw_Core_Shared_Mod_Map} */
                        const share = req[DEF.MOD_WEB.HNDL_SHARE];
                        share.set(DEF.SHARE_USER, userCached);
                        share.set(DEF.SHARE_SESSION_ID, sessId);
                    } else {
                        await loadUserData(sessId, req, res);
                    }
                }
            } catch (e) {
                /** @type {TeqFw_Core_Shared_Mod_Map} */
                const share = req[DEF.MOD_WEB.HNDL_SHARE];
                share.set(DEF.MOD_WEB.SHARE_RES_STATUS, H2.HTTP_STATUS_UNAUTHORIZED);
                share.set(DEF.MOD_WEB.SHARE_RES_BODY, e?.message);
                logger.error(`Cannot establish user session. Error: ${e?.message}`);
            }
        }

        // DEFINE INSTANCE METHODS
        this.getProcessor = () => process;

        this.init = async function () {}

        /**
         * Process all requests.
         * @return {boolean}
         */
        this.requestIsMine = function ({}) {
            return true;
        }

        // MAIN FUNCTIONALITY
        Object.defineProperty(process, 'name', {value: `${NS}.${process.name}`});
    }
}
