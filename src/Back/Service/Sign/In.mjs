import $bcrypt from 'bcrypt';
import {constants as H2} from 'http2';
import $path from 'path';

/**
 * Service to authenticate user by username/email/phone & password.
 * @implements TeqFw_Http2_Api_Back_Service_Factory
 */
export default class Fl32_Teq_User_Back_Service_Sign_In {

    constructor(spec) {
        /** @type {Fl32_Teq_User_Defaults} */
        const DEF = spec['Fl32_Teq_User_Defaults$'];    // instance singleton
        /** @type {TeqFw_Core_App_Db_Connector} */
        const rdb = spec['TeqFw_Core_App_Db_Connector$'];  // instance singleton
        const {cookieCreate} = spec['TeqFw_Http2_Back_Util']; // ES6 module destructing
        /** @type {Fl32_Teq_User_Back_Process_Session_Open} */
        const procSessionOpen = spec['Fl32_Teq_User_Back_Process_Session_Open$']; // instance singleton
        /** @type {typeof Fl32_Teq_User_Store_RDb_Schema_Auth_Password} */
        const EAuthPass = spec['Fl32_Teq_User_Store_RDb_Schema_Auth_Password#']; // class
        /** @type {typeof TeqFw_Http2_Plugin_Handler_Service.Result} */
        const ApiResult = spec['TeqFw_Http2_Plugin_Handler_Service#Result'];    // class
        /** @type {typeof Fl32_Teq_User_Shared_Service_Route_Sign_In_Request} */
        const Request = spec['Fl32_Teq_User_Shared_Service_Route_Sign_In#Request'];   // class
        /** @type {typeof Fl32_Teq_User_Shared_Service_Route_Sign_In_Response} */
        const Response = spec['Fl32_Teq_User_Shared_Service_Route_Sign_In#Response'];   // class

        this.getRoute = () => DEF.SERV_SIGN_IN;

        /**
         * Factory to create function to validate and structure incoming data.
         * @returns {TeqFw_Http2_Api_Back_Service_Factory.parse}
         */
        this.createInputParser = function () {
            // DEFINE INNER FUNCTIONS
            /**
             * Parser to structure HTTP request data.
             *
             * @param {TeqFw_Http2_Back_Server_Stream_Context} context
             * @returns {Fl32_Teq_User_Shared_Service_Route_Sign_In_Request}
             * @memberOf Fl32_Teq_User_Back_Service_Sign_In
             * @implements TeqFw_Http2_Api_Back_Service_Factory.parse
             */
            function parse(context) {
                const body = JSON.parse(context.body);
                return Object.assign(new Request(), body.data);  // clone HTTP body data into API request object
            }

            // COMPOSE RESULT
            Object.defineProperty(parse, 'name', {value: `${this.constructor.name}.${parse.name}`});
            return parse;
        };

        /**
         * Factory to create service (handler to process HTTP API request).
         * @returns {TeqFw_Http2_Api_Back_Service_Factory.service}
         */
        this.createService = function () {
            // DEFINE INNER FUNCTIONS
            /**
             * @param {TeqFw_Http2_Back_Server_Handler_Api.Context} apiCtx
             * @returns {Promise<TeqFw_Http2_Plugin_Handler_Service.Result>}
             * @memberOf Fl32_Teq_User_Back_Service_Sign_In
             * @implements {TeqFw_Http2_Api_Back_Service_Factory.service}
             */
            async function service(apiCtx) {
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
                const result = new ApiResult();
                result.response = new Response();
                const trx = await rdb.startTransaction();
                /** @type {Fl32_Teq_User_Shared_Service_Route_Sign_In_Request} */
                const apiReq = apiCtx.request;

                try {
                    // select user data by login name (this type of authentication is accepted at the moment)
                    const {userId, hash} = await getUserData(trx, apiReq.user);
                    if (userId && hash) {
                        // validate password
                        const equal = await $bcrypt.compare(apiReq.password, hash);
                        if (equal) {
                            // generate user session
                            const {output} = await procSessionOpen.exec({trx, userId});
                            result.response.sessionId = output.sessId;
                            // set session cookie
                            const headers = apiCtx.sharedContext[DEF.MOD_HTTP2.HTTP_SHARE_HEADERS];
                            const pathSrv = $path.join('/', DEF.MOD_CORE.AREA_API, DEF.BACK_REALM, DEF.SERV_SIGN_IN);
                            const pathHttp = headers[H2.HTTP2_HEADER_PATH];
                            const realm = pathHttp.replace(pathSrv, '');
                            result.headers[H2.HTTP2_HEADER_SET_COOKIE] = cookieCreate({
                                name: DEF.SESSION_COOKIE_NAME,
                                value: result.response.sessionId,
                                expires: DEF.SESSION_COOKIE_LIFETIME,
                                path: realm
                            });
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
