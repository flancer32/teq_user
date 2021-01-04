/**
 * Service to close session for authenticated user ("/api/${mod}/signOut").
 */
export default class Fl32_Teq_User_Back_Service_SignOut {

    constructor(spec) {
        /** @type {TeqFw_Core_App_Db_Connector} */
        const rdb = spec.TeqFw_Core_App_Db_Connector$;  // singleton instance
        /** @type {Fl32_Teq_User_Defaults} */
        const DEF = spec.Fl32_Teq_User_Defaults$;
        /** @type {Fl32_Teq_User_Store_RDb_Schema_Auth_Session} */
        const eAuthSess = spec.Fl32_Teq_User_Store_RDb_Schema_Auth_Session$;   // singleton instance
        const Request = spec['Fl32_Teq_User_Shared_Service_Route_SignOut#Request'];   // class constructor
        const Response = spec['Fl32_Teq_User_Shared_Service_Route_SignOut#Response'];   // class constructor

        this.getRoute = function () {
            return '/signOut';
        };

        /**
         * Create function to validate and structure incoming data.
         * @return {Function}
         */
        this.createParser = function () {
            /**
             * @param {IncomingMessage} httpReq
             * @return {Fl32_Teq_User_Shared_Service_Route_SignOut_Request}
             * @exports Fl32_Teq_User_Back_Service_SignOut$parse
             */
            function Fl32_Teq_User_Back_Service_SignOut$parse(httpReq) {
                const body = httpReq.body;
                // clone HTTP body into API request object
                return Object.assign(new Request(), body.data);
            }

            return Fl32_Teq_User_Back_Service_SignOut$parse;
        };

        /**
         * Create function to perform requested operation.
         * @return {Function}
         */
        this.createProcessor = function () {
            /**
             * @param {Fl32_Teq_User_Shared_Service_Route_SignOut_Request} apiReq
             * @param {IncomingMessage} httpReq
             * @return {Promise<Fl32_Teq_User_Shared_Service_Route_SignOut_Response>}
             * @exports Fl32_Teq_User_Back_Service_SignOut$process
             */
            async function Fl32_Teq_User_Back_Service_SignOut$process(apiReq, httpReq) {
                // DEFINE INNER FUNCTIONS

                async function deleteSessionById(trx, sessId) {
                    const query = trx.from(eAuthSess.ENTITY);
                    query.where(eAuthSess.A_SESSION_ID, sessId);
                    return await query.del();
                }


                // MAIN FUNCTIONALITY
                /** @type {Fl32_Teq_User_Shared_Service_Route_SignOut_Response} */
                const result = new Response();
                const trx = await rdb.startTransaction();
                try {
                    const sessId = httpReq[DEF.HTTP_REQ_SESSION_ID];
                    if (sessId) {
                        await deleteSessionById(trx, sessId);
                    }
                    await trx.commit();
                } catch (error) {
                    await trx.rollback();
                    throw error;
                }
                return result;
            }

            return Fl32_Teq_User_Back_Service_SignOut$process;
        };
    }

}
