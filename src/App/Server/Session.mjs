/**
 * Middleware to load user data by sessionId.
 */
export default class Fl32_Teq_User_App_Server_Session {

    constructor(spec) {
        /** @type {Fl32_Teq_User_Defaults} */
        const DEF = spec['Fl32_Teq_User_Defaults$'];  // singleton instance
        /** @type {TeqFw_Core_App_Logger} */
        const logger = spec['TeqFw_Core_App_Logger$'];  // singleton instance
        /** @type {Fl32_Teq_User_App_Cache_Session} */
        const cache = spec['Fl32_Teq_User_App_Cache_Session$']; // singleton instance
        /** @type {TeqFw_Core_App_Db_Connector} */
        const rdb = spec['TeqFw_Core_App_Db_Connector$'];  // singleton instance
        /** @type {Fl32_Teq_User_Store_RDb_Schema_Auth_Session} */
        const eAuthSess = spec['Fl32_Teq_User_Store_RDb_Schema_Auth_Session$'];    // singleton instance
        /** @type {Fl32_Teq_User_Store_RDb_Schema_Id_Email} */
        const eIdEmail = spec.Fl32_Teq_User_Store_RDb_Schema_Id_Email$;         // singleton instance
        /** @type {Fl32_Teq_User_Store_RDb_Schema_Id_Phone} */
        const eIdPhone = spec.Fl32_Teq_User_Store_RDb_Schema_Id_Phone$;         // singleton instance
        /** @type {Fl32_Teq_User_Store_RDb_Schema_User} */
        const eUser = spec['Fl32_Teq_User_Store_RDb_Schema_User$'];                // singleton instance
        /** @type {typeof Fl32_Teq_User_Shared_Service_Data_User} */
        const DUser = spec['Fl32_Teq_User_Shared_Service_Data_User#'];       // class constructor
        /** @type {Fl32_Teq_User_Store_RDb_Query_GetUsers} */
        const qGetUsers = spec['Fl32_Teq_User_Store_RDb_Query_GetUsers$']; // singleton instance

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

            async function getEmails(trx, userId) {
                const result = [];
                const query = trx.from(eIdEmail.ENTITY);
                query.select([eIdEmail.A_EMAIL]);
                query.where(eIdEmail.A_USER_REF, userId);
                const rs = await query;
                if (rs.length > 0) {
                    for (const one of rs) result.push(one[eIdEmail.A_EMAIL]);
                }
                return result;
            }

            async function getPhones(trx, userId) {
                const result = [];
                const query = trx.from(eIdPhone.ENTITY);
                query.select([eIdPhone.A_PHONE]);
                query.where(eIdPhone.A_USER_REF, userId);
                const rs = await query;
                if (rs.length > 0) {
                    for (const one of rs) result.push(one[eIdPhone.A_PHONE]);
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
                    const user = new DUser();
                    result = Object.assign(user, rows[0]);
                }
                return result;
            }

            async function getSessionById(trx, sessId) {
                let result = null;
                const query = trx.from(eAuthSess.ENTITY);
                query.select([eAuthSess.A_DATE_CREATED, eAuthSess.A_SESSION_ID, eAuthSess.A_USER_REF]);
                query.where(eAuthSess.A_SESSION_ID, sessId);
                const rows = await query;
                if (rows.length) {
                    result = rows[0];
                }
                return result;
            }

            // MAIN FUNCTIONALITY
            const sessId = extractSessionId(req);
            if (sessId) {
                const userCached = cache.get(sessId);
                if (userCached) {
                    req[DEF.HTTP_REQ_USER] = userCached;
                    req[DEF.HTTP_REQ_SESSION_ID] = sessId;
                    next(); // continue synchronously
                } else {
                    // get user data from RDb asynchronously then continue
                    rdb.startTransaction()
                        .then(async (trx) => {
                            try {
                                const sess = await getSessionById(trx, sessId);
                                if (sess) {
                                    const userId = sess[eAuthSess.A_USER_REF];
                                    const dateInit = sess[eAuthSess.A_DATE_CREATED];
                                    if (userId) {
                                        /** @type {Fl32_Teq_User_Shared_Service_Data_User} */
                                        const user = await getUserById(trx, userId);
                                        user.dateLoggedIn = dateInit;
                                        // get parent data
                                        if (user.parentId !== user.id) {
                                            const parent = await getUserById(trx, user.parentId);
                                            user.parentName = parent.name;
                                        } else {
                                            user.parentName = user.name;
                                        }
                                        // emails & phones
                                        user.emails = await getEmails(trx, user.id);
                                        user.phones = await getPhones(trx, user.id);
                                        req[DEF.HTTP_REQ_USER] = user;
                                        req[DEF.HTTP_REQ_SESSION_ID] = sessId;
                                        cache.set(sessId, user);
                                    }
                                } else {
                                    // clear session id from cookies
                                    res.clearCookie(DEF.SESSION_COOKIE_NAME);
                                }
                                await trx.commit();
                                next(); // continue asynchronously in normal mode
                            } catch (e) {
                                await trx.rollback();
                                const stack = (e.stack) ?? '';
                                const orig = e.message ?? 'Unknown error';
                                const msg = `ACL middleware RDB exception: ${orig}`;
                                const error = {msg, stack};
                                const str = JSON.stringify({error});
                                logger.error(str);
                                res.setHeader('Content-Type', 'application/json');
                                res.status(401);
                                res.end(str);
                            }

                        })
                        .catch((e) => {
                            const stack = (e.stack) ?? '';
                            const orig = e.message ?? 'Unknown error';
                            const msg = `ACL middleware exception: ${orig}`;
                            const error = {msg, stack};
                            const str = JSON.stringify({error});
                            logger.error(str);
                            res.setHeader('Content-Type', 'application/json');
                            res.status(401);
                            res.end(str);
                        });
                }
            } else {
                next(); // there is no session ID in request, continue synchronously
            }
        };
    }

}
