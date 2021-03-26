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
 * @extends TeqFw_Http2_Back_Server_Handler_Api_Factory
 */
class Fl32_Teq_User_Back_Service_RefLink_Get {

    constructor(spec) {
        /** @type {Fl32_Teq_User_Defaults} */
        const DEF = spec['Fl32_Teq_User_Defaults$']; // instance singleton
        /** @type {TeqFw_Core_App_Db_Connector} */
        const rdb = spec['TeqFw_Core_App_Db_Connector$'];  // instance singleton
        /** @type {typeof TeqFw_Http2_Back_Server_Handler_Api_Result} */
        const ApiResult = spec['TeqFw_Http2_Back_Server_Handler_Api#Result']; // class constructor
        const {
            /** @type {typeof Fl32_Teq_User_Shared_Service_Route_RefLink_Get_Request} */
            Request,
            /** @type {typeof Fl32_Teq_User_Shared_Service_Route_RefLink_Get_Response} */
            Response
        } = spec['Fl32_Teq_User_Shared_Service_Route_RefLink_Get']; // ES6 module
        /** @function {@type Fl32_Teq_User_Back_Process_Referral_Link_CleanUp.process} */
        const procCleanUp = spec['Fl32_Teq_User_Back_Process_Referral_Link_CleanUp$']; // function singleton
        /** @function {@type Fl32_Teq_User_Back_Process_User_Load.process} */
        const procLoad = spec['Fl32_Teq_User_Back_Process_User_Load$']; // function singleton
        /** @type {typeof Fl32_Teq_User_Store_RDb_Schema_Ref_Link} */
        const ERefLink = spec['Fl32_Teq_User_Store_RDb_Schema_Ref_Link#']; // class constructor
        /** @type {typeof Fl32_Teq_User_Shared_Api_Data_RefLink} */
        const DRefLink = spec['Fl32_Teq_User_Shared_Api_Data_RefLink#']; // class constructor

        // DEFINE INSTANCE METHODS

        this.getRoute = () => DEF.SERV_REF_LINK_GET;

        /**
         * Factory to create function to validate and structure incoming data.
         * @returns {TeqFw_Http2_Back_Server_Handler_Api_Factory.parse}
         */
        this.createInputParser = function () {
            // DEFINE INNER FUNCTIONS
            /**
             * @param {TeqFw_Http2_Back_Server_Stream_Context} context
             * @returns {Fl32_Teq_User_Shared_Service_Route_RefLink_Get_Request}
             * @memberOf Fl32_Teq_User_Back_Service_RefLink_Get
             * @implements TeqFw_Http2_Back_Server_Handler_Api_Factory.parse
             */
            function parse(context) {
                const body = JSON.parse(context.body);
                /** @type {Fl32_Teq_User_Shared_Service_Route_RefLink_Get_Request} */
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
             * @memberOf Fl32_Teq_User_Back_Service_RefLink_Get
             * @implements {TeqFw_Http2_Back_Server_Handler_Api_Factory.service}
             */
            async function service(apiCtx) {
                // DEFINE INNER FUNCTIONS
                /**
                 * @param trx
                 * @param {String} code
                 * @returns {Promise<Fl32_Teq_User_Store_RDb_Schema_Ref_Link>}
                 */
                async function selectLinkByCode(trx, code) {
                    let result;
                    const norm = code.trim().toLowerCase();
                    const query = trx.from(ERefLink.ENTITY);
                    query.select();
                    query.where(ERefLink.A_CODE, norm);
                    /** @type {Array} */
                    const rs = await query;
                    if (rs.length === 1) {
                        const [first] = rs;
                        result = Object.assign(new ERefLink(), first);
                    }
                    return result;
                }

                // MAIN FUNCTIONALITY
                const result = new ApiResult();
                const response = new Response();
                result.response = response;
                const trx = await rdb.startTransaction();
                /** @type {Fl32_Teq_User_Shared_Service_Route_RefLink_Get_Request} */
                const apiReq = apiCtx.request;
                try {
                    // clean up expired links
                    await procCleanUp({trx});
                    // load link data by code
                    const code = apiReq.code;
                    const linkData = await selectLinkByCode(trx, code);
                    if (linkData) {
                        const link = new DRefLink();
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
