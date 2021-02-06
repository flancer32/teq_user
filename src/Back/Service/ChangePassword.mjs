import $bcrypt from 'bcrypt';

/**
 * Service to get currently authenticated user data ("/api/${mod}/changePassword").
 */
export default class Fl32_Teq_User_Back_Service_ChangePassword {

    constructor(spec) {
        /** @type {Fl32_Teq_User_Defaults} */
        const DEF = spec['Fl32_Teq_User_Defaults$'];    // instance singleton
        /** @type {TeqFw_Core_App_Db_Connector} */
        const rdb = spec['TeqFw_Core_App_Db_Connector$'];  // instance singleton
        /** @type {Fl32_Teq_User_Store_RDb_Schema_Auth_Password} */
        const eAuthPass = spec['Fl32_Teq_User_Store_RDb_Schema_Auth_Password$'];   // instance singleton
        /** @type {typeof Fl32_Teq_User_Shared_Service_Route_ChangePassword_Request} */
        const Request = spec['Fl32_Teq_User_Shared_Service_Route_ChangePassword#Request'];   // class constructor
        /** @type {typeof Fl32_Teq_User_Shared_Service_Route_ChangePassword_Response} */
        const Response = spec['Fl32_Teq_User_Shared_Service_Route_ChangePassword#Response'];   // class constructor

        this.getRoute = function () {
            return DEF.ROUTE_CHANGE_PASSWORD;
        };

        /**
         * Create function to validate and structure incoming data.
         * @return {Function}
         */
        this.createParser = function () {
            /**
             * @param {IncomingMessage} httpReq
             * @return {Fl32_Teq_User_Shared_Service_Route_ChangePassword_Request}
             * @exports Fl32_Teq_User_Back_Service_ChangePassword$parse
             */
            function Fl32_Teq_User_Back_Service_ChangePassword$parse(httpReq) {
                const body = httpReq.body;
                // clone HTTP body into API request object
                return Object.assign(new Request(), body.data);
            }

            return Fl32_Teq_User_Back_Service_ChangePassword$parse;
        };

        /**
         * Create function to perform requested operation.
         * @return {Function}
         */
        this.createProcessor = function () {
            /**
             * @param {Fl32_Teq_User_Shared_Service_Route_ChangePassword_Request} apiReq
             * @param {IncomingMessage} httpReq
             * @return {Promise<Fl32_Teq_User_Shared_Service_Route_ChangePassword_Response>}
             * @exports Fl32_Teq_User_Back_Service_ChangePassword$process
             */
            async function Fl32_Teq_User_Back_Service_ChangePassword$process(apiReq, httpReq) {
                // DEFINE INNER FUNCTIONS

                async function isValidPassword(trx, userId, password) {
                    let result = false;
                    const query = trx.from(eAuthPass.ENTITY)
                        .select([eAuthPass.A_PASSWORD_HASH])
                        .where(eAuthPass.A_USER_REF, userId);
                    /** @type {TextRow[]} */
                    const rs = await query;
                    if (rs.length) {
                        const [first] = rs;
                        const hash = first[eAuthPass.A_PASSWORD_HASH];
                        // validate password
                        result = await $bcrypt.compare(password, hash);
                    }
                    return result;
                }

                async function setPassword(trx, userId, password) {
                    const hash = await $bcrypt.hash(password, DEF.BCRYPT_HASH_ROUNDS);
                    await trx(eAuthPass.ENTITY)
                        .update({
                            [eAuthPass.A_PASSWORD_HASH]: hash,
                        })
                        .where({[eAuthPass.A_USER_REF]: userId});
                }

                // MAIN FUNCTIONALITY
                /** @type {Fl32_Teq_User_Shared_Service_Route_ChangePassword_Response} */
                const result = new Response();
                result.success = false;
                const trx = await rdb.startTransaction();

                try {
                    if (httpReq[DEF.HTTP_REQ_CTX_USER]) {
                        /** @type {Fl32_Teq_User_Shared_Service_Data_User} */
                        const user = httpReq[DEF.HTTP_REQ_CTX_USER];
                        const isValid = await isValidPassword(trx, user.id, apiReq.passwordCurrent);
                        if (isValid) {
                            await setPassword(trx, user.id, apiReq.passwordNew);
                            result.success = true;
                        }
                    }
                    await trx.commit();
                } catch (error) {
                    await trx.rollback();
                    throw error;
                }
                return result;
            }

            return Fl32_Teq_User_Back_Service_ChangePassword$process;
        };
    }

}
