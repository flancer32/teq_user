/**
 * Register new user.
 *
 * @namespace Fl32_Teq_User_Back_Service_Sign_Up
 */
// MODULE'S IMPORT
import $bcrypt from 'bcrypt';
import $crypto from 'crypto';
import {constants as H2} from 'http2';

// MODULE'S VARS
const NS = 'Fl32_Teq_User_Back_Service_Sign_Up';

/**
 * @implements TeqFw_Web_Back_Api_Service_IFactory
 */
export default class Fl32_Teq_User_Back_Service_Sign_Up {

    constructor(spec) {
        // EXTRACT DEPS
        /** @type {Fl32_Teq_User_Back_Defaults} */
        const DEF = spec['Fl32_Teq_User_Back_Defaults$'];
        /** @type {TeqFw_Core_Back_RDb_Connector} */
        const rdb = spec['TeqFw_Core_Back_RDb_Connector$'];
        /** @type {Function|TeqFw_Http2_Back_Util.cookieCreate} */
        const cookieCreate = spec['TeqFw_Http2_Back_Util#cookieCreate'];
        /** @type {typeof Fl32_Teq_User_Store_RDb_Schema_Auth_Password} */
        const EAuthPass = spec['Fl32_Teq_User_Store_RDb_Schema_Auth_Password#'];
        /** @type {typeof Fl32_Teq_User_Store_RDb_Schema_Id_Email} */
        const EIdEmail = spec['Fl32_Teq_User_Store_RDb_Schema_Id_Email#'];
        /** @type {typeof Fl32_Teq_User_Store_RDb_Schema_Id_Phone} */
        const EIdPhone = spec['Fl32_Teq_User_Store_RDb_Schema_Id_Phone#'];
        /** @type {typeof Fl32_Teq_User_Store_RDb_Schema_Profile} */
        const EProfile = spec['Fl32_Teq_User_Store_RDb_Schema_Profile#'];
        /** @type {typeof Fl32_Teq_User_Store_RDb_Schema_Ref_Link} */
        const ERefLink = spec['Fl32_Teq_User_Store_RDb_Schema_Ref_Link#'];
        /** @type {typeof Fl32_Teq_User_Store_RDb_Schema_Ref_Tree} */
        const ERefTree = spec['Fl32_Teq_User_Store_RDb_Schema_Ref_Tree#'];
        /** @type {typeof Fl32_Teq_User_Store_RDb_Schema_User} */
        const EUser = spec['Fl32_Teq_User_Store_RDb_Schema_User#'];
        /** @type {Fl32_Teq_User_Back_Process_Session_Open} */
        const procSessionOpen = spec['Fl32_Teq_User_Back_Process_Session_Open$'];
        /** @type {Fl32_Teq_User_Shared_Service_Route_Sign_Up.Factory} */
        const route = spec['Fl32_Teq_User_Shared_Service_Route_Sign_Up#Factory$'];
        /** @type {TeqFw_Web_Back_Model_Address} */
        const mAddr = spec['TeqFw_Web_Back_Model_Address$'];
        /** @type {typeof Fl32_Teq_User_Shared_Service_Dto_User} */
        const DUser = spec['Fl32_Teq_User_Shared_Service_Dto_User#'];

        // DEFINE INSTANCE METHODS

        this.getRouteFactory = () => route;

        this.getService = function () {
            // DEFINE INNER FUNCTIONS
            /**
             * @param {TeqFw_Web_Back_Api_Service_IContext} context
             * @return Promise<void>
             */
            async function service(context) {
                // DEFINE INNER FUNCTIONS
                /**
                 * Register new user and return ID.
                 * @param trx
                 * @param {Fl32_Teq_User_Shared_Service_Route_Sign_Up.Request} req
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
                    const rs = await trx(EUser.ENTITY).insert({}, EUser.A_ID);
                    const userId = rs[0];
                    // register login & password
                    const hash = await $bcrypt.hash(req.password, DEF.BCRYPT_HASH_ROUNDS);
                    await trx(EAuthPass.ENTITY).insert({
                        [EAuthPass.A_USER_REF]: userId,
                        [EAuthPass.A_LOGIN]: req.login.trim().toLowerCase(),
                        [EAuthPass.A_PASSWORD_HASH]: hash,
                    });
                    // register profile
                    await trx(EProfile.ENTITY).insert({
                        [EProfile.A_USER_REF]: userId,
                        [EProfile.A_NAME]: req.name.trim(),
                    });
                    // register user in the referrals tree
                    await trx(ERefTree.ENTITY).insert({
                        [ERefTree.A_USER_REF]: userId,
                        [ERefTree.A_PARENT_REF]: parentId,
                    });
                    // register referral code for the user
                    const code = await generateReferralCode(trx);
                    await trx(ERefLink.ENTITY).insert({
                        [ERefLink.A_USER_REF]: userId,
                        [ERefLink.A_CODE]: code,
                    });
                    // register email
                    if (typeof req.email === 'string') {
                        await trx(EIdEmail.ENTITY).insert({
                            [EIdEmail.A_USER_REF]: userId,
                            [EIdEmail.A_EMAIL]: req.email.trim().toLowerCase(),
                        });
                    }
                    // register phone
                    if (typeof req.phone === 'string') {
                        await trx(EIdPhone.ENTITY).insert({
                            [EIdPhone.A_USER_REF]: userId,
                            [EIdPhone.A_PHONE]: req.phone.trim().toLowerCase(),
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
                 * @returns {Promise<Fl32_Teq_User_Shared_Service_Dto_User>}
                 */
                async function selectUser(trx, userId) {

                    // DEFINE INNER FUNCTIONS

                    async function getEmails(trx, userId) {
                        let result = null;
                        const query = trx.from(EIdEmail.ENTITY);
                        query.select([EIdEmail.A_EMAIL]);
                        query.where(EIdEmail.A_USER_REF, userId);
                        const rs = await query;
                        if (rs.length > 0) {
                            result = [];
                            for (const one of rs) result.push(one[EIdEmail.A_EMAIL]);
                        }
                        return result;
                    }

                    async function getPhones(trx, userId) {
                        let result = null;
                        const query = trx.from(EIdPhone.ENTITY);
                        query.select([EIdPhone.A_PHONE]);
                        query.where(EIdPhone.A_USER_REF, userId);
                        const rs = await query;
                        if (rs.length > 0) {
                            result = [];
                            for (const one of rs) result.push(one[EIdPhone.A_PHONE]);
                        }
                        return result;
                    }

                    /**
                     * @param trx
                     * @param {Number} userId
                     * @returns {Promise<Fl32_Teq_User_Shared_Service_Dto_User>}
                     */
                    async function getUser(trx, userId) {
                        const query = trx.from({u: EUser.ENTITY});
                        query.select([
                            {[DUser.ID]: `u.${EUser.A_ID}`},
                            {[DUser.DATE_CREATED]: `u.${EUser.A_DATE_CREATED}`},
                        ]);
                        query.leftOuterJoin(
                            {p: EProfile.ENTITY},
                            `p.${EProfile.A_USER_REF}`,
                            `u.${EUser.A_ID}`);
                        query.select([{[DUser.NAME]: `p.${EProfile.A_NAME}`}]);
                        query.leftOuterJoin(
                            {a: EAuthPass.ENTITY},
                            `a.${EAuthPass.A_USER_REF}`,
                            `u.${EUser.A_ID}`);
                        query.select([{[DUser.LOGIN]: `a.${EAuthPass.A_LOGIN}`}]);
                        query.leftOuterJoin(
                            {t: ERefTree.ENTITY},
                            `t.${ERefTree.A_USER_REF}`,
                            `u.${EUser.A_ID}`);
                        query.select([{[DUser.PARENT_ID]: `t.${ERefTree.A_PARENT_REF}`}]);

                        query.where(`u.${EUser.A_ID}`, userId);
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
                /** @type {Fl32_Teq_User_Shared_Service_Route_Sign_Up.Request} */
                const req = context.getInData();
                /** @type {Fl32_Teq_User_Shared_Service_Route_Sign_Up.Response} */
                const res = context.getOutData();
                //
                const trx = await rdb.startTransaction();
                try {
                    const parentId = await getUserIdByRefCode(trx, req.referralCode);
                    if (parentId) {
                        // register new user in the tables
                        const userId = await addUser(trx, req, parentId);
                        // select user data to compose API response
                        res.user = await selectUser(trx, userId);
                        const {output} = await procSessionOpen.exec({trx, userId});
                        res.sessionId = output.sessId;
                        // set session cookie
                        const pathHttp = context.getRequestContext().getPath();
                        const parts = mAddr.parsePath(pathHttp);
                        const path = (parts.root) ? `/${parts.root}/${parts.door}` : `/${parts.door}`;
                        const cookie = cookieCreate({
                            name: DEF.SESSION_COOKIE_NAME,
                            value: res.sessionId,
                            expires: DEF.SESSION_COOKIE_LIFETIME,
                            path
                        });
                        context.setOutHeader(H2.HTTP2_HEADER_SET_COOKIE, cookie);
                    } else {
                        res.error = 'Unknown referral code.';
                    }
                    await trx.commit();
                } catch (error) {
                    await trx.rollback();
                    throw error;
                }
                return result;
            }

            // MAIN FUNCTIONALITY
            Object.defineProperty(service, 'name', {value: `${NS}.${service.name}`});
            return service;
        }

    }

}
