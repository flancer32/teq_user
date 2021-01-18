import $bcrypt from 'bcrypt';
import $crypto from 'crypto';

/**
 * Service to register new user.
 */
export default class Fl32_Teq_User_Back_Service_SignUp {

    constructor(spec) {
        /** @type {Fl32_Teq_User_Defaults} */
        const DEF = spec['Fl32_Teq_User_Defaults$'];
        /** @type {TeqFw_Core_App_Db_Connector} */
        const rdb = spec['TeqFw_Core_App_Db_Connector$'];  // singleton instance
        /** @type {Fl32_Teq_User_Store_RDb_Schema_Auth_Password} */
        const eAuthPass = spec['Fl32_Teq_User_Store_RDb_Schema_Auth_Password$'];   // singleton instance
        /** @type {Fl32_Teq_User_Store_RDb_Schema_Id_Email} */
        const eIdEmail = spec['Fl32_Teq_User_Store_RDb_Schema_Id_Email$'];         // singleton instance
        /** @type {Fl32_Teq_User_Store_RDb_Schema_Id_Phone} */
        const eIdPhone = spec['Fl32_Teq_User_Store_RDb_Schema_Id_Phone$'];         // singleton instance
        /** @type {Fl32_Teq_User_Store_RDb_Schema_Profile} */
        const eProfile = spec['Fl32_Teq_User_Store_RDb_Schema_Profile$'];          // singleton instance
        /** @type {Fl32_Teq_User_Store_RDb_Schema_Ref_Link} */
        const eRefLink = spec['Fl32_Teq_User_Store_RDb_Schema_Ref_Link$'];         // singleton instance
        /** @type {Fl32_Teq_User_Store_RDb_Schema_Ref_Tree} */
        const eRefTree = spec['Fl32_Teq_User_Store_RDb_Schema_Ref_Tree$'];         // singleton instance
        /** @type {Fl32_Teq_User_Store_RDb_Schema_User} */
        const eUser = spec['Fl32_Teq_User_Store_RDb_Schema_User$'];                // singleton instance
        /** @type {typeof Fl32_Teq_User_Shared_Service_Route_SignUp_Request} */
        const Request = spec['Fl32_Teq_User_Shared_Service_Route_SignUp#Request'];   // class constructor
        /** @type {typeof Fl32_Teq_User_Shared_Service_Route_SignUp_Response} */
        const Response = spec['Fl32_Teq_User_Shared_Service_Route_SignUp#Response'];   // class constructor
        /** @type {typeof Fl32_Teq_User_Shared_Service_Data_User} */
        const DUser = spec['Fl32_Teq_User_Shared_Service_Data_User#']; // class constructor

        this.getRoute = function () {
            return DEF.ROUTE_SIGN_UP;
        };

        /**
         * Create function to validate and structure incoming data.
         * @return {Function}
         */
        this.createParser = function () {
            /**
             * @param {IncomingMessage} httpReq
             * @return {Fl32_Teq_User_Shared_Service_Route_SignUp_Request}
             * @exports Fl32_Teq_User_Back_Service_SignUp$parse
             */
            function Fl32_Teq_User_Back_Service_SignUp$parse(httpReq) {
                const body = httpReq.body;
                // clone HTTP body into API request object
                return Object.assign(new Request(), body.data);
            }

            return Fl32_Teq_User_Back_Service_SignUp$parse;
        };

        /**
         * Create function to perform requested operation.
         * @return {Function}
         */
        this.createProcessor = function () {
            /**
             * @param {Fl32_Teq_User_Shared_Service_Route_SignUp_Request} apiReq
             * @return {Promise<Fl32_Teq_User_Shared_Service_Route_SignUp_Response>}
             * @exports Fl32_Teq_User_Back_Service_SignUp$process
             */
            async function Fl32_Teq_User_Back_Service_SignUp$process(apiReq) {
                // DEFINE INNER FUNCTIONS
                /**
                 * Register new user and return ID.
                 * @param trx
                 * @param {Fl32_Teq_User_Shared_Service_Route_SignUp_Request} req
                 * @return {Promise<Number>}
                 */
                async function addUser(trx, req) {
                    // DEFINE INNER FUNCTIONS

                    async function generateReferralCode(trx) {
                        let code, rs;
                        do {
                            code = $crypto.randomBytes(4).toString('hex').toLowerCase();
                            const query = trx.from(eRefLink.ENTITY);
                            rs = await query.select().where(eRefLink.A_CODE, code);
                        } while (rs.length > 0);
                        return code;
                    }

                    // MAIN FUNCTIONALITY
                    // register user
                    const rs = await trx(eUser.ENTITY).insert({});
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
                        [eRefTree.A_PARENT_REF]: userId,    // by default user is registered as root node
                    });
                    // register referral code for the user
                    const code = await generateReferralCode(trx);
                    await trx(eRefLink.ENTITY).insert({
                        [eRefLink.A_USER_REF]: userId,
                        [eRefLink.A_CODE]: code,
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
                 * Select data for newly registered user.
                 * @param trx
                 * @param {Number} userId
                 * @return {Promise<Fl32_Teq_User_Shared_Service_Data_User>}
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
                     * @return {Promise<Fl32_Teq_User_Shared_Service_Data_User>}
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
                            {l: eRefLink.ENTITY},
                            `l.${eRefLink.A_USER_REF}`,
                            `u.${eUser.A_ID}`);
                        query.select([{[DUser.A_REF_CODE]: `l.${eRefLink.A_CODE}`}]);
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
                /** @type {Fl32_Teq_User_Shared_Service_Route_SignUp_Response} */
                const result = new Response();
                const trx = await rdb.startTransaction();

                try {
                    // register new user in the tables
                    const userId = await addUser(trx, apiReq);
                    // select user data to compose API response
                    result.user = await selectUser(trx, userId);
                    await trx.commit();
                } catch (error) {
                    await trx.rollback();
                    throw error;
                }
                return result;
            }

            return Fl32_Teq_User_Back_Service_SignUp$process;
        };
    }

}
