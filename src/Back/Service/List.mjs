/**
 * List users.
 *
 * @namespace Fl32_Teq_User_Back_Service_List
 */
// MODULE'S VARS
const NS = 'Fl32_Teq_User_Back_Service_List';

/**
 * @implements TeqFw_Web_Back_Api_Service_IFactory
 */
export default class Fl32_Teq_User_Back_Service_List {

    constructor(spec) {
        // EXTRACT DEPS
        /** @type {TeqFw_Db_Back_Api_IConnect} */
        const rdb = spec['TeqFw_Db_Back_Api_IConnect$'];
        /** @type {typeof Fl32_Teq_User_Store_RDb_Schema_Auth_Password} */
        const EAuthPass = spec['Fl32_Teq_User_Store_RDb_Schema_Auth_Password#'];
        /** @type {typeof Fl32_Teq_User_Store_RDb_Schema_Id_Email} */
        const EIdEmail = spec['Fl32_Teq_User_Store_RDb_Schema_Id_Email#'];
        /** @type {typeof Fl32_Teq_User_Store_RDb_Schema_Id_Phone} */
        const EIdPhone = spec['Fl32_Teq_User_Store_RDb_Schema_Id_Phone#'];
        /** @type {typeof Fl32_Teq_User_Store_RDb_Schema_Profile} */
        const EProfile = spec['Fl32_Teq_User_Store_RDb_Schema_Profile#'];
        /** @type {typeof Fl32_Teq_User_Store_RDb_Schema_Ref_Tree} */
        const ERefTree = spec['Fl32_Teq_User_Store_RDb_Schema_Ref_Tree#'];
        /** @type {typeof Fl32_Teq_User_Store_RDb_Schema_User} */
        const EUser = spec['Fl32_Teq_User_Store_RDb_Schema_User#'];
        /** @type {Fl32_Teq_User_Shared_Service_Route_List.Factory} */
        const route = spec['Fl32_Teq_User_Shared_Service_Route_List#Factory$'];
        /** @type {typeof Fl32_Teq_User_Shared_Service_Dto_User} */
        const User = spec['Fl32_Teq_User_Shared_Service_Dto_User#'];

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
                 * Select data for all users w/o conditions.
                 * @param trx
                 * @returns {Promise<Object<Number, Fl32_Teq_User_Shared_Service_Dto_User>>}
                 */
                async function selectUsers(trx) {

                    // DEFINE INNER FUNCTIONS

                    /**
                     * @param trx
                     * @param {Object.<Number, Fl32_Teq_User_Shared_Service_Dto_User>} users
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
                     * @param {Object.<Number, Fl32_Teq_User_Shared_Service_Dto_User>} users
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
                     * @returns {Promise<Object.<Number, Fl32_Teq_User_Shared_Service_Dto_User>>}
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
                            /** @type {Fl32_Teq_User_Shared_Service_Dto_User} */
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
                /** @type {Fl32_Teq_User_Shared_Service_Route_List.Request} */
                // const req = context.getInData();
                /** @type {Fl32_Teq_User_Shared_Service_Route_List.Response} */
                const res = context.getOutData();
                //
                const trx = await rdb.startTransaction();

                try {
                    const users = await selectUsers(trx);
                    res.items = Object.values(users);
                    trx.commit();
                } catch (error) {
                    trx.rollback();
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
