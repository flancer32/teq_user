/**
 * Service to create referral link for the user.
 *
 * @namespace Fl32_Teq_User_Back_Service_RefLink_Create
 */
// MODULE'S IMPORT
import {constants as H2} from 'http2';

// MODULE'S VARS
const NS = 'Fl32_Teq_User_Back_Service_RefLink_Create';

/**
 * Service to create referral link for the user.
 * @extends TeqFw_Http2_Back_Server_Handler_Api_Factory
 */
class Fl32_Teq_User_Back_Service_RefLink_Create {

    constructor(spec) {
        /** @type {Fl32_Teq_User_Defaults} */
        const DEF = spec['Fl32_Teq_User_Defaults$']; // instance singleton
        /** @type {TeqFw_Core_App_Db_Connector} */
        const rdb = spec['TeqFw_Core_App_Db_Connector$'];  // instance singleton
        /** @type {typeof TeqFw_Http2_Back_Server_Handler_Api_Result} */
        const ApiResult = spec['TeqFw_Http2_Back_Server_Handler_Api#Result']; // class constructor
        const {
            /** @type {typeof Fl32_Teq_User_Shared_Service_Route_RefLink_Create_Request} */
            Request,
            /** @type {typeof Fl32_Teq_User_Shared_Service_Route_RefLink_Create_Response} */
            Response
        } = spec['Fl32_Teq_User_Shared_Service_Route_RefLink_Create']; // ES6 module
        /** @function {@type Fl32_Teq_User_Back_Process_Referral_Link_Create.process} */
        const procCreate = spec['Fl32_Teq_User_Back_Process_Referral_Link_Create$']; // function singleton
        /** @function {@type Fl32_Teq_User_Back_Process_User_Load.process} */
        const procLoad = spec['Fl32_Teq_User_Back_Process_User_Load$']; // function singleton
        /** @type {typeof Fl32_Teq_User_Shared_Api_Data_RefLink} */
        const DRefLink = spec['Fl32_Teq_User_Shared_Api_Data_RefLink#']; // class constructor


        // DEFINE INSTANCE METHODS

        this.getRoute = () => DEF.SERV_REF_LINK_CREATE;

        /**
         * Factory to create function to validate and structure incoming data.
         * @returns {TeqFw_Http2_Back_Server_Handler_Api_Factory.parse}
         */
        this.createInputParser = function () {
            // DEFINE INNER FUNCTIONS
            /**
             * @param {TeqFw_Http2_Back_Server_Stream_Context} context
             * @returns {Fl32_Teq_User_Shared_Service_Route_RefLink_Create_Request}
             * @memberOf Fl32_Teq_User_Back_Service_RefLink_Create
             * @implements TeqFw_Http2_Back_Server_Handler_Api_Factory.parse
             */
            function parse(context) {
                const body = JSON.parse(context.body);
                /** @type {Fl32_Teq_User_Shared_Service_Route_RefLink_Create_Request} */
                return Object.assign(new Request(), body.data); // clone HTTP body into API request object
            }

            // COMPOSE RESULT
            Object.defineProperty(parse, 'name', {value: `${NS}.${parse.name}`});
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
             * @memberOf Fl32_Teq_User_Back_Service_RefLink_Create
             * @implements {TeqFw_Http2_Back_Server_Handler_Api_Factory.service}
             */
            async function service(apiCtx) {
                // DEFINE INNER FUNCTIONS

                // MAIN FUNCTIONALITY
                const result = new ApiResult();
                const response = new Response();
                result.response = response;
                const trx = await rdb.startTransaction();
                // /** @type {Fl32_Teq_User_Shared_Service_Route_RefLink_Create_Request} */
                // const apiReq = apiCtx.request;
                const shared = apiCtx.sharedContext;
                try {
                    /** @type {Fl32_Teq_User_Shared_Api_Data_User} */
                    const user = shared[DEF.HTTP_SHARE_CTX_USER];
                    if (user) {
                        const {link, dateExp} = await procCreate({trx, userId: user.id});
                        const data = new DRefLink();
                        data.parent = await procLoad({trx, userId: user.id});
                        data.refCode = link;
                        data.dateExpired = dateExp;
                        response.link = data;
                    } else {
                        result.headers[H2.HTTP2_HEADER_STATUS] = H2.HTTP_STATUS_UNAUTHORIZED;
                    }
                    await trx.commit();
                } catch (error) {
                    await trx.rollback();
                    throw error;
                }
                return result;
            }

            // COMPOSE RESULT
            Object.defineProperty(service, 'name', {value: `${NS}.${service.name}`});
            return service;
        };
    }

}

export default Fl32_Teq_User_Back_Service_RefLink_Create;
