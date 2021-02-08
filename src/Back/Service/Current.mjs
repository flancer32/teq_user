/**
 * Service to get currently authenticated user data ("/api/${mod}/current").
 * @extends TeqFw_Core_App_Server_Handler_Api_Factory
 */
export default class Fl32_Teq_User_Back_Service_Current {

    constructor(spec) {
        /** @type {Fl32_Teq_User_Defaults} */
        const DEF = spec['Fl32_Teq_User_Defaults$'];
        /** @type {typeof Fl32_Teq_User_Shared_Service_Route_Current_Response} */
        const Response = spec['Fl32_Teq_User_Shared_Service_Route_Current#Response'];   // class constructor

        this.getRoute = function () {
            return DEF.API_CURRENT;
        };

        /**
         * Factory to create service (handler to process HTTP API request).
         * @returns {Function}
         */
        this.createService = function () {
            /**
             * Service to handle HTTP API requests.
             *
             * @param {TeqFw_Core_App_Server_Handler_Api_Context} apiCtx API context for current request
             * @returns {Promise<void>}
             */
            async function service(apiCtx) {
                // PARSE INPUT & DEFINE WORKING VARS
                const sharedCtx = apiCtx.sharedContext;

                // MAIN FUNCTIONALITY
                /** @type {Fl32_Teq_User_Shared_Service_Route_Current_Response} */
                const response = new Response();
                if (sharedCtx && sharedCtx[DEF.HTTP_SHARE_CTX_USER]) {
                    response.user = sharedCtx[DEF.HTTP_SHARE_CTX_USER];
                }
                return {response};
            }

            // COMPOSE RESULT
            Object.defineProperty(service, 'name', {
                value: `${this.constructor.name}.${service.name}`,
            });
            return service;
        };
    }

}
