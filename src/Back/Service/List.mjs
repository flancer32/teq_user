/**
 * List users.
 *
 * @namespace Fl32_Teq_User_Back_Service_List
 */
// MODULE'S VARS
const NS = 'Fl32_Teq_User_Back_Service_List';

/**
 * @implements TeqFw_Web_Back_Api_WAPI_IFactory
 */
export default class Fl32_Teq_User_Back_Service_List {

    constructor(spec) {
        // EXTRACT DEPS
        /** @type {TeqFw_Db_Back_RDb_IConnect} */
        const conn = spec['TeqFw_Db_Back_RDb_IConnect$'];
        /** @type {TeqFw_Db_Back_Api_RDb_ICrudEngine} */
        const crud = spec['TeqFw_Db_Back_Api_RDb_ICrudEngine$'];
        /** @type {Fl32_Teq_User_Shared_Service_Route_List.Factory} */
        const route = spec['Fl32_Teq_User_Shared_Service_Route_List#Factory$'];
        /** @type {typeof Fl32_Teq_User_Shared_Service_Dto_User} */
        const User = spec['Fl32_Teq_User_Shared_Service_Dto_User#'];
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
        /** @type {typeof Fl32_Teq_User_Back_Store_RDb_Schema_Ref_Tree.ATTR} */
        const A_REF_TREE = metaRefTree.getAttributes();

        // DEFINE INSTANCE METHODS

        this.getRouteFactory = () => route;

        this.getService = function () {
            // DEFINE INNER FUNCTIONS
            /**
             * @param {TeqFw_Web_Back_Api_WAPI_Context} context
             * @return Promise<void>
             */
            async function service(context) {
                // DEFINE INNER FUNCTIONS
                /**
                 * Select data for all users w/o conditions.
                 * @param {TeqFw_Db_Back_RDb_ITrans} trx
                 * @returns {Promise<Object<Number, Fl32_Teq_User_Shared_Service_Dto_User>>}
                 */
                async function selectUsers(trx) {
                    // DEFINE WORKING VARS / PROPS
                    const T_AUTH_PASS = trx.getTableName(metaAuthPass);
                    const T_PROFILE = trx.getTableName(metaProfile);
                    const T_REF_TREE = trx.getTableName(metaRefTree);
                    const T_USER = trx.getTableName(metaUser);

                    // DEFINE INNER FUNCTIONS

                    /**
                     * @param {TeqFw_Db_Back_RDb_ITrans} trx
                     * @param {Object.<number, Fl32_Teq_User_Shared_Service_Dto_User>} users
                     * @returns {Promise<void>}
                     */
                    async function populateWithEmails(trx, users) {
                        const ids = Object.keys(users);
                        const where = (clause) => clause.whereIn(A_ID_EMAIL.USER_REF, ids);
                        /** @type {Fl32_Teq_User_Back_Store_RDb_Schema_Id_Email.Dto[]} */
                        const items = await crud.readSet(trx, metaIdEmail, where);
                        for (const one of items) {
                            const id = one.user_ref;
                            const email = one.email;
                            if (!Array.isArray(users[id][User.EMAILS])) users[id][User.EMAILS] = [];
                            users[id][User.EMAILS].push(email);
                        }
                    }

                    /**
                     * @param {TeqFw_Db_Back_RDb_ITrans} trx
                     * @param {Object.<number, Fl32_Teq_User_Shared_Service_Dto_User>} users
                     * @returns {Promise<void>}
                     */
                    async function populateWithPhones(trx, users) {
                        const ids = Object.keys(users);
                        const where = (clause) => clause.whereIn(A_ID_PHONE.USER_REF, ids);
                        /** @type {Fl32_Teq_User_Back_Store_RDb_Schema_Id_Phone.Dto[]} */
                        const items = await crud.readSet(trx, metaIdPhone, where);
                        for (const one of items) {
                            const id = one.user_ref;
                            const phone = one.phone;
                            if (!Array.isArray(users[id][User.PHONES])) users[id][User.PHONES] = [];
                            users[id][User.PHONES].push(phone);
                        }
                    }

                    /**
                     * @param trx
                     * @returns {Promise<Object.<number, Fl32_Teq_User_Shared_Service_Dto_User>>}
                     */
                    async function getUsers(trx) {
                        const result = {};
                        const query = trx.from({u: T_USER});
                        query.select([
                            {[User.ID]: `u.${A_USER.ID}`},
                            {[User.DATE_CREATED]: `u.${A_USER.DATE_CREATED}`},
                        ]);
                        query.leftOuterJoin(
                            {p: T_PROFILE},
                            `p.${A_PROFILE.USER_REF}`,
                            `u.${A_USER.ID}`);
                        query.select([{[User.NAME]: `p.${A_PROFILE.NAME}`}]);
                        query.leftOuterJoin(
                            {a: T_AUTH_PASS},
                            `a.${A_AUTH_PASS.USER_REF}`,
                            `u.${A_USER.ID}`);
                        query.select([{[User.LOGIN]: `a.${A_AUTH_PASS.LOGIN}`}]);
                        query.leftOuterJoin(
                            {t: T_REF_TREE},
                            `t.${A_REF_TREE.USER_REF}`,
                            `u.${A_USER.ID}`);
                        query.select([{[User.PARENT_ID]: `t.${A_REF_TREE.PARENT_REF}`}]);

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
                    const result = await getUsers(trx.getTrx());
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
                const trx = await conn.startTransaction();

                try {
                    const users = await selectUsers(trx);
                    res.items = Object.values(users);
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
