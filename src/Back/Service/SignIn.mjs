import $bcrypt from 'bcrypt';
import $crypto from 'crypto';

/**
 * Service to authenticate user ("/api/${mod}/signIn").
 */
export default class Fl32_Teq_User_Back_Service_SignIn {

    constructor(spec) {
        /** @type {TeqFw_Core_App_Db_Connector} */
        const rdb = spec.TeqFw_Core_App_Db_Connector$;  // singleton object
        /** @type {Fl32_Teq_User_Defaults} */
        const DEF = spec.Fl32_Teq_User_Defaults$;
        /** @type {Fl32_Teq_User_Store_RDb_Schema_Auth_Password} */
        const eAuthPass = spec.Fl32_Teq_User_Store_RDb_Schema_Auth_Password$;   // singleton object
        /** @type {Fl32_Teq_User_Store_RDb_Schema_Auth_Session} */
        const eAuthSess = spec.Fl32_Teq_User_Store_RDb_Schema_Auth_Session$;   // singleton object
        const Request = spec['Fl32_Teq_User_Shared_Service_Route_SignIn#Request'];   // class constructor
        const Response = spec['Fl32_Teq_User_Shared_Service_Route_SignIn#Response'];   // class constructor

        this.getRoute = function () {
            return '/signIn';
        };

        /**
         * Create function to validate and structure incoming data.
         * @return {Function}
         */
        this.getParser = function () {
            /**
             * @param {IncomingMessage} httpReq
             * @return {Fl32_Teq_User_Shared_Service_Route_SignIn_Request}
             * @exports Fl32_Teq_User_Back_Service_SignIn$parse
             */
            function Fl32_Teq_User_Back_Service_SignIn$parse(httpReq) {
                const body = httpReq.body;
                // clone HTTP body into API request object
                return Object.assign(new Request(), body.data);
            }

            return Fl32_Teq_User_Back_Service_SignIn$parse;
        };

        /**
         * Create function to perform requested operation.
         * @return {Function}
         */
        this.getProcessor = function () {
            /**
             * @param {Fl32_Teq_User_Shared_Service_Route_SignIn_Request} apiReq
             * @return {Promise<Fl32_Teq_User_Shared_Service_Route_SignIn_Response>}
             * @exports Fl32_Teq_User_Back_Service_SignIn$process
             */
            async function Fl32_Teq_User_Back_Service_SignIn$process(apiReq, res) {
                // DEFINE INNER FUNCTIONS
                /**
                 * Get user id & password hash by login name.
                 * @param trx
                 * @param {String} login
                 * @return {Promise<{userId: number, hash: string}>}
                 */
                async function getUserData(trx, login) {
                    const result = {};
                    const query = trx.from(eAuthPass.ENTITY);
                    query.select([eAuthPass.A_USER_REF, eAuthPass.A_PASSWORD_HASH]);
                    const norm = login.trim().toLowerCase();
                    query.where(eAuthPass.A_LOGIN, norm);
                    const rs = await query;
                    if (rs[0]) {
                        result.userId = rs[0][eAuthPass.A_USER_REF];
                        result.hash = rs[0][eAuthPass.A_PASSWORD_HASH];
                    }
                    return result;
                }

                async function openSession(trx, userId) {
                    // DEFINE INNER FUNCTIONS
                    async function getSessionById(sessId) {
                        const query = trx.from(eAuthSess.ENTITY);
                        query.select([eAuthSess.A_USER_REF]);
                        query.where(eAuthSess.A_SESSION_ID, sessId);
                        const rs = await query;
                        return rs[0] !== undefined;
                    }

                    async function createSession(trx, userId, sessId) {
                        await trx(eAuthSess.ENTITY).insert({
                            [eAuthSess.A_USER_REF]: userId,
                            [eAuthSess.A_SESSION_ID]: sessId,
                        });
                    }

                    // MAIN FUNCTIONALITY
                    let sessId = $crypto.randomBytes(DEF.SESSION_ID_BYTES).toString('hex');
                    let found = true;
                    do {
                        found = await getSessionById(sessId);
                    } while (found);
                    await createSession(trx, userId, sessId);
                    return sessId;
                }

                // MAIN FUNCTIONALITY
                /** @type {Fl32_Teq_User_Shared_Service_Route_SignIn_Response} */
                const result = new Response();
                const trx = await rdb.startTransaction();

                try {
                    // select user data by login name (this type of authentication is accepted at the moment)
                    const {userId, hash} = await getUserData(trx, apiReq.user);
                    if (userId && hash) {
                        // validate password
                        const equal = await $bcrypt.compare(apiReq.password, hash);
                        if (equal) {
                            // generate user session
                            result.sessionId = await openSession(trx, userId);
                            // set session cookie
                            res.cookie(DEF.SESSION_COOKIE_NAME, result.sessionId, {
                                maxAge: DEF.SESSION_COOKIE_LIFETIME,
                                httpOnly: true,
                                secure: true,
                                sameSite: true
                            });
                        }
                    }
                    trx.commit();
                } catch (error) {
                    trx.rollback();
                    throw error;
                }
                return result;
            }

            return Fl32_Teq_User_Back_Service_SignIn$process;
        };
    }

}
