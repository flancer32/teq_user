/**
 * Service to get currently authenticated user data ("/api/${mod}/current").
 */
export default class Fl32_Teq_User_Back_Service_Current {

    constructor(spec) {
        /** @type {Fl32_Teq_User_Defaults} */
        const DEF = spec.Fl32_Teq_User_Defaults$;
        /** @type {typeof Fl32_Teq_User_Shared_Service_Route_Current_Request} */
        const Request = spec['Fl32_Teq_User_Shared_Service_Route_Current#Request'];   // class constructor
        /** @type {typeof Fl32_Teq_User_Shared_Service_Route_Current_Response} */
        const Response = spec['Fl32_Teq_User_Shared_Service_Route_Current#Response'];   // class constructor

        this.getRoute = function () {
            return '/current';
        };

        /**
         * Create function to validate and structure incoming data.
         * @return {Function}
         */
        this.createParser = function () {
            /**
             * @param {IncomingMessage} httpReq
             * @return {Fl32_Teq_User_Shared_Service_Route_Current_Request}
             * @exports Fl32_Teq_User_Back_Service_Current$parse
             */
            function Fl32_Teq_User_Back_Service_Current$parse(httpReq) {
                const body = httpReq.body;
                // clone HTTP body into API request object
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
             * @param {Fl32_Teq_User_Shared_Service_Route_Current_Request} apiReq
             * @param {IncomingMessage} httpReq
             * @return {Promise<Fl32_Teq_User_Shared_Service_Route_Current_Response>}
             * @exports Fl32_Teq_User_Back_Service_Current$process
             */
            async function Fl32_Teq_User_Back_Service_Current$process(apiReq, httpReq) {
                // DEFINE INNER FUNCTIONS

                // MAIN FUNCTIONALITY
                /** @type {Fl32_Teq_User_Shared_Service_Route_Current_Response} */
                const result = new Response();
                if (httpReq[DEF.HTTP_REQ_USER]) {
                    result.user = httpReq[DEF.HTTP_REQ_USER];
                }
                return result;
            }

            return Fl32_Teq_User_Back_Service_Current$process;
        };
    }

}
