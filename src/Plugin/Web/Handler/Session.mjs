/**
 * Web request handler to validate sessions and load users profiles.
 *
 * @namespace Fl32_Teq_User_Plugin_Web_Handler_Session
 */
// MODULE'S IMPORT
import {constants as H2} from 'http2';

// MODULE'S VARS
const NS = 'Fl32_Teq_User_Plugin_Web_Handler_Session';

// MODULE'S FUNCTIONS
/**
 * Factory to setup execution context and to create handler.
 *
 * @param {TeqFw_Di_SpecProxy} spec
 * @return {function(TeqFw_Web_Back_Api_Request_IContext): Promise<void>}
 * @memberOf Fl32_Teq_User_Plugin_Web_Handler_Session
 */
export default function Factory(spec) {
    // EXTRACT DEPS
    /** @type {Fl32_Teq_User_Back_Defaults} */
    const DEF = spec['Fl32_Teq_User_Back_Defaults$'];
    /** @type {TeqFw_Core_Logger} */
    const logger = spec['TeqFw_Core_Logger$'];
    /** @type {Fl32_Teq_User_App_Cache_Session} */
    const cache = spec['Fl32_Teq_User_App_Cache_Session$'];
    /** @type {TeqFw_Core_Back_RDb_Connector} */
    const rdb = spec['TeqFw_Core_Back_RDb_Connector$'];
    /** @type {TeqFw_Core_Back_Util_Cookie} */
    const utilCookie = spec['TeqFw_Core_Back_Util_Cookie$'];
    /** @type {typeof Fl32_Teq_User_Store_RDb_Schema_Auth_Session} */
    const EAuthSess = spec['Fl32_Teq_User_Store_RDb_Schema_Auth_Session#'];
    /** @function {@type Fl32_Teq_User_Back_Process_User_Load.process} */
    const procLoad = spec['Fl32_Teq_User_Back_Process_User_Load$'];
    /** @type {TeqFw_Web_Back_Model_Address} */
    const mAddr = spec['TeqFw_Web_Back_Model_Address$'];
    /** @type {Function|TeqFw_Http2_Back_Util.cookieClear} */
    const cookieClear = spec['TeqFw_Http2_Back_Util#cookieClear'];

    // PARSE INPUT & DEFINE WORKING VARS

    // DEFINE INNER FUNCTIONS
    /**
     * Action to process web request for static files.
     *
     * @param {TeqFw_Web_Back_Api_Request_IContext} context
     * @returns {Promise<void>}
     * @memberOf Fl32_Teq_User_Plugin_Web_Handler_Session
     */
    async function handle(context) {
        // DEFINE INNER FUNCTIONS
        /**
         * Extract session ID from cookies or HTTP headers.
         * @param {Object<String, String>} headers
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
         * @param {TeqFw_Web_Back_Api_Request_IContext} context
         * @returns {Promise<void>}
         */
        async function loadUserData(sessId, context) {
            // DEFINE INNER FUNCTIONS

            async function getSessionById(trx, sessId) {
                let result = null;
                const query = trx.from(EAuthSess.ENTITY);
                query.select([EAuthSess.A_DATE_CREATED, EAuthSess.A_SESSION_ID, EAuthSess.A_USER_REF]);
                query.where(EAuthSess.A_SESSION_ID, sessId);
                const rows = await query;
                if (rows.length) {
                    result = rows[0];
                }
                return result;
            }

            // MAIN FUNCTIONALITY
            const trx = await rdb.startTransaction();

            try {
                const sess = await getSessionById(trx, sessId);
                if (sess) {
                    const userId = sess[EAuthSess.A_USER_REF];
                    const dateInit = sess[EAuthSess.A_DATE_CREATED];
                    if (userId) {
                        /** @type {Fl32_Teq_User_Shared_Service_Dto_User} */
                        const user = await procLoad({trx, userId});
                        user.dateLoggedIn = dateInit;
                        // get parent data
                        if (user.parentId !== user.id) {
                            const parent = await procLoad({trx, userId: user.parentId});
                            user.parentName = parent.name;
                        } else {
                            user.parentName = user.name;
                        }
                        const shared = context.getHandlersShare();
                        shared[DEF.HTTP_SHARE_CTX_USER] = user;
                        shared[DEF.HTTP_SHARE_CTX_SESSION_ID] = sessId;
                        cache.set(sessId, user);
                    }
                } else {
                    // clear session id from cookies
                    const path = context.getPath();
                    const addr = mAddr.parsePath(path);
                    const door = addr.door ?? '';
                    const name =  DEF.SESSION_COOKIE_NAME;
                    const cookie = cookieClear({name, door});
                    context.setResponseHeader(H2.HTTP2_HEADER_SET_COOKIE, cookie);
                    context.setResponseHeader(DEF.MOD.WEB.HTTP.HEADER.STATUS, H2.HTTP_STATUS_UNAUTHORIZED.toString());
                    context.markRequestProcessed();
                }
                await trx.commit();
            } catch (e) {
                await trx.rollback();
                throw e;
            }
        }


        // MAIN FUNCTIONALITY

        /** @type {TeqFw_Web_Back_Api_Request_IContext} */
        const ctx = context; // IDEA is failed with context help (suggestions on Ctrl+Space)
        if (!ctx.isRequestProcessed()) {
            /** @type {Object<String, String>} */
            const headers = ctx.getRequestHeaders();
            try {
                // process request, compose response and write it to the 'stream'
                const sessId = extractSessionId(headers);
                if (sessId) {
                    const shared = ctx.getHandlersShare();
                    const userCached = cache.get(sessId);
                    if (userCached) {
                        shared[DEF.HTTP_SHARE_CTX_USER] = userCached;
                        shared[DEF.HTTP_SHARE_CTX_SESSION_ID] = sessId;
                    } else {
                        await loadUserData(sessId, context);
                    }
                }
            } catch (e) {
                ctx.setResponseHeader(DEF.MOD.WEB.HTTP.HEADER.STATUS, H2.HTTP_STATUS_UNAUTHORIZED.toString());
                ctx.setResponseBody(e.message);
                ctx.markRequestProcessed();
            }
        }
    }

    /**
     * Process plugins descriptions and setup static resources mapping.
     */
    function initHandler() {
        logger.debug('Map plugins folders for static resources:');

        logger.debug('All static resources are mapped.');
    }

    // MAIN FUNCTIONALITY
    initHandler();

    // COMPOSE RESULT
    Object.defineProperty(handle, 'name', {value: `${NS}.${handle.name}`});
    return handle;
}

Object.defineProperty(Factory, 'name', {value: `${NS}.${Factory.name}`});

