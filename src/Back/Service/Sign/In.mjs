/**
 * Establish new session for the user.
 *
 * @namespace Fl32_Teq_User_Back_Service_Sign_In
 */
// MODULE'S IMPORT
import $bcrypt from 'bcrypt';
import {constants as H2} from 'http2';

// MODULE'S VARS
const NS = 'TeqFw_I18n_Back_Service_Load';

/**
 * @implements TeqFw_Web_Back_Api_Service_IFactory
 */
export default class Fl32_Teq_User_Back_Service_Sign_In {

    constructor(spec) {
        // EXTRACT DEPS
        /** @type {Fl32_Teq_User_Back_Defaults} */
        const DEF = spec['Fl32_Teq_User_Back_Defaults$'];
        /** @type {TeqFw_Core_Back_RDb_Connector} */
        const rdb = spec['TeqFw_Core_Back_RDb_Connector$'];
        /** @type {Function|TeqFw_Web_Back_Util.cookieCreate} */
        const cookieCreate = spec['TeqFw_Web_Back_Util#cookieCreate'];
        /** @type {Fl32_Teq_User_Back_Process_Session_Open} */
        const procSessionOpen = spec['Fl32_Teq_User_Back_Process_Session_Open$'];
        /** @type {typeof Fl32_Teq_User_Store_RDb_Schema_Auth_Password} */
        const EAuthPass = spec['Fl32_Teq_User_Store_RDb_Schema_Auth_Password#'];
        /** @type {Fl32_Teq_User_Shared_Service_Route_Sign_In.Factory} */
        const route = spec['Fl32_Teq_User_Shared_Service_Route_Sign_In#Factory$'];
        /** @type {TeqFw_Web_Back_Model_Address} */
        const mAddr = spec['TeqFw_Web_Back_Model_Address$'];

        // DEFINE INSTANCE METHODS

        this.getRouteFactory = () => route;

        this.getService = function () {
            // DEFINE INNER FUNCTIONS
            /**
             * @param {TeqFw_Web_Back_Api_Service_IContext} context
             * @return Promise<void>
             */
            async function service(context) {
                // DEFINE INNER FUNCTIONS

                /**
                 * Get user id & password hash by login name.
                 * @param trx
                 * @param {String} login
                 * @returns {Promise<{userId: number, hash: string}>}
                 */
                async function getUserData(trx, login) {
                    const result = {};
                    const query = trx.from(EAuthPass.ENTITY);
                    query.select([EAuthPass.A_USER_REF, EAuthPass.A_PASSWORD_HASH]);
                    const norm = login.trim().toLowerCase();
                    query.where(EAuthPass.A_LOGIN, norm);
                    const rs = await query;
                    if (rs[0]) {
                        result.userId = rs[0][EAuthPass.A_USER_REF];
                        result.hash = rs[0][EAuthPass.A_PASSWORD_HASH];
                    }
                    return result;
                }

                // MAIN FUNCTIONALITY
                /** @type {Fl32_Teq_User_Shared_Service_Route_Sign_In.Request} */
                const req = context.getInData();
                /** @type {Fl32_Teq_User_Shared_Service_Route_Sign_In.Response} */
                const res = context.getOutData();
                //
                const trx = await rdb.startTransaction();
                try {
                    // select user data by login name (this type of authentication is accepted at the moment)
                    const {userId, hash} = await getUserData(trx, req.user);
                    if (userId && hash) {
                        // validate password
                        const equal = await $bcrypt.compare(req.password, hash);
                        if (equal) {
                            // generate user session
                            const {output} = await procSessionOpen.exec({trx, userId});
                            res.sessionId = output.sessId;
                            // set session cookie
                            const pathHttp = context.getRequestContext().getPath();
                            const parts = mAddr.parsePath(pathHttp);
                            const path = (parts.root) ? `/${parts.root}/${parts.door}` : `/${parts.door}`;
                            const cookie = cookieCreate({
                                name: DEF.SESSION_COOKIE_NAME,
                                value: res.sessionId,
                                expires: DEF.SESSION_COOKIE_LIFETIME,
                                path
                            });
                            context.setOutHeader(H2.HTTP2_HEADER_SET_COOKIE, cookie);
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
