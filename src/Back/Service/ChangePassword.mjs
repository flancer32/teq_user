import $bcrypt from 'bcrypt';

/**
 * Service to get currently authenticated user data.
 * @extends TeqFw_Http2_Back_Server_Handler_Api_Factory
 */
export default class Fl32_Teq_User_Back_Service_ChangePassword {

    constructor(spec) {
        /** @type {Fl32_Teq_User_Defaults} */
        const DEF = spec['Fl32_Teq_User_Defaults$'];    // instance singleton
        /** @type {TeqFw_Core_App_Db_Connector} */
        const rdb = spec['TeqFw_Core_App_Db_Connector$'];  // instance singleton
        /** @type {Fl32_Teq_User_Store_RDb_Schema_Auth_Password} */
        const eAuthPass = spec['Fl32_Teq_User_Store_RDb_Schema_Auth_Password$'];   // instance singleton
        /** @type {typeof TeqFw_Http2_Back_Server_Handler_Api_Result} */
        const ApiResult = spec['TeqFw_Http2_Back_Server_Handler_Api#Result'];    // class constructor
        /** @type {typeof Fl32_Teq_User_Shared_Service_Route_ChangePassword_Request} */
        const Request = spec['Fl32_Teq_User_Shared_Service_Route_ChangePassword#Request'];   // class constructor
        /** @type {typeof Fl32_Teq_User_Shared_Service_Route_ChangePassword_Response} */
        const Response = spec['Fl32_Teq_User_Shared_Service_Route_ChangePassword#Response'];   // class constructor

        this.getRoute = () => DEF.SERV_CHANGE_PASSWORD;

        /**
         * Factory to create function to validate and structure incoming data.
         * @returns {TeqFw_Http2_Back_Server_Handler_Api_Factory.parse}
         */
        this.createInputParser = function () {
            // DEFINE INNER FUNCTIONS
            /**
             * @param {TeqFw_Http2_Back_Server_Stream_Context} context
             * @returns {Fl32_Teq_User_Shared_Service_Route_ChangePassword_Request}
             * @memberOf Fl32_Teq_User_Back_Service_ChangePassword
             * @implements TeqFw_Http2_Back_Server_Handler_Api_Factory.parse
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
         * @returns {TeqFw_Http2_Back_Server_Handler_Api_Factory.service}
         */
        this.createService = function () {
            // DEFINE INNER FUNCTIONS
            /**
             * @param {TeqFw_Http2_Back_Server_Handler_Api_Context} apiCtx
             * @returns {Promise<TeqFw_Http2_Back_Server_Handler_Api_Result>}
             * @memberOf Fl32_Teq_User_Back_Service_ChangePassword
             * @implements {TeqFw_Http2_Back_Server_Handler_Api_Factory.service}
             */
            async function service(apiCtx) {
                // DEFINE INNER FUNCTIONS

                async function isValidPassword(trx, userId, password) {
                    let result = false;
                    const query = trx.from(eAuthPass.ENTITY)
                        .select([eAuthPass.A_PASSWORD_HASH])
                        .where(eAuthPass.A_USER_REF, userId);
                    /** @type {TextRow[]} */
                    const rs = await query;
                    if (rs.length) {
                        const [first] = rs;
                        const hash = first[eAuthPass.A_PASSWORD_HASH];
                        // validate password
                        result = await $bcrypt.compare(password, hash);
                    }
                    return result;
                }

                async function setPassword(trx, userId, password) {
                    const hash = await $bcrypt.hash(password, DEF.BCRYPT_HASH_ROUNDS);
                    await trx(eAuthPass.ENTITY)
                        .update({
                            [eAuthPass.A_PASSWORD_HASH]: hash,
                        })
                        .where({[eAuthPass.A_USER_REF]: userId});
                }

                // MAIN FUNCTIONALITY
                const result = new ApiResult();
                result.response = new Response();
                const trx = await rdb.startTransaction();
                /** @type {Fl32_Teq_User_Shared_Service_Route_ChangePassword_Request} */
                const apiReq = apiCtx.request;
                const sharedCtx = apiCtx.sharedContext;
                result.response.success = false;

                try {
                    if (sharedCtx && sharedCtx[DEF.HTTP_SHARE_CTX_USER]) {
                        /** @type {Fl32_Teq_User_Shared_Api_Data_User} */
                        const user = sharedCtx && sharedCtx[DEF.HTTP_SHARE_CTX_USER];
                        const isValid = await isValidPassword(trx, user.id, apiReq.passwordCurrent);
                        if (isValid) {
                            await setPassword(trx, user.id, apiReq.passwordNew);
                            result.response.success = true;
                        }
                    }
                    await trx.commit();
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
