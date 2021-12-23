/**
 * Process to load user profile data.
 *
 * @namespace Fl32_Teq_User_Back_Process_User_Load
 */
// MODULE'S VARS
const NS = 'Fl32_Teq_User_Back_Process_User_Load';

// MODULE'S FUNCTIONS
/**
 * Factory to setup execution context and to create the processor.
 *
 * @param {TeqFw_Di_Shared_SpecProxy} spec
 * @constructs Fl32_Teq_User_Back_Process_User_Load.process
 * @memberOf Fl32_Teq_User_Back_Process_User_Load
 */
function Factory(spec) {
    /** @type {TeqFw_Db_Back_Api_RDb_ICrudEngine} */
    const crud = spec['TeqFw_Db_Back_Api_RDb_ICrudEngine$'];
    /** @type {Fl32_Teq_User_Back_Store_RDb_Query_GetUsers.queryBuilder|function}*/
    const qbGetUsers = spec['Fl32_Teq_User_Back_Store_RDb_Query_GetUsers$'];
    /** @type {typeof Fl32_Teq_User_Shared_Dto_User} */
    const DUser = spec['Fl32_Teq_User_Shared_Dto_User#'];
    /** @type {TeqFw_User_Back_Store_RDb_Schema_User} */
    const metaUser = spec['TeqFw_User_Back_Store_RDb_Schema_User$'];
    /** @type {Fl32_Teq_User_Back_Store_RDb_Schema_Id_Email} */
    const metaIdEmail = spec['Fl32_Teq_User_Back_Store_RDb_Schema_Id_Email$'];
    /** @type {Fl32_Teq_User_Back_Store_RDb_Schema_Id_Phone} */
    const metaIdPhone = spec['Fl32_Teq_User_Back_Store_RDb_Schema_Id_Phone$'];

    // DEFINE WORKING VARS / PROPS
    /** @type {typeof TeqFw_User_Back_Store_RDb_Schema_User.ATTR} */
    const A_USER = metaUser.getAttributes();
    /** @type {typeof Fl32_Teq_User_Back_Store_RDb_Schema_Id_Email.ATTR} */
    const A_ID_EMAIL = metaIdEmail.getAttributes();
    /** @type {typeof Fl32_Teq_User_Back_Store_RDb_Schema_Id_Phone.ATTR} */
    const A_ID_PHONE = metaIdPhone.getAttributes();

    /**
     * Process to load user profile data.
     * @param {TeqFw_Db_Back_RDb_ITrans} trx
     * @param {Number} userId
     * @returns {Promise<Fl32_Teq_User_Shared_Dto_User>}
     * @memberOf Fl32_Teq_User_Back_Process_User_Load
     */
    async function process({trx, userId}) {

        // DEFINE INNER FUNCTIONS

        /**
         * @param {TeqFw_Db_Back_RDb_ITrans} trx
         * @param {number} userId
         * @return {Promise<string[]>}
         */
        async function getEmails(trx, userId) {
            const result = [];
            const where = {[A_ID_EMAIL.USER_REF]: userId};
            /** @type {Fl32_Teq_User_Back_Store_RDb_Schema_Id_Email.Dto[]} */
            const items = await crud.readSet(trx, metaIdEmail, where);
            for (const item of items) result.push(item.email);
            return result;
        }

        /**
         * @param {TeqFw_Db_Back_RDb_ITrans} trx
         * @param {number} userId
         * @return {Promise<string[]>}
         */
        async function getPhones(trx, userId) {
            const result = [];
            const where = {[A_ID_PHONE.USER_REF]: userId};
            /** @type {Fl32_Teq_User_Back_Store_RDb_Schema_Id_Phone.Dto[]} */
            const items = await crud.readSet(trx, metaIdPhone, where);
            for (const item of items) result.push(item.phone);
            return result;
        }

        /**
         * @param {TeqFw_Db_Back_RDb_ITrans} trx
         * @param {Number} userId
         * @returns {Promise<Fl32_Teq_User_Shared_Dto_User|null>}
         */
        async function getUserById(trx, userId) {
            let result = null;
            const query = qbGetUsers(trx);
            query.where(A_USER.ID, userId);
            const rows = await query;
            if (rows[0]) {
                /** @type {Fl32_Teq_User_Shared_Dto_User} */
                const user = new DUser();
                result = Object.assign(user, rows[0]);
            }
            return result;
        }

        // MAIN FUNCTIONALITY
        /** @type {Fl32_Teq_User_Shared_Dto_User} */
        const user = await getUserById(trx, userId);
        // get parent data
        if (user.parentId !== user.id) {
            const parent = await getUserById(trx, user.parentId);
            user.parentName = parent.name;
        } else {
            user.parentName = user.name;
        }
        // emails & phones
        user.emails = await getEmails(trx, user.id);
        user.phones = await getPhones(trx, user.id);

        // COMPOSE RESULT
        return user;
    }

    Object.defineProperty(process, 'name', {value: `${NS}.${process.name}`});
    return process;
}

// MODULE'S EXPORT
Object.defineProperty(Factory, 'name', {value: `${NS}.${Factory.name}`});
export default Factory;
