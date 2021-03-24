import $bcrypt from 'bcrypt';
import $crypto from 'crypto';
import {constants as H2} from 'http2';

/**
 * Service to register new user.
 * @extends TeqFw_Http2_Back_Server_Handler_Api_Factory
 */
export default class Fl32_Teq_User_Back_Service_Sign_Up {

    constructor(spec) {
        /** @type {Fl32_Teq_User_Defaults} */
        const DEF = spec['Fl32_Teq_User_Defaults$'];
        /** @type {TeqFw_Core_App_Db_Connector} */
        const rdb = spec['TeqFw_Core_App_Db_Connector$'];  // instance singleton
        const {createCookie} = spec['TeqFw_Http2_Back_Util']; // ES6 module
        /** @type {Fl32_Teq_User_Store_RDb_Schema_Auth_Password} */
        const eAuthPass = spec['Fl32_Teq_User_Store_RDb_Schema_Auth_Password$'];   // instance singleton
        /** @type {Fl32_Teq_User_Store_RDb_Schema_Id_Email} */
        const eIdEmail = spec['Fl32_Teq_User_Store_RDb_Schema_Id_Email$'];         // instance singleton
        /** @type {Fl32_Teq_User_Store_RDb_Schema_Id_Phone} */
        const eIdPhone = spec['Fl32_Teq_User_Store_RDb_Schema_Id_Phone$'];         // instance singleton
        /** @type {Fl32_Teq_User_Store_RDb_Schema_Profile} */
        const eProfile = spec['Fl32_Teq_User_Store_RDb_Schema_Profile$'];          // instance singleton
        /** @type {typeof Fl32_Teq_User_Store_RDb_Schema_Ref_Link} */
        const ERefLink = spec['Fl32_Teq_User_Store_RDb_Schema_Ref_Link#'];         // instance singleton
        /** @type {Fl32_Teq_User_Store_RDb_Schema_Ref_Tree} */
        const eRefTree = spec['Fl32_Teq_User_Store_RDb_Schema_Ref_Tree$'];         // instance singleton
        /** @type {Fl32_Teq_User_Store_RDb_Schema_User} */
        const eUser = spec['Fl32_Teq_User_Store_RDb_Schema_User$'];                // instance singleton
        /** @type {Fl32_Teq_User_Back_Process_Session_Open} */
        const procSessionOpen = spec['Fl32_Teq_User_Back_Process_Session_Open$']; // instance singleton
        /** @type {typeof TeqFw_Http2_Back_Server_Handler_Api_Result} */
        const ApiResult = spec['TeqFw_Http2_Back_Server_Handler_Api#Result'];    // class constructor
        /** @type {typeof Fl32_Teq_User_Shared_Service_Route_Sign_Up_Request} */
        const Request = spec['Fl32_Teq_User_Shared_Service_Route_Sign_Up#Request'];   // class constructor
        /** @type {typeof Fl32_Teq_User_Shared_Service_Route_Sign_Up_Response} */
        const Response = spec['Fl32_Teq_User_Shared_Service_Route_Sign_Up#Response'];   // class constructor
        /** @type {typeof TeqFw_Core_App_Front_Gate_Response_Error} */
        const GateError = spec['TeqFw_Core_App_Front_Gate_Response_Error#'];    // class constructor
        /** @type {typeof Fl32_Teq_User_Shared_Service_Data_User} */
        const DUser = spec['Fl32_Teq_User_Shared_Service_Data_User#']; // class constructor

        this.getRoute = function () {
            return DEF.API_SIGN_UP;
        };

        /**
         * Factory to create function to validate and structure incoming data.
         * @returns {TeqFw_Http2_Back_Server_Handler_Api_Factory.parse}
         */
        this.createInputParser = function () {
            // DEFINE INNER FUNCTIONS
            /**
             * @param {TeqFw_Http2_Back_Server_Stream_Context} context
             * @returns {Fl32_Teq_User_Shared_Service_Route_Sign_Up_Request}
             * @memberOf Fl32_Teq_User_Back_Service_Sign_Up
             * @implements TeqFw_Http2_Back_Server_Handler_Api_Factory.parse
             */
            function parse(context) {
                const body = JSON.parse(context.body);
                return Object.assign(new Request(), body.data); // clone HTTP body into API request object
            }

            // COMPOSE RESULT
            Object.defineProperty(parse, 'name', {value: `${this.constructor.name}.${parse.name}`});
            return parse;
        };

        /**
         * Factory to create service (handler to process HTTP API request).
         * @returns {TeqFw_Http2_Back_Server_Handler_Api_Factory.service}
         */
        this.createService = function () {
            // DEFINE INNER FUNCTIONS
            /**
             * @param {TeqFw_Http2_Back_Server_Handler_Api_Context} apiCtx
             * @returns {Promise<TeqFw_Http2_Back_Server_Handler_Api_Result>}
             * @memberOf Fl32_Teq_User_Back_Service_Sign_Up
             * @implements {TeqFw_Http2_Back_Server_Handler_Api_Factory.service}
             */
            async function service(apiCtx) {
                // DEFINE INNER FUNCTIONS
                /**
                 * Register new user and return ID.
                 * @param trx
                 * @param {Fl32_Teq_User_Shared_Service_Route_Sign_Up_Request} req
                 * @param {Number} parentId
                 * @returns {Promise<Number>}
                 */
                async function addUser(trx, req, parentId) {
                    // DEFINE INNER FUNCTIONS

                    async function generateReferralCode(trx) {
                        let code, rs;
                        do {
                            code = $crypto.randomBytes(4).toString('hex').toLowerCase();
                            const query = trx.from(ERefLink.ENTITY);
                            rs = await query.select().where(ERefLink.A_CODE, code);
                        } while (rs.length > 0);
                        return code;
                    }

                    // MAIN FUNCTIONALITY
                    // register user
                    const rs = await trx(eUser.ENTITY).insert({}, eUser.A_ID);
                    const userId = rs[0];
                    // register login & password
                    const hash = await $bcrypt.hash(req.password, DEF.BCRYPT_HASH_ROUNDS);
                    await trx(eAuthPass.ENTITY).insert({
                        [eAuthPass.A_USER_REF]: userId,
                        [eAuthPass.A_LOGIN]: req.login.trim().toLowerCase(),
                        [eAuthPass.A_PASSWORD_HASH]: hash,
                    });
                    // register profile
                    await trx(eProfile.ENTITY).insert({
                        [eProfile.A_USER_REF]: userId,
                        [eProfile.A_NAME]: req.name.trim(),
                    });
                    // register user in the referrals tree
                    await trx(eRefTree.ENTITY).insert({
                        [eRefTree.A_USER_REF]: userId,
                        [eRefTree.A_PARENT_REF]: parentId,
                    });
                    // register referral code for the user
                    const code = await generateReferralCode(trx);
                    await trx(ERefLink.ENTITY).insert({
                        [ERefLink.A_USER_REF]: userId,
                        [ERefLink.A_CODE]: code,
                    });
                    // register email
                    if (typeof req.email === 'string') {
                        await trx(eIdEmail.ENTITY).insert({
                            [eIdEmail.A_USER_REF]: userId,
                            [eIdEmail.A_EMAIL]: req.email.trim().toLowerCase(),
                        });
                    }
                    // register phone
                    if (typeof req.phone === 'string') {
                        await trx(eIdPhone.ENTITY).insert({
                            [eIdPhone.A_USER_REF]: userId,
                            [eIdPhone.A_PHONE]: req.phone.trim().toLowerCase(),
                        });
                    }
                    return userId;
                }

                /**
                 * @param trx
                 * @param {String} code referral code
                 * @returns {Promise<Number|null>}
                 */
                async function getUserIdByRefCode(trx, code) {
                    let result = null;
                    if (code) {
                        const norm = code.trim().toLowerCase();
                        const query = trx.from(ERefLink.ENTITY);
                        query.select([ERefLink.A_USER_REF]);
                        query.where(ERefLink.A_CODE, norm);
                        /** @type {Array} */
                        const rs = await query;
                        if (rs.length === 1) {
                            const [first] = rs;
                            result = first[ERefLink.A_USER_REF];
                        }
                    }
                    return result;
                }

                /**
                 * Select data for newly registered user.
                 * @param trx
                 * @param {Number} userId
                 * @returns {Promise<Fl32_Teq_User_Shared_Service_Data_User>}
                 */
                async function selectUser(trx, userId) {

                    // DEFINE INNER FUNCTIONS

                    async function getEmails(trx, userId) {
                        let result = null;
                        const query = trx.from(eIdEmail.ENTITY);
                        query.select([eIdEmail.A_EMAIL]);
                        query.where(eIdEmail.A_USER_REF, userId);
                        const rs = await query;
                        if (rs.length > 0) {
                            result = [];
                            for (const one of rs) result.push(one[eIdEmail.A_EMAIL]);
                        }
                        return result;
                    }

                    async function getPhones(trx, userId) {
                        let result = null;
                        const query = trx.from(eIdPhone.ENTITY);
                        query.select([eIdPhone.A_PHONE]);
                        query.where(eIdPhone.A_USER_REF, userId);
                        const rs = await query;
                        if (rs.length > 0) {
                            result = [];
                            for (const one of rs) result.push(one[eIdPhone.A_PHONE]);
                        }
                        return result;
                    }

                    /**
                     * @param trx
                     * @param {Number} userId
                     * @returns {Promise<Fl32_Teq_User_Shared_Service_Data_User>}
                     */
                    async function getUser(trx, userId) {
                        const query = trx.from({u: eUser.ENTITY});
                        query.select([
                            {[DUser.A_ID]: `u.${eUser.A_ID}`},
                            {[DUser.A_DATE_CREATED]: `u.${eUser.A_DATE_CREATED}`},
                        ]);
                        query.leftOuterJoin(
                            {p: eProfile.ENTITY},
                            `p.${eProfile.A_USER_REF}`,
                            `u.${eUser.A_ID}`);
                        query.select([{[DUser.A_NAME]: `p.${eProfile.A_NAME}`}]);
                        query.leftOuterJoin(
                            {a: eAuthPass.ENTITY},
                            `a.${eAuthPass.A_USER_REF}`,
                            `u.${eUser.A_ID}`);
                        query.select([{[DUser.A_LOGIN]: `a.${eAuthPass.A_LOGIN}`}]);
                        query.leftOuterJoin(
                            {t: eRefTree.ENTITY},
                            `t.${eRefTree.A_USER_REF}`,
                            `u.${eUser.A_ID}`);
                        query.select([{[DUser.A_PARENT_ID]: `t.${eRefTree.A_PARENT_REF}`}]);
                        query.leftOuterJoin(
                            {l: ERefLink.ENTITY},
                            `l.${ERefLink.A_USER_REF}`,
                            `u.${eUser.A_ID}`);
                        query.select([{[DUser.A_REF_CODE]: `l.${ERefLink.A_CODE}`}]);
                        query.where(`u.${eUser.A_ID}`, userId);
                        const rows = await query;
                        return Object.assign(new DUser(), rows[0]);
                    }

                    // MAIN FUNCTIONALITY
                    const result = await getUser(trx, userId);
                    // get single/multiple attributes (email(s) & phone(s))
                    result.emails = await getEmails(trx, userId);
                    result.phones = await getPhones(trx, userId);
                    return result;
                }

                // MAIN FUNCTIONALITY
                const result = new ApiResult();
                result.response = new Response();
                const trx = await rdb.startTransaction();
                /** @type {Fl32_Teq_User_Shared_Service_Route_Sign_Up_Request} */
                const apiReq = apiCtx.request;

                try {
                    const parentId = await getUserIdByRefCode(trx, apiReq.referralCode);
                    if (parentId) {
                        // register new user in the tables
                        const userId = await addUser(trx, apiReq, parentId);
                        // select user data to compose API response
                        result.response.user = await selectUser(trx, userId);
                        const {output, error} = await procSessionOpen.exec({trx, userId});
                        result.response.sessionId = output.sessId;
                        // set session cookie
                        result.headers[H2.HTTP2_HEADER_SET_COOKIE] = createCookie({
                            name: DEF.SESSION_COOKIE_NAME,
                            value: result.response.sessionId,
                            expires: DEF.SESSION_COOKIE_LIFETIME,
                            path: '/'
                        });
                    } else {
                        const err = new GateError();
                        err.message = 'Unknown referral code.';
                        result.response = err;
                    }
                    await trx.commit();
                } catch (error) {
                    await trx.rollback();
                    throw error;
                }
                return result;
            }

            // COMPOSE RESULT
            Object.defineProperty(service, 'name', {value: `${this.constructor.name}.${service.name}`});
            return service;
        };
    }

}
