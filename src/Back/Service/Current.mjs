/**
 * Service to get currently authenticated user data.
 * @extends TeqFw_Core_App_Server_Http2_Handler_Api_Factory
 */
export default class Fl32_Teq_User_Back_Service_Current {

    constructor(spec) {
        /** @type {Fl32_Teq_User_Defaults} */
        const DEF = spec['Fl32_Teq_User_Defaults$'];    // instance singleton
        /** @type {typeof TeqFw_Core_App_Server_Http2_Handler_Api_Result} */
        const ApiResult = spec['TeqFw_Core_App_Server_Http2_Handler_Api#Result'];    // class constructor
        /** @type {typeof Fl32_Teq_User_Shared_Service_Route_Current_Response} */
        const Response = spec['Fl32_Teq_User_Shared_Service_Route_Current#Response'];   // class constructor

        this.getRoute = function () {
            return DEF.API_CURRENT;
        };

        /**
         * Factory to create service (handler to process HTTP API request).
         * @returns {TeqFw_Core_App_Server_Http2_Handler_Api_Factory.service}
         */
        this.createService = function () {
            // DEFINE INNER FUNCTIONS
            /**
             * @param {TeqFw_Core_App_Server_Http2_Handler_Api_Context} apiCtx
             * @returns {Promise<TeqFw_Core_App_Server_Http2_Handler_Api_Result>}
             * @memberOf Fl32_Teq_User_Back_Service_Current
             * @implements {TeqFw_Core_App_Server_Http2_Handler_Api_Factory.service}
             */
            async function service(apiCtx) {
                // MAIN FUNCTIONALITY
                const result = new ApiResult();
                result.response = new Response();
                const sharedCtx = apiCtx.sharedContext;
                if (sharedCtx && sharedCtx[DEF.HTTP_SHARE_CTX_USER]) {
                    result.response.user = sharedCtx[DEF.HTTP_SHARE_CTX_USER];
                }
                return result;
            }

            // COMPOSE RESULT
            Object.defineProperty(service, 'name', {value: `${this.constructor.name}.${service.name}`});
            return service;
        };
    }

}
