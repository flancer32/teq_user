/**
 * Service to get currently authenticated user data.
 * @implements TeqFw_Http2_Api_Back_Service_Factory
 */
export default class Fl32_Teq_User_Back_Service_Current {

    constructor(spec) {
        /** @type {Fl32_Teq_User_Defaults} */
        const DEF = spec['Fl32_Teq_User_Defaults$'];    // instance singleton
        /** @type {typeof TeqFw_Http2_Plugin_Handler_Service.Result} */
        const ApiResult = spec['TeqFw_Http2_Plugin_Handler_Service#Result'];    // class
        /** @type {typeof Fl32_Teq_User_Shared_Service_Route_Current.Response} */
        const Response = spec['Fl32_Teq_User_Shared_Service_Route_Current#Response'];   // class

        this.getRoute = () => DEF.SERV_CURRENT;

        /**
         * Factory to create service (handler to process HTTP API request).
         * @returns {TeqFw_Http2_Api_Back_Service_Factory.service}
         */
        this.createService = function () {
            // DEFINE INNER FUNCTIONS
            /**
             * @param {TeqFw_Http2_Plugin_Handler_Service.Context} apiCtx
             * @returns {Promise<TeqFw_Http2_Plugin_Handler_Service.Result>}
             * @memberOf Fl32_Teq_User_Back_Service_Current
             * @implements {TeqFw_Http2_Api_Back_Service_Factory.service}
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
