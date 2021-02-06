/**
 * Factory to create handler to load user sessions data to request context.
 *
 * @implements {TeqFw_Core_App_Server_Handler_Factory}
 */
export default class Fl32_Teq_User_App_Server_Session {

    constructor(spec) {
        /** @type {Fl32_Teq_User_Defaults} */
        const DEF = spec['Fl32_Teq_User_Defaults$'];  // instance singleton
        /** @type {TeqFw_Core_App_Logger} */
        const logger = spec['TeqFw_Core_App_Logger$'];  // instance singleton
        /** @type {Fl32_Teq_User_App_Cache_Session} */
        const cache = spec['Fl32_Teq_User_App_Cache_Session$']; // instance singleton
        /** @type {TeqFw_Core_App_Db_Connector} */
        const rdb = spec['TeqFw_Core_App_Db_Connector$'];  // instance singleton
        /** @type {Fl32_Teq_User_Store_RDb_Schema_Auth_Session} */
        const eAuthSess = spec['Fl32_Teq_User_Store_RDb_Schema_Auth_Session$'];    // instance singleton
        /** @type {Fl32_Teq_User_Store_RDb_Schema_Id_Email} */
        const eIdEmail = spec.Fl32_Teq_User_Store_RDb_Schema_Id_Email$;         // instance singleton
        /** @type {Fl32_Teq_User_Store_RDb_Schema_Id_Phone} */
        const eIdPhone = spec.Fl32_Teq_User_Store_RDb_Schema_Id_Phone$;         // instance singleton
        /** @type {Fl32_Teq_User_Store_RDb_Schema_User} */
        const eUser = spec['Fl32_Teq_User_Store_RDb_Schema_User$'];                // instance singleton
        /** @type {typeof Fl32_Teq_User_Shared_Service_Data_User} */
        const DUser = spec['Fl32_Teq_User_Shared_Service_Data_User#'];       // class constructor
        /** @type {Fl32_Teq_User_Store_RDb_Query_GetUsers} */
        const qGetUsers = spec['Fl32_Teq_User_Store_RDb_Query_GetUsers$']; // instance singleton

        /**
         * Create handler to load user sessions data to request context.
         * @returns {Promise<Fl32_Teq_User_App_Server_Session.handler>}
         */
        this.createHandler = async function () {
            // DEFINE INNER FUNCTIONS
            /**
             * Handler to load user sessions data to request context.
             *
             * @param {Object} context
             * @returns {Promise<boolean>}
             * @memberOf Fl32_Teq_User_App_Server_Session
             * @implements {TeqFw_Core_App_Server_Handler_Factory.handler}
             */
            async function handler(context) {
                // PARSE INPUT & DEFINE WORKING VARS
                /** @type {String} */
                const body = context[DEF.MOD_CORE.HTTP_REQ_CTX_BODY];
                /** @type {Number} */
                const flags = context[DEF.MOD_CORE.HTTP_REQ_CTX_FLAGS];
                /** @type {IncomingHttpHeaders} */
                const headers = context[DEF.MOD_CORE.HTTP_REQ_CTX_HEADERS];
                /** @type {ServerHttp2Stream} */
                const stream = context[DEF.MOD_CORE.HTTP_REQ_CTX_STREAM];

                // DEFINE INNER FUNCTIONS
                /**
                 * Extract session ID from cookies or HTTP headers.
                 * @param {IncomingHttpHeaders} headers
                 * @return {String|null}
                 */
                function extractSessionId(headers) {
                    let result = null;
                    if (headers.cookies && headers.cookies[DEF.SESSION_COOKIE_NAME]) {
                        // there is session cookie in request
                        result = headers.cookies[DEF.SESSION_COOKIE_NAME];
                    } else if (headers.headers && headers.headers.authorization) {
                        const value = headers.headers.authorization;
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
                let result = false;
                try {
                    // process request, compose response and write it to the 'stream'
                    const sessId = extractSessionId(headers);
                    if (sessId) {
                        const userCached = cache.get(sessId);
                        if (userCached) {
                            req[DEF.HTTP_REQ_CTX_USER] = userCached;
                            req[DEF.HTTP_REQ_CTX_SESSION_ID] = sessId;
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
                                                req[DEF.HTTP_REQ_CTX_USER] = user;
                                                req[DEF.HTTP_REQ_CTX_SESSION_ID] = sessId;
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
                        result = true;  // return 'true' if request is completely processed
                    }
                } catch (e) {
                    debugger;
                }
                return result;
            }

            // MAIN FUNCTIONALITY
            const name = `${this.constructor.name}.${handler.name}`;
            logger.debug(`HTTP2 requests handler '${name}' is created.`);
            // COMPOSE RESULT
            Object.defineProperty(handler, 'name', {value: name});
            return handler;
        };
    }

}
