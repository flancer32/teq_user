/**
 * Service to get users listing ("/api/${mod}/list").
 */
export default class Fl32_Teq_User_Back_Service_List {

    constructor(spec) {
        /** @type {Fl32_Teq_User_Defaults} */
        const DEF = spec['Fl32_Teq_User_Defaults$'];    // instance singleton
        /** @type {TeqFw_Core_App_Db_Connector} */
        const rdb = spec['TeqFw_Core_App_Db_Connector$'];  // instance singleton
        /** @type {Fl32_Teq_User_Store_RDb_Schema_Auth_Password} */
        const eAuthPass = spec['Fl32_Teq_User_Store_RDb_Schema_Auth_Password$'];   // instance singleton
        /** @type {Fl32_Teq_User_Store_RDb_Schema_Id_Email} */
        const eIdEmail = spec['Fl32_Teq_User_Store_RDb_Schema_Id_Email$'];         // instance singleton
        /** @type {Fl32_Teq_User_Store_RDb_Schema_Id_Phone} */
        const eIdPhone = spec['Fl32_Teq_User_Store_RDb_Schema_Id_Phone$'];         // instance singleton
        /** @type {Fl32_Teq_User_Store_RDb_Schema_Profile} */
        const eProfile = spec['Fl32_Teq_User_Store_RDb_Schema_Profile$'];          // instance singleton
        /** @type {Fl32_Teq_User_Store_RDb_Schema_Ref_Link} */
        const eRefLink = spec['Fl32_Teq_User_Store_RDb_Schema_Ref_Link$'];         // instance singleton
        /** @type {Fl32_Teq_User_Store_RDb_Schema_Ref_Tree} */
        const eRefTree = spec['Fl32_Teq_User_Store_RDb_Schema_Ref_Tree$'];         // instance singleton
        /** @type {Fl32_Teq_User_Store_RDb_Schema_User} */
        const eUser = spec['Fl32_Teq_User_Store_RDb_Schema_User$'];                // instance singleton
        /** @type {typeof Fl32_Teq_User_Shared_Service_Route_List_Request} */
        const Request = spec['Fl32_Teq_User_Shared_Service_Route_List#Request'];   // class constructor
        /** @type {typeof Fl32_Teq_User_Shared_Service_Route_List_Response} */
        const Response = spec['Fl32_Teq_User_Shared_Service_Route_List#Response'];   // class constructor
        /** @type {typeof Fl32_Teq_User_Shared_Service_Data_User} */
        const User = spec['Fl32_Teq_User_Shared_Service_Data_User#']; // class constructor

        this.getRoute = function () {
            return DEF.API_LIST;
        };

        /**
         * Create function to validate and structure incoming data.
         * @return {Function}
         */
        this.createParser = function () {
            /**
             * @param {IncomingMessage} httpReq
             * @return {Fl32_Teq_User_Shared_Service_Route_List_Request}
             * @exports Fl32_Teq_User_Back_Service_List$parse
             */
            function Fl32_Teq_User_Back_Service_List$parse(httpReq) {
                const body = httpReq.body;
                // clone HTTP body into API request object
                return Object.assign(new Request(), body.data);
            }

            return Fl32_Teq_User_Back_Service_List$parse;
        };

        /**
         * Create function to perform requested operation.
         * @return {Function}
         */
        this.createProcessor = function () {
            /**
             * @param {Fl32_Teq_User_Shared_Service_Route_List_Request} apiReq
             * @return {Promise<Fl32_Teq_User_Shared_Service_Route_List_Response>}
             * @exports Fl32_Teq_User_Back_Service_List$process
             */
            async function Fl32_Teq_User_Back_Service_List$process(apiReq) {
                // DEFINE INNER FUNCTIONS
                /**
                 * Select data for all users w/o conditions.
                 * @param trx
                 * @return {Promise<Fl32_Teq_User_Shared_Service_Data_User[]>}
                 */
                async function selectUsers(trx) {

                    // DEFINE INNER FUNCTIONS

                    /**
                     * @param trx
                     * @param {Object.<Number, Fl32_Teq_User_Shared_Service_Data_User>} users
                     * @return {Promise<void>}
                     */
                    async function populateWithEmails(trx, users) {
                        const ids = Object.keys(users);
                        const query = trx.from(eIdEmail.ENTITY);
                        query.select([eIdEmail.A_USER_REF, eIdEmail.A_EMAIL]);
                        query.whereIn(eIdEmail.A_USER_REF, ids);
                        const rs = await query;
                        if (rs.length > 0) {
                            for (const one of rs) {
                                const id = one[eIdEmail.A_USER_REF];
                                const email = one[eIdEmail.A_EMAIL];
                                if (!Array.isArray(users[id][User.A_EMAILS])) users[id][User.A_EMAILS] = [];
                                users[id][User.A_EMAILS].push(email);
                            }
                        }
                    }

                    /**
                     * @param trx
                     * @param {Object.<Number, Fl32_Teq_User_Shared_Service_Data_User>} users
                     * @return {Promise<void>}
                     */
                    async function populateWithPhones(trx, users) {
                        const ids = Object.keys(users);
                        const query = trx.from(eIdPhone.ENTITY);
                        query.select([eIdPhone.A_USER_REF, eIdPhone.A_PHONE]);
                        query.whereIn(eIdPhone.A_USER_REF, ids);
                        const rs = await query;
                        if (rs.length > 0) {
                            for (const one of rs) {
                                const id = one[eIdPhone.A_USER_REF];
                                const phone = one[eIdPhone.A_PHONE];
                                if (!Array.isArray(users[id][User.A_PHONES])) users[id][User.A_PHONES] = [];
                                users[id][User.A_PHONES].push(phone);
                            }
                        }
                    }

                    /**
                     * @param trx
                     * @return {Promise<Object.<Number, Fl32_Teq_User_Shared_Service_Data_User>>}
                     */
                    async function getUsers(trx) {
                        const result = {};
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
                        const rows = await query;
                        for (const one of rows) {
                            /** @type {Fl32_Teq_User_Shared_Service_Data_User} */
                            const item = Object.assign(new User(), one);
                            result[item.id] = item;
                        }
                        return result;
                    }

                    // MAIN FUNCTIONALITY
                    // get main data (mapped 1-to-1 to userId)
                    const result = await getUsers(trx);
                    // add multiple attributes (email(s) & phone(s))
                    await populateWithEmails(trx, result);
                    await populateWithPhones(trx, result);
                    return result;
                }

                // MAIN FUNCTIONALITY
                /** @type {Fl32_Teq_User_Shared_Service_Route_List_Response} */
                const result = new Response();
                const trx = await rdb.startTransaction();

                try {
                    result.items = await selectUsers(trx);
                    trx.commit();
                } catch (error) {
                    trx.rollback();
                    throw error;
                }
                return result;
            }

            return Fl32_Teq_User_Back_Service_List$process;
        };
    }

}
