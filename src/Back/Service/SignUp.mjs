import $crypto from 'crypto';

/**
 * Service to register new user ("/api/${mod}/sign_up").
 */
export default class Fl32_Teq_User_Back_Service_SignUp {

    constructor(spec) {
        /** @type {TeqFw_Core_App_Db_Connector} */
        const rdb = spec.TeqFw_Core_App_Db_Connector$;  // singleton object
        /** @type {Fl32_Teq_User_Store_RDb_Schema_Auth_Password} */
        const eAuthPass = spec.Fl32_Teq_User_Store_RDb_Schema_Auth_Password$;   // singleton object
        /** @type {Fl32_Teq_User_Store_RDb_Schema_Id_Email} */
        const eIdEmail = spec.Fl32_Teq_User_Store_RDb_Schema_Id_Email$;         // singleton object
        /** @type {Fl32_Teq_User_Store_RDb_Schema_Id_Phone} */
        const eIdPhone = spec.Fl32_Teq_User_Store_RDb_Schema_Id_Phone$;         // singleton object
        /** @type {Fl32_Teq_User_Store_RDb_Schema_Profile} */
        const eProfile = spec.Fl32_Teq_User_Store_RDb_Schema_Profile$;          // singleton object
        /** @type {Fl32_Teq_User_Store_RDb_Schema_Ref_Link} */
        const eRefLink = spec.Fl32_Teq_User_Store_RDb_Schema_Ref_Link$;         // singleton object
        /** @type {Fl32_Teq_User_Store_RDb_Schema_Ref_Tree} */
        const eRefTree = spec.Fl32_Teq_User_Store_RDb_Schema_Ref_Tree$;         // singleton object
        /** @type {Fl32_Teq_User_Store_RDb_Schema_User} */
        const eUser = spec.Fl32_Teq_User_Store_RDb_Schema_User$;                // singleton object
        const Request = spec['Fl32_Teq_User_Shared_Service_Route_SignUp#Request'];   // class constructor
        const Response = spec['Fl32_Teq_User_Shared_Service_Route_SignUp#Response'];   // class constructor
        /** @type {typeof Fl32_Teq_User_Shared_Service_Data_User} */
        const User = spec['Fl32_Teq_User_Shared_Service_Data_User#']; // class constructor

        this.getRoute = function () {
            return '/signUp';
        };

        /**
         * Create function to validate and structure incoming data.
         * @return {Function}
         */
        this.getParser = function () {
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
        this.getProcessor = function () {
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
                    await trx(eAuthPass.ENTITY).insert({
                        [eAuthPass.A_USER_REF]: userId,
                        [eAuthPass.A_LOGIN]: req.login.trim().toLowerCase(),
                        [eAuthPass.A_PASSWORD]: req.password,
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
                            {[User.A_ID]: `u.${eUser.A_ID}`},
                            {[User.A_DATE_CREATED]: `u.${eUser.A_DATE_CREATED}`},
                        ]);
                        query.leftOuterJoin(
                            {p: eProfile.ENTITY},
                            `p.${eProfile.A_USER_REF}`,
                            `u.${eUser.A_ID}`);
                        query.select([{[User.A_NAME]: `p.${eProfile.A_NAME}`}]);
                        query.leftOuterJoin(
                            {a: eAuthPass.ENTITY},
                            `a.${eAuthPass.A_USER_REF}`,
                            `u.${eUser.A_ID}`);
                        query.select([{[User.A_LOGIN]: `a.${eAuthPass.A_LOGIN}`}]);
                        query.leftOuterJoin(
                            {t: eRefTree.ENTITY},
                            `t.${eRefTree.A_USER_REF}`,
                            `u.${eUser.A_ID}`);
                        query.select([{[User.A_PARENT_ID]: `t.${eRefTree.A_PARENT_REF}`}]);
                        query.leftOuterJoin(
                            {l: eRefLink.ENTITY},
                            `l.${eRefLink.A_USER_REF}`,
                            `u.${eUser.A_ID}`);
                        query.select([{[User.A_REF_CODE]: `l.${eRefLink.A_CODE}`}]);
                        query.where(`u.${eUser.A_ID}`, userId);
                        const rows = await query;
                        return Object.assign(new User(), rows[0]);
                    }

                    // MAIN FUNCTIONALITY
                    const result = await getUser(trx, userId);
                    // get single/multiple attributes (email(s) & phone(s))
                    result.email = await getEmails(trx, userId);
                    result.phone = await getPhones(trx, userId);
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
                    trx.commit();
                } catch (error) {
                    trx.rollback();
                    throw error;
                }
                return result;
            }

            return Fl32_Teq_User_Back_Service_SignUp$process;
        };
    }

}
