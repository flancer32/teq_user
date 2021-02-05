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
         * Create function to perform requested operation.
         * @return {Function}
         */
        this.createProcessor = function () {
            /**
             * @param {Fl32_Teq_User_Shared_Service_Route_Current_Request} req
             * @param {IncomingHttpHeaders} headers
             * @exports Fl32_Teq_User_Back_Service_Current$process
             * @returns {Promise<{response: Fl32_Teq_User_Shared_Service_Route_Current_Response}>}
             * @constructor
             */
            async function Fl32_Teq_User_Back_Service_Current$process(req, headers) {
                // DEFINE INNER FUNCTIONS

                // MAIN FUNCTIONALITY
                /** @type {Fl32_Teq_User_Shared_Service_Route_Current_Response} */
                const response = new Response();
                if (headers[DEF.HTTP_REQ_USER]) {
                    response.user = headers[DEF.HTTP_REQ_USER];
                }
                return {response};
            }

            return Fl32_Teq_User_Back_Service_Current$process;
        };
    }

}
