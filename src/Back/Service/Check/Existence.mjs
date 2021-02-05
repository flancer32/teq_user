/**
 * Check existence for different values (login, referral code, email, phone, ...).
 */
export default class Fl32_Teq_User_Back_Service_Check_Existence {

    constructor(spec) {
        /** @type {Fl32_Teq_User_Defaults} */
        const DEF = spec['Fl32_Teq_User_Defaults$'];    // instance singleton
        /** @type {TeqFw_Core_App_Db_Connector} */
        const rdb = spec['TeqFw_Core_App_Db_Connector$'];  // instance singleton
        /** @type {Fl32_Teq_User_Store_RDb_Schema_Auth_Password} */
        const eAuthPass = spec['Fl32_Teq_User_Store_RDb_Schema_Auth_Password$'];   // instance singleton
        /** @type {Fl32_Teq_User_Store_RDb_Schema_Id_Email} */
        const eIdEmail = spec['Fl32_Teq_User_Store_RDb_Schema_Id_Email$'];         // instance singleton
        /** @type {Fl32_Teq_User_Store_RDb_Schema_Id_Phone} */
        const eIdPhone = spec['Fl32_Teq_User_Store_RDb_Schema_Id_Phone$'];         // instance singleton
        /** @type {Fl32_Teq_User_Store_RDb_Schema_Ref_Link} */
        const eRefLink = spec['Fl32_Teq_User_Store_RDb_Schema_Ref_Link$'];         // instance singleton
        /** @type {typeof Fl32_Teq_User_Shared_Service_Route_Check_Existence_Request} */
        const Request = spec['Fl32_Teq_User_Shared_Service_Route_Check_Existence#Request'];   // class constructor
        /** @type {typeof Fl32_Teq_User_Shared_Service_Route_Check_Existence_Response} */
        const Response = spec['Fl32_Teq_User_Shared_Service_Route_Check_Existence#Response'];   // class constructor

        this.getRoute = function () {
            return DEF.ROUTE_CHECK_EXISTENCE;
        };

        /**
         * Create function to validate and structure incoming data.
         * @return {Function}
         */
        this.createParser = function () {
            /**
             * @param {IncomingMessage} httpReq
             * @return {Fl32_Teq_User_Shared_Service_Route_Check_Existence_Request}
             * @exports Fl32_Teq_User_Back_Service_Check_Existence$parse
             */
            function Fl32_Teq_User_Back_Service_Check_Existence$parse(httpReq) {
                const body = httpReq.body;
                // clone HTTP body into API request object
                return Object.assign(new Request(), body.data);
            }

            return Fl32_Teq_User_Back_Service_Check_Existence$parse;
        };

        /**
         * Create function to perform requested operation.
         * @return {Function}
         */
        this.createProcessor = function () {
            /**
             * @param {Fl32_Teq_User_Shared_Service_Route_Check_Existence_Request} apiReq
             * @return {Promise<Fl32_Teq_User_Shared_Service_Route_Check_Existence_Response>}
             * @exports Fl32_Teq_User_Back_Service_Check_Existence$process
             */
            async function Fl32_Teq_User_Back_Service_Check_Existence$process(apiReq) {
                // DEFINE INNER FUNCTIONS

                async function checkEmail(trx, value) {
                    const query = trx.from(eIdEmail.ENTITY);
                    query.select([eIdEmail.A_USER_REF]);
                    query.where(eIdEmail.A_EMAIL, value);
                    const rs = await query;
                    return (rs.length >= 1);
                }

                async function checkLogin(trx, value) {
                    const query = trx.from(eAuthPass.ENTITY);
                    query.select([eAuthPass.A_USER_REF]);
                    query.where(eAuthPass.A_LOGIN, value);
                    const rs = await query;
                    return (rs.length >= 1);
                }

                async function checkPhone(trx, value) {
                    const query = trx.from(eIdPhone.ENTITY);
                    query.select([eIdPhone.A_USER_REF]);
                    query.where(eIdPhone.A_PHONE, value);
                    const rs = await query;
                    return (rs.length >= 1);
                }

                async function checkRefCode(trx, value) {
                    const query = trx.from(eRefLink.ENTITY);
                    query.select([eRefLink.A_USER_REF]);
                    query.where(eRefLink.A_CODE, value);
                    const rs = await query;
                    return (rs.length >= 1);
                }

                // MAIN FUNCTIONALITY
                /** @type {Fl32_Teq_User_Shared_Service_Route_Check_Existence_Response} */
                const result = new Response();
                const trx = await rdb.startTransaction();

                try {
                    const type = apiReq.type;
                    if (apiReq.value) {
                        const value = apiReq.value.trim().toLowerCase();
                        if (type === Request.TYPE_EMAIL) {
                            result.exist = await checkEmail(trx, value);
                        } else if (type === Request.TYPE_LOGIN) {
                            result.exist = await checkLogin(trx, value);
                        } else if (type === Request.TYPE_PHONE) {
                            result.exist = await checkPhone(trx, value);
                        } else if (type === Request.TYPE_REF_CODE) {
                            result.exist = await checkRefCode(trx, value);
                        }
                    }
                    trx.commit();
                } catch (error) {
                    trx.rollback();
                    throw error;
                }
                return result;
            }

            return Fl32_Teq_User_Back_Service_Check_Existence$process;
        };
    }

}
