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
    /** @type {typeof Fl32_Teq_User_Store_RDb_Schema_Id_Email} */
    const EIdEmail = spec['Fl32_Teq_User_Store_RDb_Schema_Id_Email#']; 
    /** @type {typeof Fl32_Teq_User_Store_RDb_Schema_Id_Phone} */
    const EIdPhone = spec['Fl32_Teq_User_Store_RDb_Schema_Id_Phone#']; 
    /** @type {typeof Fl32_Teq_User_Store_RDb_Schema_User} */
    const EUser = spec['Fl32_Teq_User_Store_RDb_Schema_User#']; 
    /** @function {@type Fl32_Teq_User_Store_RDb_Query_GetUsers.queryBuilder}*/
    const qbGetUsers = spec['Fl32_Teq_User_Store_RDb_Query_GetUsers$']; 
    /** @type {typeof Fl32_Teq_User_Shared_Service_Dto_User} */
    const DUser = spec['Fl32_Teq_User_Shared_Service_Dto_User#']; 

    /**
     * Process to load user profile data.
     * @param trx
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
         * @param trx
         * @param {Number} userId
         * @returns {Promise<Fl32_Teq_User_Shared_Service_Dto_User|null>}
         */
        async function getUserById(trx, userId) {
            let result = null;
            const query = qbGetUsers(trx);
            query.where(EUser.A_ID, userId);
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
        user.emails = await getEmails(trx, user.id);
        user.phones = await getPhones(trx, user.id);

        // COMPOSE RESULT
        return user;
    }

    Object.defineProperty(process, 'name', {value: `${NS}.${process.name}`});
    return process;
}

// MODULE'S EXPORT
Object.defineProperty(Factory, 'name', {value: `${NS}.${Factory.constructor.name}`});
export default Factory;
