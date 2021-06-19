/**
 * Service to get users listing.
 * @implements TeqFw_Http2_Api_Back_Service_Factory
 */
export default class Fl32_Teq_User_Back_Service_List {

    constructor(spec) {
        /** @type {Fl32_Teq_User_Defaults} */
        const DEF = spec['Fl32_Teq_User_Defaults$']; // instance singleton
        /** @type {TeqFw_Core_App_Db_Connector} */
        const rdb = spec['TeqFw_Core_App_Db_Connector$']; // instance singleton
        /** @type {typeof Fl32_Teq_User_Store_RDb_Schema_Auth_Password} */
        const EAuthPass = spec['Fl32_Teq_User_Store_RDb_Schema_Auth_Password#']; // class
        /** @type {typeof Fl32_Teq_User_Store_RDb_Schema_Id_Email} */
        const EIdEmail = spec['Fl32_Teq_User_Store_RDb_Schema_Id_Email#']; // class
        /** @type {typeof Fl32_Teq_User_Store_RDb_Schema_Id_Phone} */
        const EIdPhone = spec['Fl32_Teq_User_Store_RDb_Schema_Id_Phone#']; // class
        /** @type {typeof Fl32_Teq_User_Store_RDb_Schema_Profile} */
        const EProfile = spec['Fl32_Teq_User_Store_RDb_Schema_Profile#']; // class
        /** @type {typeof Fl32_Teq_User_Store_RDb_Schema_Ref_Tree} */
        const ERefTree = spec['Fl32_Teq_User_Store_RDb_Schema_Ref_Tree#']; // class
        /** @type {typeof Fl32_Teq_User_Store_RDb_Schema_User} */
        const EUser = spec['Fl32_Teq_User_Store_RDb_Schema_User#']; // class
        /** @type {typeof TeqFw_Http2_Plugin_Handler_Service.Result} */
        const ApiResult = spec['TeqFw_Http2_Plugin_Handler_Service#Result']; // class
        /** @type {typeof Fl32_Teq_User_Shared_Service_Route_List.Request} */
        const Request = spec['Fl32_Teq_User_Shared_Service_Route_List#Request']; // class
        /** @type {typeof Fl32_Teq_User_Shared_Service_Route_List.Response} */
        const Response = spec['Fl32_Teq_User_Shared_Service_Route_List#Response']; // class
        /** @type {typeof Fl32_Teq_User_Shared_Dto_User} */
        const User = spec['Fl32_Teq_User_Shared_Dto_User#']; // class

        this.getRoute = () => DEF.SERV_LIST;

        /**
         * Factory to create function to validate and structure incoming data.
         * @returns {TeqFw_Http2_Api_Back_Service_Factory.parse}
         */
        this.createInputParser = function () {
            // DEFINE INNER FUNCTIONS
            /**
             * @param {TeqFw_Http2_Back_Server_Stream_Context} context
             * @returns {Fl32_Teq_User_Shared_Service_Route_List.Request}
             * @memberOf Fl32_Teq_User_Back_Service_List
             * @implements TeqFw_Http2_Api_Back_Service_Factory.parse
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
         * @returns {TeqFw_Http2_Api_Back_Service_Factory.service}
         */
        this.createService = function () {
            // DEFINE INNER FUNCTIONS
            /**
             * @param {TeqFw_Http2_Plugin_Handler_Service.Context} apiCtx
             * @returns {Promise<TeqFw_Http2_Plugin_Handler_Service.Result>}
             * @memberOf Fl32_Teq_User_Back_Service_List
             * @implements {TeqFw_Http2_Api_Back_Service_Factory.service}
             */
            async function service(apiCtx) {
                // DEFINE INNER FUNCTIONS
                /**
                 * Select data for all users w/o conditions.
                 * @param trx
                 * @returns {Promise<Object<Number, Fl32_Teq_User_Shared_Dto_User>>}
                 */
                async function selectUsers(trx) {

                    // DEFINE INNER FUNCTIONS

                    /**
                     * @param trx
                     * @param {Object.<Number, Fl32_Teq_User_Shared_Dto_User>} users
                     * @returns {Promise<void>}
                     */
                    async function populateWithEmails(trx, users) {
                        const ids = Object.keys(users);
                        const query = trx.from(EIdEmail.ENTITY);
                        query.select([EIdEmail.A_USER_REF, EIdEmail.A_EMAIL]);
                        query.whereIn(EIdEmail.A_USER_REF, ids);
                        const rs = await query;
                        if (rs.length > 0) {
                            for (const one of rs) {
                                const id = one[EIdEmail.A_USER_REF];
                                const email = one[EIdEmail.A_EMAIL];
                                if (!Array.isArray(users[id][User.EMAILS])) users[id][User.EMAILS] = [];
                                users[id][User.EMAILS].push(email);
                            }
                        }
                    }

                    /**
                     * @param trx
                     * @param {Object.<Number, Fl32_Teq_User_Shared_Dto_User>} users
                     * @returns {Promise<void>}
                     */
                    async function populateWithPhones(trx, users) {
                        const ids = Object.keys(users);
                        const query = trx.from(EIdPhone.ENTITY);
                        query.select([EIdPhone.A_USER_REF, EIdPhone.A_PHONE]);
                        query.whereIn(EIdPhone.A_USER_REF, ids);
                        const rs = await query;
                        if (rs.length > 0) {
                            for (const one of rs) {
                                const id = one[EIdPhone.A_USER_REF];
                                const phone = one[EIdPhone.A_PHONE];
                                if (!Array.isArray(users[id][User.PHONES])) users[id][User.PHONES] = [];
                                users[id][User.PHONES].push(phone);
                            }
                        }
                    }

                    /**
                     * @param trx
                     * @returns {Promise<Object.<Number, Fl32_Teq_User_Shared_Dto_User>>}
                     */
                    async function getUsers(trx) {
                        const result = {};
                        const query = trx.from({u: EUser.ENTITY});
                        query.select([
                            {[User.ID]: `u.${EUser.A_ID}`},
                            {[User.DATE_CREATED]: `u.${EUser.A_DATE_CREATED}`},
                        ]);
                        query.leftOuterJoin(
                            {p: EProfile.ENTITY},
                            `p.${EProfile.A_USER_REF}`,
                            `u.${EUser.A_ID}`);
                        query.select([{[User.NAME]: `p.${EProfile.A_NAME}`}]);
                        query.leftOuterJoin(
                            {a: EAuthPass.ENTITY},
                            `a.${EAuthPass.A_USER_REF}`,
                            `u.${EUser.A_ID}`);
                        query.select([{[User.LOGIN]: `a.${EAuthPass.A_LOGIN}`}]);
                        query.leftOuterJoin(
                            {t: ERefTree.ENTITY},
                            `t.${ERefTree.A_USER_REF}`,
                            `u.${EUser.A_ID}`);
                        query.select([{[User.PARENT_ID]: `t.${ERefTree.A_PARENT_REF}`}]);

                        const rows = await query;
                        for (const one of rows) {
                            /** @type {Fl32_Teq_User_Shared_Dto_User} */
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
                const result = new ApiResult();
                result.response = new Response();
                const trx = await rdb.startTransaction();

                try {
                    const users = await selectUsers(trx);
                    result.response.items = Object.values(users);
                    trx.commit();
                } catch (error) {
                    trx.rollback();
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
