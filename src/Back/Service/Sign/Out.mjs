import {constants as H2} from 'http2';

/**
 * Service to close session for authenticated user.
 * @extends TeqFw_Http2_Back_Server_Handler_Api_Factory
 */
export default class Fl32_Teq_User_Back_Service_Sign_Out {

    constructor(spec) {
        /** @type {Fl32_Teq_User_Defaults} */
        const DEF = spec['Fl32_Teq_User_Defaults$'];
        /** @type {TeqFw_Core_App_Util_Back_Cookie} */
        const utilCookie = spec['TeqFw_Core_App_Util_Back_Cookie$'];  // instance singleton
        /** @type {TeqFw_Core_App_Db_Connector} */
        const rdb = spec['TeqFw_Core_App_Db_Connector$'];  // instance singleton
        /** @type {TeqFw_Http2_Back_Realm_Registry} */
        const regRealms = spec['TeqFw_Http2_Back_Realm_Registry$']; // instance singleton
        /** @type {typeof Fl32_Teq_User_Store_RDb_Schema_Auth_Session} */
        const EAuthSess = spec['Fl32_Teq_User_Store_RDb_Schema_Auth_Session#']; // class constructor
        /** @type {typeof TeqFw_Http2_Back_Server_Handler_Api_Result} */
        const ApiResult = spec['TeqFw_Http2_Back_Server_Handler_Api#Result'];    // class constructor
        /** @type {typeof Fl32_Teq_User_Shared_Service_Route_Sign_Out_Request} */
        const Request = spec['Fl32_Teq_User_Shared_Service_Route_Sign_Out#Request'];   // class constructor
        /** @type {typeof Fl32_Teq_User_Shared_Service_Route_Sign_Out_Response} */
        const Response = spec['Fl32_Teq_User_Shared_Service_Route_Sign_Out#Response'];   // class constructor

        this.getRoute = () => DEF.SERV_SIGN_OUT;

        /**
         * Factory to create function to validate and structure incoming data.
         * @returns {TeqFw_Http2_Back_Server_Handler_Api_Factory.parse}
         */
        this.createInputParser = function () {
            // DEFINE INNER FUNCTIONS
            /**
             * @param {TeqFw_Http2_Back_Server_Stream_Context} context
             * @returns {Fl32_Teq_User_Shared_Service_Route_Sign_Out_Request}
             * @memberOf Fl32_Teq_User_Back_Service_Sign_In
             * @implements TeqFw_Http2_Back_Server_Handler_Api_Factory.parse
             */
            function parse(context) {
                const body = JSON.parse(context.body);
                return Object.assign(new Request(), body.data); // clone HTTP body data into API request object
            }

            // COMPOSE RESULT
            Object.defineProperty(parse, 'name', {value: `${this.constructor.name}.${parse.name}`});
            return parse;
        };

        /**
         * Factory to create service (handler to process HTTP API request).
         * @returns {TeqFw_Http2_Back_Server_Handler_Api_Factory.service}
         */
        this.createService = function () {
            // DEFINE INNER FUNCTIONS
            /**
             * @param {TeqFw_Http2_Back_Server_Handler_Api_Context} apiCtx
             * @returns {Promise<TeqFw_Http2_Back_Server_Handler_Api_Result>}
             * @memberOf Fl32_Teq_User_Back_Service_Sign_Out
             * @implements {TeqFw_Http2_Back_Server_Handler_Api_Factory.service}
             */
            async function service(apiCtx) {
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
                    // clear session ID from cookie
                    const path = result.headers[H2.HTTP2_HEADER_PATH];
                    const addr = regRealms.parseAddress(path);
                    const realm = addr.realm ?? '';
                    result.headers[H2.HTTP2_HEADER_SET_COOKIE] = utilCookie.clear(DEF.SESSION_COOKIE_NAME, realm);
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
