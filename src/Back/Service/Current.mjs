/**
 * Service to get currently authenticated user data.
 *
 * @namespace Fl32_Teq_User_Back_Service_Current
 */

/**
 * @implements TeqFw_Web_Back_Api_Service_IFactory
 */
export default class Fl32_Teq_User_Back_Service_Current {

    constructor(spec) {
        /** @type {Fl32_Teq_User_Defaults} */
        const DEF = spec['Fl32_Teq_User_Defaults$'];
        /** @type {typeof TeqFw_Http2_Plugin_Handler_Service.Result} */
        const ApiResult = spec['TeqFw_Http2_Plugin_Handler_Service#Result'];
        /** @type {Fl32_Teq_User_Shared_Service_Route_Current.Factory} */
        const fRouteDto = spec['Fl32_Teq_User_Shared_Service_Route_Current#Factory$'];

        // DEFINE INSTANCE METHODS
        this.getDtoFactory = () => fRouteDto;

        this.getRoute = () => DEF.SERV.CURRENT;

        this.getService = function () {}

        /**
         * Factory to create service (handler to process HTTP API request).
         * @returns {TeqFw_Http2_Back_Api_Service_Factory.service}
         */
        this.createService = function () {
            // DEFINE INNER FUNCTIONS
            /**
             * @param {TeqFw_Http2_Plugin_Handler_Service.Context} apiCtx
             * @returns {Promise<TeqFw_Http2_Plugin_Handler_Service.Result>}
             * @memberOf Fl32_Teq_User_Back_Service_Current
             * @implements {TeqFw_Http2_Back_Api_Service_Factory.service}
             */
            async function service(apiCtx) {
                // MAIN FUNCTIONALITY
                const result = new ApiResult();
                const response = fRouteDto.createRes();
                result.response = response;
                const sharedCtx = apiCtx.sharedContext;
                if (sharedCtx && sharedCtx[DEF.HTTP_SHARE_CTX_USER]) {
                    response.user = sharedCtx[DEF.HTTP_SHARE_CTX_USER];
                }
                return result;
            }

            // COMPOSE RESULT
            Object.defineProperty(service, 'name', {value: `${this.constructor.name}.${service.name}`});
            return service;
        };
    }

}
