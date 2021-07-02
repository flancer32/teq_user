/**
 *  Service to close session for authenticated user.
 *
 * @namespace Fl32_Teq_User_Back_Service_Sign_Out
 */
// MODULE'S IMPORT
import {constants as H2} from 'http2';

// MODULE'S VARS
const NS = 'Fl32_Teq_User_Back_Service_Sign_Out';

/**
 * @implements TeqFw_Web_Back_Api_Service_IFactory
 */
export default class Fl32_Teq_User_Back_Service_Sign_Out {

    constructor(spec) {
        /** @type {Fl32_Teq_User_Back_Defaults} */
        const DEF = spec['Fl32_Teq_User_Back_Defaults$'];
        /** @type {TeqFw_Core_Back_RDb_Connector} */
        const rdb = spec['TeqFw_Core_Back_RDb_Connector$'];
        /** @type {typeof Fl32_Teq_User_Store_RDb_Schema_Auth_Session} */
        const EAuthSess = spec['Fl32_Teq_User_Store_RDb_Schema_Auth_Session#'];
        /** @type {Fl32_Teq_User_Shared_Service_Route_Sign_Out.Factory} */
        const route = spec['Fl32_Teq_User_Shared_Service_Route_Sign_Out#Factory$'];
        /** @type {Function|TeqFw_Http2_Back_Util.cookieClear} */
        const cookieClear = spec['TeqFw_Http2_Back_Util#cookieClear'];
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
                async function deleteAllSessions(trx, sessId) {
                    // get user ID by session ID
                    const qSelect = trx.from(EAuthSess.ENTITY)
                        .select([EAuthSess.A_USER_REF])
                        .where(EAuthSess.A_SESSION_ID, sessId);
                    const rs = await qSelect;
                    if (rs[0] && rs[0][EAuthSess.A_USER_REF]) {
                        // remove all sessions for the user
                        const qDelete = trx.from(EAuthSess.ENTITY)
                            .where(EAuthSess.A_USER_REF, rs[0][EAuthSess.A_USER_REF]);
                        await qDelete.del();
                    }
                }

                // MAIN FUNCTIONALITY
                const shared = context.getHandlersShare();
                //
                const trx = await rdb.startTransaction();
                try {
                    const sessId = shared[DEF.HTTP_SHARE_CTX_SESSION_ID];
                    if (sessId) {
                        await deleteAllSessions(trx, sessId);
                    }
                    await trx.commit();
                    // clear session ID from cookie
                    const pathHttp = context.getRequestContext().getPath();
                    const parts = mAddr.parsePath(pathHttp);
                    const path = (parts.root) ? `/${parts.root}/${parts.door}` : `/${parts.door}`;
                    const cookie = cookieClear({name: DEF.SESSION_COOKIE_NAME, path});
                    context.setOutHeader(H2.HTTP2_HEADER_SET_COOKIE, cookie);
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
