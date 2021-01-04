/**
 * Middleware to load user data by sessionId.
 */
export default class Fl32_Teq_User_App_Server_Session {

    constructor(spec) {
        /** @type {Fl32_Teq_User_Defaults} */
        const DEF = spec.Fl32_Teq_User_Defaults$;  // singleton instance
        /** @type {TeqFw_Core_App_Db_Connector} */
        const rdb = spec.TeqFw_Core_App_Db_Connector$;  // singleton instance
        /** @type {Fl32_Teq_User_Store_RDb_Schema_Auth_Session} */
        const eAuthSess = spec.Fl32_Teq_User_Store_RDb_Schema_Auth_Session$;    // singleton instance
        /** @type {Fl32_Teq_User_Store_RDb_Schema_User} */
        const eUser = spec.Fl32_Teq_User_Store_RDb_Schema_User$;                // singleton instance
        /** @type {typeof Fl32_Teq_User_Shared_Service_Data_User} */
        const User = spec['Fl32_Teq_User_Shared_Service_Data_User#'];       // class constructor
        /** @type {Fl32_Teq_User_Store_RDb_Query_GetUsers} */
        const qGetUsers = spec.Fl32_Teq_User_Store_RDb_Query_GetUsers$; // singleton instance

        /**
         * @param {IncomingMessage} req
         * @param {ServerResponse} res
         * @param next
         */
        this.handle = function (req, res, next) {
            // DEFINE INNER FUNCTIONS

            /**
             * Extract session ID from cookies or HTTP headers.
             * @param {IncomingMessage} req
             * @return {null}
             */
            function extractSessionId(req) {
                let result = null;
                if (req.cookies && req.cookies[DEF.SESSION_COOKIE_NAME]) {
                    // there is session cookie in request
                    result = req.cookies[DEF.SESSION_COOKIE_NAME];
                } else if (req.headers && req.headers.authorization) {
                    const value = req.headers.authorization;
                    result = value.replace('Bearer ', '').trim();
                }
                return result;
            }

            /**
             * @param trx
             * @param {Number} userId
             * @return {Promise<Fl32_Teq_User_Shared_Service_Data_User|null>}
             */
            async function getUserById(trx, userId) {
                let result = null;
                const query = qGetUsers(trx);
                query.where(eUser.A_ID, userId);
                const rows = await query;
                if (rows[0]) {
                    /** @type {Fl32_Teq_User_Shared_Service_Data_User} */
                    result = Object.assign(new User(), rows[0]);
                }
                return result;
            }

            async function getSessionById(trx, sessId) {
                let result = null;
                const query = trx.from(eAuthSess.ENTITY);
                query.select([eAuthSess.A_DATE_CREATED, eAuthSess.A_SESSION_ID, eAuthSess.A_USER_REF]);
                query.where(eAuthSess.A_SESSION_ID, sessId);
                const rows = await query;
                if (rows[0]) {
                    result = rows[0];
                }
                return result;
            }

            // MAIN FUNCTIONALITY
            const sessId = extractSessionId(req);
            if (sessId) {
                // get ACL asynchronously
                rdb.startTransaction()
                    .then(async (trx) => {
                        try {
                            const sess = await getSessionById(trx, sessId);
                            const userId = sess[eAuthSess.A_USER_REF];
                            const dateInit = sess[eAuthSess.A_DATE_CREATED];
                            if (userId) {
                                const user = await getUserById(trx, userId);
                                user.dateLoggedIn = dateInit;
                                req[DEF.HTTP_REQ_USER] = user;
                                req[DEF.HTTP_REQ_SESSION_ID] = sessId;
                            }
                            await trx.commit();
                        } catch (e) {
                            await trx.rollback();
                            console.log('ACL middleware RDB exception: ' + e.message);
                        }
                        next();
                    })
                    .catch((e) => {
                        console.log('ACL middleware exception: ' + e.message);
                        next();
                    });
            } else {
                // there is no session ID in request, just continue synchronously
                next();
            }
        };
    }

}
