/**
 * Establish new session for the user.
 *
 * @namespace Fl32_Teq_User_Back_WAPI_Sign_In
 */
// MODULE'S IMPORT
import $bcrypt from 'bcrypt';
import {constants as H2} from 'http2';

// MODULE'S VARS
const NS = 'Fl32_Teq_User_Back_WAPI_Sign_In';

/**
 * @implements TeqFw_Web_Back_Api_WAPI_IFactory
 */
export default class Fl32_Teq_User_Back_WAPI_Sign_In {

    constructor(spec) {
        // EXTRACT DEPS
        /** @type {Fl32_Teq_User_Back_Defaults} */
        const DEF = spec['Fl32_Teq_User_Back_Defaults$'];
        /** @type {TeqFw_Core_Shared_Logger} */
        const logger = spec['TeqFw_Core_Shared_Logger$'];
        /** @type {TeqFw_Db_Back_RDb_IConnect} */
        const conn = spec['TeqFw_Db_Back_RDb_IConnect$'];
        /** @type {TeqFw_Db_Back_Api_RDb_CrudEngine} */
        const crud = spec['TeqFw_Db_Back_Api_RDb_CrudEngine$'];
        /** @type {Function|TeqFw_Web_Back_Util.cookieCreate} */
        const cookieCreate = spec['TeqFw_Web_Back_Util#cookieCreate'];
        /** @type {Fl32_Teq_User_Back_Process_Session_Open} */
        const procSessionOpen = spec['Fl32_Teq_User_Back_Process_Session_Open$'];
        /** @type {Fl32_Teq_User_Shared_WAPI_Sign_In.Factory} */
        const route = spec['Fl32_Teq_User_Shared_WAPI_Sign_In#Factory$'];
        /** @type {TeqFw_Web_Back_Mod_Address} */
        const mAddr = spec['TeqFw_Web_Back_Mod_Address$'];
        /** @type {Fl32_Teq_User_Back_Store_RDb_Schema_Auth_Password} */
        const metaAuthPass = spec['Fl32_Teq_User_Back_Store_RDb_Schema_Auth_Password$'];

        // DEFINE WORKING VARS / PROPS
        /** @type {typeof Fl32_Teq_User_Back_Store_RDb_Schema_Auth_Password.ATTR} */
        const A_AUTH_PASS = metaAuthPass.getAttributes();

        // DEFINE INSTANCE METHODS

        this.getRouteFactory = () => route;

        this.getService = function () {
            // DEFINE INNER FUNCTIONS
            /**
             * @param {TeqFw_Web_Back_Handler_WAPI_Context} context
             * @return Promise<void>
             */
            async function service(context) {
                // DEFINE INNER FUNCTIONS

                /**
                 * Get user id & password hash by login name.
                 * @param {TeqFw_Db_Back_RDb_ITrans} trx
                 * @param {String} login
                 * @returns {Promise<{userId: number, hash: string}>}
                 */
                async function getUserData(trx, login) {
                    const result = {};
                    const norm = login.trim().toLowerCase();
                    /** @type {Fl32_Teq_User_Back_Store_RDb_Schema_Auth_Password.Dto} */
                    const dto = await crud.readOne(trx, metaAuthPass, {[A_AUTH_PASS.LOGIN]: norm});
                    if (dto) {
                        result.userId = dto.user_ref;
                        result.hash = dto.password_hash;
                    }
                    return result;
                }

                // MAIN FUNCTIONALITY
                /** @type {Fl32_Teq_User_Shared_WAPI_Sign_In.Request} */
                const req = context.getInData();
                /** @type {Fl32_Teq_User_Shared_WAPI_Sign_In.Response} */
                const res = context.getOutData();
                //
                const trx = await conn.startTransaction();
                try {
                    // select user data by login name (this type of authentication is accepted at the moment)
                    const {userId, hash} = await getUserData(trx, req.user);
                    if (userId && hash) {
                        // validate password
                        const equal = await $bcrypt.compare(req.password, hash);
                        if (equal) {
                            // generate user session
                            const {output: {sessId}} = await procSessionOpen.exec({trx, userId});
                            res.sessionId = sessId;
                            // set session cookie
                            const pathHttp = context.getRequestUrl();
                            const parts = mAddr.parsePath(pathHttp);
                            const path = (parts.root) ? `/${parts.root}/${parts.door}` : `/${parts.door}`;
                            const cookie = cookieCreate({
                                name: DEF.SESSION_COOKIE_NAME,
                                value: res.sessionId,
                                expires: DEF.SESSION_COOKIE_LIFETIME,
                                path
                            });
                            context.setOutHeader(H2.HTTP2_HEADER_SET_COOKIE, cookie);
                            logger.info(`Session '${sessId.substr(0, 8)}...' for user #${userId} is established.`);
                        }
                    }
                    await trx.commit();
                } catch (error) {
                    await trx.rollback();
                    throw error;
                }
            }

            // MAIN FUNCTIONALITY
            Object.defineProperty(service, 'name', {value: `${NS}.${service.name}`});
            return service;
        }
    }
}
