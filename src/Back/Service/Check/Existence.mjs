/**
 * Check existence for different values (login, referral code, email, phone, ...).
 * @extends TeqFw_Http2_Api_Service_Factory
 */
export default class Fl32_Teq_User_Back_Service_Check_Existence {

    constructor(spec) {
        /** @type {Fl32_Teq_User_Defaults} */
        const DEF = spec['Fl32_Teq_User_Defaults$'];    // instance singleton
        /** @type {TeqFw_Core_App_Db_Connector} */
        const rdb = spec['TeqFw_Core_App_Db_Connector$'];  // instance singleton
        /** @type {typeof Fl32_Teq_User_Store_RDb_Schema_Auth_Password} */
        const EAuthPass = spec['Fl32_Teq_User_Store_RDb_Schema_Auth_Password#']; // class
        /** @type {typeof Fl32_Teq_User_Store_RDb_Schema_Id_Email} */
        const EIdEmail = spec['Fl32_Teq_User_Store_RDb_Schema_Id_Email#']; // class
        /** @type {typeof Fl32_Teq_User_Store_RDb_Schema_Id_Phone} */
        const EIdPhone = spec['Fl32_Teq_User_Store_RDb_Schema_Id_Phone#']; // class
        /** @type {typeof Fl32_Teq_User_Store_RDb_Schema_Ref_Link} */
        const ERefLink = spec['Fl32_Teq_User_Store_RDb_Schema_Ref_Link#'];         // instance singleton
        /** @type {typeof TeqFw_Http2_Plugin_Handler_Service.Result} */
        const ApiResult = spec['TeqFw_Http2_Plugin_Handler_Service#Result'];    // class
        /** @type {typeof Fl32_Teq_User_Shared_Service_Route_Check_Existence_Request} */
        const Request = spec['Fl32_Teq_User_Shared_Service_Route_Check_Existence#Request'];   // class
        /** @type {typeof Fl32_Teq_User_Shared_Service_Route_Check_Existence_Response} */
        const Response = spec['Fl32_Teq_User_Shared_Service_Route_Check_Existence#Response'];   // class

        this.getRoute = () => DEF.SERV_CHECK_EXISTENCE;

        /**
         * Factory to create function to validate and structure incoming data.
         * @returns {TeqFw_Http2_Api_Service_Factory.parse}
         */
        this.createInputParser = function () {
            // DEFINE INNER FUNCTIONS
            /**
             * @param {TeqFw_Http2_Back_Server_Stream_Context} context
             * @returns {Fl32_Teq_User_Shared_Service_Route_Check_Existence_Request}
             * @memberOf Fl32_Teq_User_Back_Service_Check_Existence
             * @implements TeqFw_Http2_Api_Service_Factory.parse
             */
            function parse(context) {
                const body = JSON.parse(context.body);
                return Object.assign(new Request(), body.data); // clone HTTP body into API request object
            }

            // COMPOSE RESULT
            Object.defineProperty(parse, 'name', {value: `${this.constructor.name}.${parse.name}`});
            return parse;
        };

        /**
         * Factory to create service (handler to process HTTP API request).
         * @returns {TeqFw_Http2_Api_Service_Factory.service}
         */
        this.createService = function () {
            // DEFINE INNER FUNCTIONS
            /**
             * @param {TeqFw_Http2_Back_Server_Handler_Api.Context} apiCtx
             * @returns {Promise<TeqFw_Http2_Plugin_Handler_Service.Result>}
             * @memberOf Fl32_Teq_User_Back_Service_Check_Existence
             * @implements {TeqFw_Http2_Api_Service_Factory.service}
             */
            async function service(apiCtx) {
                // DEFINE INNER FUNCTIONS

                async function checkEmail(trx, value) {
                    const query = trx.from(EIdEmail.ENTITY);
                    query.select([EIdEmail.A_USER_REF]);
                    query.where(EIdEmail.A_EMAIL, value);
                    const rs = await query;
                    return (rs.length >= 1);
                }

                async function checkLogin(trx, value) {
                    const query = trx.from(EAuthPass.ENTITY);
                    query.select([EAuthPass.A_USER_REF]);
                    query.where(EAuthPass.A_LOGIN, value);
                    const rs = await query;
                    return (rs.length >= 1);
                }

                async function checkPhone(trx, value) {
                    const query = trx.from(EIdPhone.ENTITY);
                    query.select([EIdPhone.A_USER_REF]);
                    query.where(EIdPhone.A_PHONE, value);
                    const rs = await query;
                    return (rs.length >= 1);
                }

                async function checkRefCode(trx, value) {
                    const query = trx.from(ERefLink.ENTITY);
                    query.select([ERefLink.A_USER_REF]);
                    query.where(ERefLink.A_CODE, value);
                    const rs = await query;
                    return (rs.length >= 1);
                }

                // MAIN FUNCTIONALITY
                const result = new ApiResult();
                result.response = new Response();
                const trx = await rdb.startTransaction();
                /** @type {Fl32_Teq_User_Shared_Service_Route_Check_Existence_Request} */
                const apiReq = apiCtx.request;

                try {
                    const type = apiReq.type;
                    if (apiReq.value) {
                        const value = apiReq.value.trim().toLowerCase();
                        if (type === Request.TYPE_EMAIL) {
                            result.response.exist = await checkEmail(trx, value);
                        } else if (type === Request.TYPE_LOGIN) {
                            result.response.exist = await checkLogin(trx, value);
                        } else if (type === Request.TYPE_PHONE) {
                            result.response.exist = await checkPhone(trx, value);
                        } else if (type === Request.TYPE_REF_CODE) {
                            result.response.exist = await checkRefCode(trx, value);
                        }
                    }
                    trx.commit();
                } catch (error) {
                    trx.rollback();
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
