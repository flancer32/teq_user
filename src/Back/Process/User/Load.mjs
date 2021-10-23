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
    /** @type {typeof Fl32_Teq_User_Back_Store_RDb_Schema_Id_Email} */
    const EIdEmail = spec['Fl32_Teq_User_Back_Store_RDb_Schema_Id_Email#'];
    /** @type {typeof Fl32_Teq_User_Back_Store_RDb_Schema_Id_Phone} */
    const EIdPhone = spec['Fl32_Teq_User_Back_Store_RDb_Schema_Id_Phone#'];
    /** @type {Fl32_Teq_User_Back_Store_RDb_Query_GetUsers.queryBuilder|function}*/
    const qbGetUsers = spec['Fl32_Teq_User_Back_Store_RDb_Query_GetUsers$'];
    /** @type {typeof Fl32_Teq_User_Shared_Service_Dto_User} */
    const DUser = spec['Fl32_Teq_User_Shared_Service_Dto_User#'];
    /** @type {TeqFw_User_Back_Store_RDb_Schema_User} */
    const metaUser = spec['TeqFw_User_Back_Store_RDb_Schema_User$'];

    // DEFINE WORKING VARS / PROPS
    /** @type {typeof TeqFw_User_Back_Store_RDb_Schema_User.ATTR} */
    const A_USER = metaUser.getAttributes();

    /**
     * Process to load user profile data.
     * @param {TeqFw_Db_Back_RDb_ITrans} trx
     * @param {Number} userId
     * @returns {Promise<Fl32_Teq_User_Shared_Service_Dto_User>}
     * @memberOf Fl32_Teq_User_Back_Process_User_Load
     */
    async function process({trx, userId}) {
        // DEFINE INNER FUNCTIONS
        async function getEmails(trx, userId) {
            const result = [];
            const query = trx.from(EIdEmail.ENTITY);
            query.select([EIdEmail.A_EMAIL]);
            query.where(EIdEmail.A_USER_REF, userId);
            const rs = await query;
            if (rs.length > 0) {
                for (const one of rs) result.push(one[EIdEmail.A_EMAIL]);
            }
            return result;
        }

        async function getPhones(trx, userId) {
            const result = [];
            const query = trx.from(EIdPhone.ENTITY);
            query.select([EIdPhone.A_PHONE]);
            query.where(EIdPhone.A_USER_REF, userId);
            const rs = await query;
            if (rs.length > 0) {
                for (const one of rs) result.push(one[EIdPhone.A_PHONE]);
            }
            return result;
        }

        /**
         * @param {TeqFw_Db_Back_RDb_ITrans} trx
         * @param {Number} userId
         * @returns {Promise<Fl32_Teq_User_Shared_Service_Dto_User|null>}
         */
        async function getUserById(trx, userId) {
            let result = null;
            const query = qbGetUsers(trx);
            query.where(A_USER.ID, userId);
            const rows = await query;
            if (rows[0]) {
                /** @type {Fl32_Teq_User_Shared_Service_Dto_User} */
                const user = new DUser();
                result = Object.assign(user, rows[0]);
            }
            return result;
        }

        // MAIN FUNCTIONALITY
        /** @type {Fl32_Teq_User_Shared_Service_Dto_User} */
        const user = await getUserById(trx, userId);
        // get parent data
        if (user.parentId !== user.id) {
            const parent = await getUserById(trx, user.parentId);
            user.parentName = parent.name;
        } else {
            user.parentName = user.name;
        }
        // emails & phones
        user.emails = await getEmails(trx.getTrx(), user.id);
        user.phones = await getPhones(trx.getTrx(), user.id);

        // COMPOSE RESULT
        return user;
    }

    Object.defineProperty(process, 'name', {value: `${NS}.${process.name}`});
    return process;
}

// MODULE'S EXPORT
Object.defineProperty(Factory, 'name', {value: `${NS}.${Factory.name}`});
export default Factory;
