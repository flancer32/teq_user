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
        /** @type {Function|TeqFw_Web_Back_Util.cookieCreate} */
        const cookieCreate = spec['TeqFw_Web_Back_Util#cookieCreate'];
        /** @type {TeqFw_Db_Back_RDb_IConnect} */
        const rdb = spec['TeqFw_Db_Back_RDb_IConnect$'];
        /** @type {TeqFw_Db_Back_Api_RDb_ICrudEngine} */
        const crud = spec['TeqFw_Db_Back_Api_RDb_ICrudEngine$'];
        /** @type {typeof Fl32_Teq_User_Back_Store_RDb_Schema_Id_Email} */
        const EIdEmail = spec['Fl32_Teq_User_Back_Store_RDb_Schema_Id_Email#'];
        /** @type {typeof Fl32_Teq_User_Back_Store_RDb_Schema_Id_Phone} */
        const EIdPhone = spec['Fl32_Teq_User_Back_Store_RDb_Schema_Id_Phone#'];
        /** @type {typeof Fl32_Teq_User_Back_Store_RDb_Schema_Ref_Link} */
        const ERefLink = spec['Fl32_Teq_User_Back_Store_RDb_Schema_Ref_Link#'];
        /** @type {typeof Fl32_Teq_User_Back_Store_RDb_Schema_Ref_Tree} */
        const ERefTree = spec['Fl32_Teq_User_Back_Store_RDb_Schema_Ref_Tree#'];
        /** @type {Fl32_Teq_User_Back_Process_Session_Open} */
        const procSessionOpen = spec['Fl32_Teq_User_Back_Process_Session_Open$'];
        /** @type {Fl32_Teq_User_Shared_Service_Route_Sign_Up.Factory} */
        const route = spec['Fl32_Teq_User_Shared_Service_Route_Sign_Up#Factory$'];
        /** @type {TeqFw_Web_Back_Model_Address} */
        const mAddr = spec['TeqFw_Web_Back_Model_Address$'];
        /** @type {typeof Fl32_Teq_User_Shared_Service_Dto_User} */
        const DUser = spec['Fl32_Teq_User_Shared_Service_Dto_User#'];
        /** @type {TeqFw_User_Back_Store_RDb_Schema_User} */
        const metaUser = spec['TeqFw_User_Back_Store_RDb_Schema_User$'];
        /** @type {Fl32_Teq_User_Back_Store_RDb_Schema_Profile} */
        const metaProfile = spec['Fl32_Teq_User_Back_Store_RDb_Schema_Profile$'];
        /** @type {Fl32_Teq_User_Back_Store_RDb_Schema_Auth_Password} */
        const metaAuthPass = spec['Fl32_Teq_User_Back_Store_RDb_Schema_Auth_Password$'];

        // DEFINE WORKING VARS / PROPS
        /** @type {typeof TeqFw_User_Back_Store_RDb_Schema_User.ATTR} */
        const A_USER = metaUser.getAttributes();
        /** @type {typeof Fl32_Teq_User_Back_Store_RDb_Schema_Profile.ATTR} */
        const A_PROFILE = metaProfile.getAttributes();
        /** @type {typeof Fl32_Teq_User_Back_Store_RDb_Schema_Auth_Password.ATTR} */
        const A_AUTH_PASS = metaAuthPass.getAttributes();

        // DEFINE INSTANCE METHODS

        this.getRouteFactory = () => route;

        this.getService = function () {
            // DEFINE INNER FUNCTIONS
            /**
             * @param {TeqFw_Web_Back_Api_Service_Context} context
             * @return Promise<void>
             */
            async function service(context) {
                // DEFINE INNER FUNCTIONS
                /**
                 * Register new user and return ID.
                 * @param {TeqFw_Db_Back_RDb_ITrans} trx
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
                    const pkey = await crud.create(trx, metaUser, {});
                    const userId = pkey[A_USER.ID];
                    // register login & password
                    const hash = await $bcrypt.hash(req.password, DEF.BCRYPT_HASH_ROUNDS);
                    await crud.create(trx, metaAuthPass, {
                        [A_AUTH_PASS.USER_REF]: userId,
                        [A_AUTH_PASS.LOGIN]: req.login.trim().toLowerCase(),
                        [A_AUTH_PASS.PASSWORD_HASH]: hash,
                    });
                    // register profile
                    await crud.create(trx, metaProfile, {
                        [A_PROFILE.USER_REF]: userId,
                        [A_PROFILE.NAME]: req.name.trim(),
                    });
                    // register user in the referrals tree
                    await trx.getQuery(ERefTree.ENTITY).insert({
                        [ERefTree.A_USER_REF]: userId,
                        [ERefTree.A_PARENT_REF]: parentId,
                    });
                    // register referral code for the user
                    const code = await generateReferralCode(trx);
                    await trx.getQuery(ERefLink.ENTITY).insert({
                        [ERefLink.A_USER_REF]: userId,
                        [ERefLink.A_CODE]: code,
                    });
                    // register email
                    if (typeof req.email === 'string') {
                        await trx.getQuery(EIdEmail.ENTITY).insert({
                            [EIdEmail.A_USER_REF]: userId,
                            [EIdEmail.A_EMAIL]: req.email.trim().toLowerCase(),
                        });
                    }
                    // register phone
                    if (typeof req.phone === 'string') {
                        await trx.getQuery(EIdPhone.ENTITY).insert({
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
                 * @param {TeqFw_Db_Back_RDb_ITrans} trx
                 * @param {Number} userId
                 * @returns {Promise<Fl32_Teq_User_Shared_Service_Dto_User>}
                 */
                async function selectUser(trx, userId) {
                    // DEFINE WORKING VARS / PROPS
                    const T_AUTH_PASS = trx.getTableName(metaAuthPass);
                    const T_PROFILE = trx.getTableName(metaProfile);
                    const T_USER = trx.getTableName(metaUser);

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
                        const query = trx.from({u: T_USER});
                        query.select([
                            {[DUser.ID]: `u.${A_USER.ID}`},
                            {[DUser.DATE_CREATED]: `u.${A_USER.DATE_CREATED}`},
                        ]);
                        query.leftOuterJoin(
                            {p: T_PROFILE},
                            `p.${A_PROFILE.USER_REF}`,
                            `u.${A_USER.ID}`);
                        query.select([{[DUser.NAME]: `p.${A_PROFILE.NAME}`}]);
                        query.leftOuterJoin(
                            {a: T_AUTH_PASS},
                            `a.${A_AUTH_PASS.USER_REF}`,
                            `u.${A_USER.ID}`);
                        query.select([{[DUser.LOGIN]: `a.${A_AUTH_PASS.LOGIN}`}]);
                        query.leftOuterJoin(
                            {t: ERefTree.ENTITY},
                            `t.${ERefTree.A_USER_REF}`,
                            `u.${A_USER.ID}`);
                        query.select([{[DUser.PARENT_ID]: `t.${ERefTree.A_PARENT_REF}`}]);

                        query.where(`u.${A_USER.ID}`, userId);
                        const rows = await query;
                        return Object.assign(new DUser(), rows[0]);
                    }

                    // MAIN FUNCTIONALITY
                    const result = await getUser(trx.getTrx(), userId);
                    // get single/multiple attributes (email(s) & phone(s))
                    result.emails = await getEmails(trx.getTrx(), userId);
                    result.phones = await getPhones(trx.getTrx(), userId);
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
                    const parentId = await getUserIdByRefCode(trx.getTrx(), req.referralCode);
                    if (parentId) {
                        // register new user in the tables
                        const userId = await addUser(trx, req, parentId);
                        // select user data to compose API response
                        res.user = await selectUser(trx, userId);
                        const {output} = await procSessionOpen.exec({trx: trx.getTrx(), userId});
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
