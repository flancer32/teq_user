import {constants as H2} from 'http2';

/**
 * Service to close session for authenticated user.
 * @extends TeqFw_Core_App_Server_Handler_Api_Factory
 */
export default class Fl32_Teq_User_Back_Service_Sign_Out {

    constructor(spec) {
        /** @type {Fl32_Teq_User_Defaults} */
        const DEF = spec['Fl32_Teq_User_Defaults$'];
        /** @type {TeqFw_Core_App_Util_Back_Cookie} */
        const utilCookie = spec['TeqFw_Core_App_Util_Back_Cookie$'];  // instance singleton
        /** @type {TeqFw_Core_App_Db_Connector} */
        const rdb = spec['TeqFw_Core_App_Db_Connector$'];  // instance singleton
        /** @type {Fl32_Teq_User_Store_RDb_Schema_Auth_Session} */
        const eAuthSess = spec['Fl32_Teq_User_Store_RDb_Schema_Auth_Session$'];   // instance singleton
        /** @type {typeof TeqFw_Core_App_Server_Handler_Api_Result} */
        const ApiResult = spec['TeqFw_Core_App_Server_Handler_Api_Result#'];    // class constructor
        /** @type {typeof Fl32_Teq_User_Shared_Service_Route_Sign_Out_Request} */
        const Request = spec['Fl32_Teq_User_Shared_Service_Route_Sign_Out#Request'];   // class constructor
        /** @type {typeof Fl32_Teq_User_Shared_Service_Route_Sign_Out_Response} */
        const Response = spec['Fl32_Teq_User_Shared_Service_Route_Sign_Out#Response'];   // class constructor

        this.getRoute = function () {
            return DEF.API_SIGN_OUT;
        };

        /**
         * Create function to validate and structure incoming data.
         * @returns {TeqFw_Core_App_Server_Handler_Api_Factory.parse}
         */
        this.createInputParser = function () {
            // DEFINE INNER FUNCTIONS
            /**
             * @param {TeqFw_Core_App_Server_Http2_Context} httpCtx
             * @return {Fl32_Teq_User_Shared_Service_Route_Sign_Out_Request}
             * @memberOf Fl32_Teq_User_Back_Service_Sign_In
             * @implements TeqFw_Core_App_Server_Handler_Api_Factory.parse
             */
            function parse(httpCtx) {
                const body = JSON.parse(httpCtx.body);
                return Object.assign(new Request(), body.data); // clone HTTP body data into API request object
            }

            // COMPOSE RESULT
            Object.defineProperty(parse, 'name', {value: `${this.constructor.name}.${parse.name}`});
            return parse;
        };

        /**
         * Create function to perform requested operation.
         * @return {TeqFw_Core_App_Server_Handler_Api_Factory.service}
         */
        this.createService = function () {
            // DEFINE INNER FUNCTIONS
            /**
             * @param {TeqFw_Core_App_Server_Handler_Api_Context} apiCtx
             * @return {Promise<Fl32_Teq_User_Shared_Service_Route_Sign_Out_Response>}
             * @implements {TeqFw_Core_App_Server_Handler_Api_Factory.service}
             */
            async function service(apiCtx) {
                // DEFINE INNER FUNCTIONS
                async function deleteAllSessions(trx, sessId) {
                    // get user ID by session ID
                    const qSelect = trx.from(eAuthSess.ENTITY)
                        .select([eAuthSess.A_USER_REF])
                        .where(eAuthSess.A_SESSION_ID, sessId);
                    const rs = await qSelect;
                    if (rs[0] && rs[0][eAuthSess.A_USER_REF]) {
                        // remove all sessions for the user
                        const qDelete = trx.from(eAuthSess.ENTITY)
                            .where(eAuthSess.A_USER_REF, rs[0][eAuthSess.A_USER_REF]);
                        await qDelete.del();
                    }
                }

                // MAIN FUNCTIONALITY
                const result = new ApiResult();
                result.response = new Response();
                const sharedCtx = apiCtx.sharedContext;
                const trx = await rdb.startTransaction();

                try {
                    const sessId = sharedCtx[DEF.HTTP_SHARE_CTX_SESSION_ID];
                    if (sessId) {
                        await deleteAllSessions(trx, sessId);
                    }
                    await trx.commit();
                    result.headers[H2.HTTP2_HEADER_SET_COOKIE] = utilCookie.clear(DEF.SESSION_COOKIE_NAME);
                } catch (error) {
                    await trx.rollback();
                    throw error;
                }
                return result;
            }

            // COMPOSE RESULT
            Object.defineProperty(service, 'name', {value: `${this.constructor.name}.${service.name}`});
            return service;
        };
    }

}
