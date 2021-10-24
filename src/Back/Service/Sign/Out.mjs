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
        /** @type {TeqFw_Db_Back_RDb_IConnect} */
        const conn = spec['TeqFw_Db_Back_RDb_IConnect$'];
        /** @type {TeqFw_Db_Back_Api_RDb_ICrudEngine} */
        const crud = spec['TeqFw_Db_Back_Api_RDb_ICrudEngine$'];
        /** @type {Fl32_Teq_User_Shared_Service_Route_Sign_Out.Factory} */
        const route = spec['Fl32_Teq_User_Shared_Service_Route_Sign_Out#Factory$'];
        /** @type {Function|TeqFw_Web_Back_Util.cookieClear} */
        const cookieClear = spec['TeqFw_Web_Back_Util#cookieClear'];
        /** @type {TeqFw_Web_Back_Model_Address} */
        const mAddr = spec['TeqFw_Web_Back_Model_Address$'];
        /** @type {Fl32_Teq_User_Back_Store_RDb_Schema_Auth_Session} */
        const metaSess = spec['Fl32_Teq_User_Back_Store_RDb_Schema_Auth_Session$'];

        // DEFINE WORKING VARS / PROPS
        /** @type {typeof Fl32_Teq_User_Back_Store_RDb_Schema_Auth_Session.ATTR} */
        const A_SESS = metaSess.getAttributes();

        // DEFINE INSTANCE METHODS

        this.getRouteFactory = () => route;

        this.getService = function () {
            // DEFINE INNER FUNCTIONS
            /**
             * @param {TeqFw_Web_Back_Api_Service_Context} context
             * @return Promise<void>
             */
            async function service(context) {

                // MAIN FUNCTIONALITY
                const shared = context.getHandlersShare();
                //
                const trx = await conn.startTransaction();
                try {
                    const sessId = shared[DEF.HTTP_SHARE_CTX_SESSION_ID];
                    if (sessId) {
                        // get user ID by session ID then delete all sessions for the user
                        /** @type {Fl32_Teq_User_Back_Store_RDb_Schema_Auth_Session.Dto} */
                        const found = await crud.readOne(trx, metaSess, {[A_SESS.SESSION_ID]: sessId});
                        if (found !== null) {
                            const where = {[A_SESS.USER_REF]: found.user_ref};
                            await crud.deleteSet(trx, metaSess, where);
                        }
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
