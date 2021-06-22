/**
 * HTTP2 requests handler to extract user session data.
 *
 * @namespace Fl32_Teq_User_Plugin_Http2_Handler_Session
 */
// MODULE'S IMPORT
import {constants as H2} from 'http2';

// MODULE'S VARS
const NS = 'Fl32_Teq_User_Plugin_Http2_Handler_Session';

// MODULE'S CLASSES

// MODULE'S FUNCTIONS
/**
 * Factory to create HTTP2 requests handler to extract user session data.
 *
 * @param {TeqFw_Di_SpecProxy} spec
 * @return {function}
 * @memberOf Fl32_Teq_User_Plugin_Http2_Handler_Session
 */
async function Factory(spec) {
    // EXTRACT DEPS
    /** @type {Fl32_Teq_User_Defaults} */
    const DEF = spec['Fl32_Teq_User_Defaults$'];  // singleton
    /** @type {TeqFw_Core_App_Logger} */
    const logger = spec['TeqFw_Core_App_Logger$'];  // singleton
    /** @type {Fl32_Teq_User_App_Cache_Session} */
    const cache = spec['Fl32_Teq_User_App_Cache_Session$']; // singleton
    /** @type {TeqFw_Core_App_Db_Connector} */
    const rdb = spec['TeqFw_Core_App_Db_Connector$'];  // singleton
    /** @type {TeqFw_Core_App_Util_Back_Cookie} */
    const utilCookie = spec['TeqFw_Core_App_Util_Back_Cookie$'];    // singleton
    /** @type {TeqFw_Http2_Back_Model_Realm_Registry} */
    const regRealms = spec['TeqFw_Http2_Back_Model_Realm_Registry$']; // singleton
    /** @type {typeof Fl32_Teq_User_Store_RDb_Schema_Auth_Session} */
    const EAuthSess = spec['Fl32_Teq_User_Store_RDb_Schema_Auth_Session#']; // class
    /** @type {typeof TeqFw_Http2_Back_Server_Stream_Report} */
    const Report = spec['TeqFw_Http2_Back_Server_Stream#Report'];   // class
    /** @function {@type Fl32_Teq_User_Back_Process_User_Load.process} */
    const procLoad = spec['Fl32_Teq_User_Back_Process_User_Load$']; // singleton

    // DEFINE INNER FUNCTIONS


    /**
     * Load user sessions data to request context.
     *
     * @param {TeqFw_Http2_Back_Server_Stream_Context} context
     * @returns {Promise<TeqFw_Http2_Back_Server_Stream_Report>}
     * @memberOf Fl32_Teq_User_Plugin_Http2_Handler_Session
     */
    async function handleHttp2Request(context) {
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
         * Compose "Clear cookie" HTTP header for wrong session ID.
         *
         * @param {String} sessId
         * @param {String} path current URL to extract realm to clean cookie
         * @param {TeqFw_Http2_Back_Server_Stream_Report} report
         * @returns {Promise<void>}
         */
        async function loadUserData(sessId, path, report) {
            // DEFINE INNER FUNCTIONS

            async function getSessionById(trx, sessId) {
                let result = null;
                const query = trx.from(EAuthSess.ENTITY);
                query.select([EAuthSess.A_DATE_CREATED, EAuthSess.A_SESSION_ID, EAuthSess.A_USER_REF]);
                query.where(EAuthSess.A_SESSION_ID, sessId);
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
                    const userId = sess[EAuthSess.A_USER_REF];
                    const dateInit = sess[EAuthSess.A_DATE_CREATED];
                    if (userId) {
                        /** @type {Fl32_Teq_User_Shared_Service_Dto_User} */
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
                    const addr = regRealms.parseAddress(path);
                    const realm = addr.realm ?? '';
                    result.headers[H2.HTTP2_HEADER_SET_COOKIE] = utilCookie.clear(DEF.SESSION_COOKIE_NAME, realm);
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
                    const path = headers[H2.HTTP2_HEADER_PATH];
                    await loadUserData(sessId, path, result);
                }
            }
        } catch (e) {
            result.headers[H2.HTTP2_HEADER_STATUS] = H2.HTTP_STATUS_UNAUTHORIZED;
            result.complete = true;
        }
        return result;
    }

    // MAIN FUNCTIONALITY
    const name = `${NS}.${handleHttp2Request.name}`;
    logger.debug(`HTTP2 requests handler '${name}' is created.`);
    // COMPOSE RESULT
    Object.defineProperty(handleHttp2Request, 'name', {value: `${NS}.${handleHttp2Request.name}`});
    return handleHttp2Request;

}

// MODULE'S FUNCTIONALITY

// MODULE'S EXPORT
Object.defineProperty(Factory, 'name', {value: `${NS}.${Factory.name}`});
export default Factory;