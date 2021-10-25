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
        /** @type {TeqFw_Web_Back_Util.cookieCreate|function} */
        const cookieCreate = spec['TeqFw_Web_Back_Util#cookieCreate'];
        /** @type {TeqFw_Db_Back_RDb_IConnect} */
        const rdb = spec['TeqFw_Db_Back_RDb_IConnect$'];
        /** @type {TeqFw_Db_Back_Api_RDb_ICrudEngine} */
        const crud = spec['TeqFw_Db_Back_Api_RDb_ICrudEngine$'];
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
        /** @type {Fl32_Teq_User_Back_Store_RDb_Schema_Id_Email} */
        const metaIdEmail = spec['Fl32_Teq_User_Back_Store_RDb_Schema_Id_Email$'];
        /** @type {Fl32_Teq_User_Back_Store_RDb_Schema_Id_Phone} */
        const metaIdPhone = spec['Fl32_Teq_User_Back_Store_RDb_Schema_Id_Phone$'];
        /** @type {Fl32_Teq_User_Back_Store_RDb_Schema_Ref_Link} */
        const metaRefLink = spec['Fl32_Teq_User_Back_Store_RDb_Schema_Ref_Link$'];
        /** @type {Fl32_Teq_User_Back_Store_RDb_Schema_Ref_Tree} */
        const metaRefTree = spec['Fl32_Teq_User_Back_Store_RDb_Schema_Ref_Tree$'];

        // DEFINE WORKING VARS / PROPS
        /** @type {typeof TeqFw_User_Back_Store_RDb_Schema_User.ATTR} */
        const A_USER = metaUser.getAttributes();
        /** @type {typeof Fl32_Teq_User_Back_Store_RDb_Schema_Profile.ATTR} */
        const A_PROFILE = metaProfile.getAttributes();
        /** @type {typeof Fl32_Teq_User_Back_Store_RDb_Schema_Auth_Password.ATTR} */
        const A_AUTH_PASS = metaAuthPass.getAttributes();
        /** @type {typeof Fl32_Teq_User_Back_Store_RDb_Schema_Id_Email.ATTR} */
        const A_ID_EMAIL = metaIdEmail.getAttributes();
        /** @type {typeof Fl32_Teq_User_Back_Store_RDb_Schema_Id_Phone.ATTR} */
        const A_ID_PHONE = metaIdPhone.getAttributes();
        /** @type {typeof Fl32_Teq_User_Back_Store_RDb_Schema_Ref_Link.ATTR} */
        const A_REF_LINK = metaRefLink.getAttributes();
        /** @type {typeof Fl32_Teq_User_Back_Store_RDb_Schema_Ref_Tree.ATTR} */
        const A_REF_TREE = metaRefTree.getAttributes();

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

                    /**
                     * @param {TeqFw_Db_Back_RDb_ITrans} trx
                     * @return {Promise<string>}
                     */
                    async function generateReferralCode(trx) {
                        let code, found;
                        do {
                            code = $crypto.randomBytes(4).toString('hex').toLowerCase();
                            found = await crud.readOne(trx, metaRefLink, {[A_REF_LINK.CODE]: code});
                        } while (found !== null);
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
                    await crud.create(trx, metaRefTree, {
                        [A_REF_TREE.USER_REF]: userId,
                        [A_REF_TREE.PARENT_REF]: parentId,
                    });
                    // register referral code for the user
                    const code = await generateReferralCode(trx);
                    await crud.create(trx, metaRefLink, {
                        [A_REF_LINK.USER_REF]: userId,
                        [A_REF_LINK.CODE]: code,
                    });
                    // register email
                    if (typeof req.email === 'string') {
                        await crud.create(trx, metaIdEmail, {
                            [A_ID_EMAIL.USER_REF]: userId,
                            [A_ID_EMAIL.EMAIL]: req.email.trim().toLowerCase(),
                        });
                    }
                    // register phone
                    if (typeof req.phone === 'string') {
                        await crud.create(trx, metaIdPhone, {
                            [A_ID_PHONE.USER_REF]: userId,
                            [A_ID_PHONE.PHONE]: req.phone.trim().toLowerCase(),
                        });
                    }
                    return userId;
                }

                /**
                 * @param {TeqFw_Db_Back_RDb_ITrans} trx
                 * @param {String} code referral code
                 * @returns {Promise<Number|null>}
                 */
                async function getUserIdByRefCode(trx, code) {
                    let res = null;
                    if (code) {
                        const norm = code.trim().toLowerCase();
                        /** @type {Fl32_Teq_User_Back_Store_RDb_Schema_Ref_Link.Dto} */
                        const found = await crud.readOne(trx, metaRefLink, {[A_REF_LINK.CODE]: norm});
                        if (found?.user_ref) res = found.user_ref;
                    }
                    return res;
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
                    const T_REF_TREE = trx.getTableName(metaRefTree);
                    const T_USER = trx.getTableName(metaUser);

                    // DEFINE INNER FUNCTIONS

                    /**
                     * @param {TeqFw_Db_Back_RDb_ITrans} trx
                     * @param {number} userId
                     * @return {Promise<string[]>}
                     */
                    async function getEmails(trx, userId) {
                        const res = [];
                        const where = {[A_ID_EMAIL.USER_REF]: userId};
                        /** @type {Fl32_Teq_User_Back_Store_RDb_Schema_Id_Email.Dto[]} */
                        const items = await crud.readSet(trx, metaIdEmail, where);
                        for (const item of items) res.push(item.email);
                        return res;
                    }

                    /**
                     * @param {TeqFw_Db_Back_RDb_ITrans} trx
                     * @param {number} userId
                     * @return {Promise<string[]>}
                     */
                    async function getPhones(trx, userId) {
                        const res = [];
                        const where = {[A_ID_PHONE.USER_REF]: userId};
                        /** @type {Fl32_Teq_User_Back_Store_RDb_Schema_Id_Phone.Dto[]} */
                        const items = await crud.readSet(trx, metaIdPhone, where);
                        for (const item of items) res.push(item.phone);
                        return res;
                    }

                    /**
                     * @param trx
                     * @param {number} userId
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
                            {t: T_REF_TREE},
                            `t.${A_REF_TREE.USER_REF}`,
                            `u.${A_USER.ID}`);
                        query.select([{[DUser.PARENT_ID]: `t.${A_REF_TREE.PARENT_REF}`}]);

                        query.where(`u.${A_USER.ID}`, userId);
                        const rows = await query;
                        return Object.assign(new DUser(), rows[0]);
                    }

                    // MAIN FUNCTIONALITY
                    const res = await getUser(trx.getTrx(), userId);
                    // get single/multiple attributes (email(s) & phone(s))
                    res.emails = await getEmails(trx, userId);
                    res.phones = await getPhones(trx, userId);
                    return res;
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
            }

            // MAIN FUNCTIONALITY
            Object.defineProperty(service, 'name', {value: `${NS}.${service.name}`});
            return service;
        }

    }

}
