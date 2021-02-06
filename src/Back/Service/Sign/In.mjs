import $bcrypt from 'bcrypt';
import $crypto from 'crypto';
import {constants as H2} from 'http2';

/**
 * Service to authenticate user by username/email/phone & password.
 */
export default class Fl32_Teq_User_Back_Service_Sign_In {

    constructor(spec) {
        /** @type {Fl32_Teq_User_Defaults} */
        const DEF = spec['Fl32_Teq_User_Defaults$'];    // instance singleton
        /** @type {TeqFw_Core_App_Db_Connector} */
        const rdb = spec['TeqFw_Core_App_Db_Connector$'];  // instance singleton
        /** @type {Fl32_Teq_User_Store_RDb_Schema_Auth_Password} */
        const eAuthPass = spec['Fl32_Teq_User_Store_RDb_Schema_Auth_Password$'];   // instance singleton
        /** @type {Fl32_Teq_User_Store_RDb_Schema_Auth_Session} */
        const eAuthSess = spec['Fl32_Teq_User_Store_RDb_Schema_Auth_Session$'];   // instance singleton
        /** @type {typeof Fl32_Teq_User_Shared_Service_Route_Sign_In_Request} */
        const Request = spec['Fl32_Teq_User_Shared_Service_Route_Sign_In#Request'];   // class constructor
        /** @type {typeof Fl32_Teq_User_Shared_Service_Route_Sign_In_Response} */
        const Response = spec['Fl32_Teq_User_Shared_Service_Route_Sign_In#Response'];   // class constructor

        this.getRoute = function () {
            return DEF.API_SIGN_IN;
        };

        /**
         * TODO: change interface to createService and create base abstract class
         *
         * Create function to validate and structure incoming data.
         * @return {Function}
         */
        this.createParser = function () {
            /**
             * @param {Object} context
             * @return {Fl32_Teq_User_Shared_Service_Route_Sign_In_Request}
             * @exports Fl32_Teq_User_Back_Service_Sign_In$parse
             */
            function parse(context) {
                const body = httpReq.body;
                // clone HTTP body into API request object
                return Object.assign(new Request(), body.data);
            }

            return parse;
        };

        /**
         * Create function to perform requested operation.
         * @return {Function}
         */
        this.createService = function () {
            // DEFINE INNER FUNCTIONS
            /**
             * TODO: parser should be separate function to handle 'HTTP 400: Bad Request'
             * Parse input data and compose API request data object.
             * @param {String} body HTTP POST request body
             */
            function parseInput(body) {
                const json = JSON.parse(body);
                // clone HTTP body into API request object
                return Object.assign(new Request(), json.data);
            }

            /**
             * @param {TeqFw_Core_App_Server_Request_Context} context
             * @implements {TeqFw_Core_App_Server_Handler_Api_Factory.service}
             */
            async function service(context) {
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
                const result = {};
                /** @type {Fl32_Teq_User_Shared_Service_Route_Sign_In_Response} */
                const response = new Response();
                result.response = response;

                const apiReq = parseInput(body);
                const trx = await rdb.startTransaction();

                try {
                    // select user data by login name (this type of authentication is accepted at the moment)
                    const {userId, hash} = await getUserData(trx, apiReq.user);
                    if (userId && hash) {
                        // validate password
                        const equal = await $bcrypt.compare(apiReq.password, hash);
                        if (equal) {
                            // generate user session
                            response.sessionId = await openSession(trx, userId);
                            // set session cookie
                            const name = DEF.SESSION_COOKIE_NAME;
                            const value = response.sessionId;
                            const now = new Date(Date.now() + DEF.SESSION_COOKIE_LIFETIME);
                            const exp = `Expires=${now.toUTCString()}`;
                            const same = 'SameSite=Strict';
                            const secure = 'Secure; HttpOnly';
                            const cookie = `${name}=${value}; ${exp}; ${same}; ${secure}`;
                            result.headers = {[H2.HTTP2_HEADER_SET_COOKIE]: cookie};
                        }
                    }
                    await trx.commit();
                } catch (error) {
                    await trx.rollback();
                    throw error;
                }
                return result;
            }

            // COMPOSE RESULT
            Object.defineProperty(service, 'name', {
                value: `${this.constructor.name}.${service.name}`,
            });
            return service;
        };
    }

}
