import {constants as H2} from 'http2';

/**
 * Factory to create HTTP2 server handler to load user sessions data to request context.
 *
 * @implements {TeqFw_Http2_Back_Server_Handler_Factory}
 */
export default class Fl32_Teq_User_App_Server_Handler_Session {

    constructor(spec) {
        /** @type {Fl32_Teq_User_Defaults} */
        const DEF = spec['Fl32_Teq_User_Defaults$'];  // instance singleton
        /** @type {TeqFw_Core_App_Logger} */
        const logger = spec['TeqFw_Core_App_Logger$'];  // instance singleton
        /** @type {Fl32_Teq_User_App_Cache_Session} */
        const cache = spec['Fl32_Teq_User_App_Cache_Session$']; // instance singleton
        /** @type {TeqFw_Core_App_Db_Connector} */
        const rdb = spec['TeqFw_Core_App_Db_Connector$'];  // instance singleton
        /** @type {TeqFw_Core_App_Util_Back_Cookie} */
        const utilCookie = spec['TeqFw_Core_App_Util_Back_Cookie$'];    // instance singleton
        /** @type {Fl32_Teq_User_Store_RDb_Schema_Auth_Session} */
        const eAuthSess = spec['Fl32_Teq_User_Store_RDb_Schema_Auth_Session$'];    // instance singleton
        /** @type {typeof TeqFw_Http2_Back_Server_Stream_Report} */
        const Report = spec['TeqFw_Http2_Back_Server_Stream#Report'];   // class constructor
        /** @function {@type Fl32_Teq_User_Back_Process_User_Load.process} */
        const procLoad = spec['Fl32_Teq_User_Back_Process_User_Load$']; // function singleton

        /**
         * Create handler to load user sessions data to request context.
         * @returns {Promise<Fl32_Teq_User_App_Server_Handler_Session.handler>}
         */
        this.createHandler = async function () {
            // DEFINE INNER FUNCTIONS
            /**
             * Handler to load user sessions data to request context.
             *
             * @param {TeqFw_Http2_Back_Server_Stream_Context} context
             * @returns {Promise<TeqFw_Http2_Back_Server_Stream_Report>}
             * @memberOf Fl32_Teq_User_App_Server_Handler_Session
             * @implements {TeqFw_Http2_Back_Server_Stream.handler}
             */
            async function handler(context) {
                // DEFINE INNER FUNCTIONS
                /**
                 * Extract session ID from cookies or HTTP headers.
                 * @param {Object<String, String>} headers
                 * @returns {String|null}
                 */
                function extractSessionId(headers) {
                    let result = null;
                    if (headers[H2.HTTP2_HEADER_COOKIE]) {
                        const cookies = headers[H2.HTTP2_HEADER_COOKIE];
                        const name = DEF.SESSION_COOKIE_NAME;
                        const value = cookies.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || '';
                        if (value.length) {
                            // there is session cookie in HTTP request
                            result = value;
                        }
                    } else if (headers[H2.HTTP2_HEADER_AUTHORIZATION]) {
                        const value = headers[H2.HTTP2_HEADER_AUTHORIZATION];
                        result = value.replace('Bearer ', '').trim();
                    }
                    return result;
                }

                /**
                 * Load user data using session ID and place it to the report's additional shared objects.
                 * @param {String} sessId
                 * @param {TeqFw_Http2_Back_Server_Stream_Report} report
                 * @returns {Promise<void>}
                 */
                async function loadUserData(sessId, report) {
                    // DEFINE INNER FUNCTIONS

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
                    const trx = await rdb.startTransaction();

                    try {
                        const sess = await getSessionById(trx, sessId);
                        if (sess) {
                            const userId = sess[eAuthSess.A_USER_REF];
                            const dateInit = sess[eAuthSess.A_DATE_CREATED];
                            if (userId) {
                                /** @type {Fl32_Teq_User_Shared_Api_Data_User} */
                                const user = await procLoad({trx, userId});
                                user.dateLoggedIn = dateInit;
                                // get parent data
                                if (user.parentId !== user.id) {
                                    const parent = await procLoad({trx, userId: user.parentId});
                                    user.parentName = parent.name;
                                } else {
                                    user.parentName = user.name;
                                }
                                report.sharedAdditional[DEF.HTTP_SHARE_CTX_USER] = user;
                                report.sharedAdditional[DEF.HTTP_SHARE_CTX_SESSION_ID] = sessId;
                                cache.set(sessId, user);
                            }
                        } else {
                            // clear session id from cookies
                            result.headers[H2.HTTP2_HEADER_SET_COOKIE] = utilCookie.clear(DEF.SESSION_COOKIE_NAME);
                            result.headers[H2.HTTP2_HEADER_STATUS] = H2.HTTP_STATUS_UNAUTHORIZED;
                            result.complete = true;
                        }
                        await trx.commit();
                    } catch (e) {
                        await trx.rollback();
                        throw e;
                    }
                }

                // MAIN FUNCTIONALITY
                const result = new Report();
                /** @type {Object<String, String>} */
                const headers = context.headers;
                try {
                    // process request, compose response and write it to the 'stream'
                    const sessId = extractSessionId(headers);
                    if (sessId) {
                        const userCached = cache.get(sessId);
                        if (userCached) {
                            result.sharedAdditional[DEF.HTTP_SHARE_CTX_USER] = userCached;
                            result.sharedAdditional[DEF.HTTP_SHARE_CTX_SESSION_ID] = sessId;
                        } else {
                            await loadUserData(sessId, result);
                        }
                    }
                } catch (e) {
                    result.headers[H2.HTTP2_HEADER_STATUS] = H2.HTTP_STATUS_UNAUTHORIZED;
                    result.complete = true;
                }
                return result;
            }

            // MAIN FUNCTIONALITY
            const name = `${this.constructor.name}.${handler.name}`;
            logger.debug(`HTTP2 requests handler '${name}' is created.`);
            // COMPOSE RESULT
            Object.defineProperty(handler, 'name', {value: `${this.constructor.name}.${handler.name}`});
            return handler;
        };
    }

}
