/**
 * Service to get currently authenticated user data ("/api/${mod}/current").
 */
export default class Fl32_Teq_User_Back_Service_Current {

    constructor(spec) {
        /** @type {Fl32_Teq_User_Defaults} */
        const DEF = spec['Fl32_Teq_User_Defaults$'];
        /** @type {typeof Fl32_Teq_User_Shared_Service_Route_Current_Request} */
        const Request = spec['Fl32_Teq_User_Shared_Service_Route_Current#Request'];   // class constructor
        /** @type {typeof Fl32_Teq_User_Shared_Service_Route_Current_Response} */
        const Response = spec['Fl32_Teq_User_Shared_Service_Route_Current#Response'];   // class constructor

        this.getRoute = function () {
            return DEF.ROUTE_CURRENT;
        };

        /**
         * Create function to validate and structure incoming data.
         * @return {Function}
         */
        this.createParser = function () {
            /**
             * @param {String} body
             * @param {IncomingHttpHeaders} headers
             * @return {Fl32_Teq_User_Shared_Service_Route_Current_Request}
             * @exports Fl32_Teq_User_Back_Service_Current$parse
             */
            function Fl32_Teq_User_Back_Service_Current$parse(body, headers) {
                return Object.assign(new Request(), body.data);
            }

            return Fl32_Teq_User_Back_Service_Current$parse;
        };

        /**
         * Factory to create service (handler to process HTTP API request).
         * @returns {Function}
         */
        this.createService = function () {
            /**
             * Service to handle HTTP API requests.
             *
             * @param {TeqFw_Core_App_Server_Request_Context} context HTTP2 request context
             * @returns {Promise<void>}
             */
            async function service(context) {
                // PARSE INPUT & DEFINE WORKING VARS
                /** @type {Fl32_Teq_User_Shared_Service_Data_User} */
                const user = context[DEF.HTTP_REQ_CTX_USER];
                // DEFINE INNER FUNCTIONS

                // MAIN FUNCTIONALITY
                /** @type {Fl32_Teq_User_Shared_Service_Route_Current_Response} */
                const response = new Response();
                if (user) {
                    response.user = user;
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
