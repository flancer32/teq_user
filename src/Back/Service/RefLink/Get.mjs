import {constants as H2} from 'http2';

/**
 * Service to get referral link data (exp. date and parent data).
 *
 * @namespace Fl32_Teq_User_Back_Service_RefLink_Get
 */
// MODULE'S VARS
const NS = 'Fl32_Teq_User_Back_Service_RefLink_Get';

/**
 * Service to get referral link data (exp. date and parent data).
 * @implements TeqFw_Http2_Api_Back_Service_Factory
 */
class Fl32_Teq_User_Back_Service_RefLink_Get {

    constructor(spec) {
        /** @type {Fl32_Teq_User_Defaults} */
        const DEF = spec['Fl32_Teq_User_Defaults$']; // singleton
        /** @type {TeqFw_Core_Db_Connector} */
        const rdb = spec['TeqFw_Core_Db_Connector$'];  // singleton
        /** @type {typeof TeqFw_Http2_Plugin_Handler_Service.Result} */
        const ApiResult = spec['TeqFw_Http2_Plugin_Handler_Service#Result']; // class
        /** @type {Fl32_Teq_User_Shared_Service_Route_RefLink_Get.Factory} */
        const factRoute = spec['Fl32_Teq_User_Shared_Service_Route_RefLink_Get#Factory$']; // singleton
        /** @function {@type Fl32_Teq_User_Back_Process_Referral_Link_CleanUp.process} */
        const procCleanUp = spec['Fl32_Teq_User_Back_Process_Referral_Link_CleanUp$']; // singleton
        /** @function {@type Fl32_Teq_User_Back_Process_Referral_Link_Get.process} */
        const procGet = spec['Fl32_Teq_User_Back_Process_Referral_Link_Get$']; // singleton
        /** @function {@type Fl32_Teq_User_Back_Process_User_Load.process} */
        const procLoad = spec['Fl32_Teq_User_Back_Process_User_Load$']; // singleton
        /** @type {Fl32_Teq_User_Shared_Service_Dto_RefLink.Factory} */
        const fRefLink = spec['Fl32_Teq_User_Shared_Service_Dto_RefLink#Factory$']; // singleton

        // DEFINE INSTANCE METHODS

        this.getRoute = () => DEF.SERV_REF_LINK_GET;

        /**
         * Factory to create function to validate and structure incoming data.
         * @returns {TeqFw_Http2_Api_Back_Service_Factory.parse}
         */
        this.createInputParser = function () {
            // DEFINE INNER FUNCTIONS
            /**
             * @param {TeqFw_Http2_Back_Server_Stream_Context} context
             * @returns {Fl32_Teq_User_Shared_Service_Route_RefLink_Get.Request}
             * @memberOf Fl32_Teq_User_Back_Service_RefLink_Get
             * @implements TeqFw_Http2_Api_Back_Service_Factory.parse
             */
            function parse(context) {
                const body = JSON.parse(context.body);
                return factRoute.createReq(body.data);
            }

            // COMPOSE RESULT
            Object.defineProperty(parse, 'name', {value: `${NS}.${parse.name}`});
            return parse;
        };

        /**
         * Factory to create service (handler to process HTTP API request).
         * @returns {TeqFw_Http2_Api_Back_Service_Factory.service}
         */
        this.createService = function () {
            // DEFINE INNER FUNCTIONS
            /**
             * @param {TeqFw_Http2_Plugin_Handler_Service.Context} apiCtx
             * @returns {Promise<TeqFw_Http2_Plugin_Handler_Service.Result>}
             * @memberOf Fl32_Teq_User_Back_Service_RefLink_Get
             * @implements {TeqFw_Http2_Api_Back_Service_Factory.service}
             */
            async function service(apiCtx) {
                const result = new ApiResult();
                const response = factRoute.createRes();
                result.response = response;
                const trx = await rdb.startTransaction();
                /** @type {Fl32_Teq_User_Shared_Service_Route_RefLink_Get.Request} */
                const apiReq = apiCtx.request;
                try {
                    // clean up expired links
                    await procCleanUp({trx});
                    // load link data by code
                    const code = apiReq.code;
                    const linkData = await procGet({trx, code});
                    if (linkData) {
                        const link = fRefLink.create();
                        link.parent = await procLoad({trx, userId: linkData.user_ref});
                        link.refCode = linkData.code;
                        link.dateExpired = new Date(linkData.date_expired);
                        response.link = link;
                    } else {
                        result.headers[H2.HTTP2_HEADER_STATUS] = H2.HTTP_STATUS_NOT_FOUND;
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

export default Fl32_Teq_User_Back_Service_RefLink_Get;
