/**
 * Process to add new user.
 *
 * @namespace Fl32_Teq_User_Back_Process_User_Create
 */
// MODULE'S IMPORT
import $bcrypt from 'bcrypt';

// MODULE'S VARS
const NS = 'Fl32_Teq_User_Back_Process_User_Create';

// MODULE'S FUNCTIONS
/**
 * Factory to setup execution context and to create the processor.
 *
 * @param {TeqFw_Di_SpecProxy} spec
 * @constructs Fl32_Teq_User_Back_Process_User_Create.process
 * @memberOf Fl32_Teq_User_Back_Process_User_Create
 */
function Factory(spec) {
    /** @type {Fl32_Teq_User_Defaults} */
    const DEF = spec['Fl32_Teq_User_Defaults$'];
    /** @type {typeof Fl32_Teq_User_Store_RDb_Schema_Auth_Password} */
    const EAuthPass = spec['Fl32_Teq_User_Store_RDb_Schema_Auth_Password#']; // class constructor
    /** @type {typeof Fl32_Teq_User_Store_RDb_Schema_Id_Email} */
    const EIdEmail = spec['Fl32_Teq_User_Store_RDb_Schema_Id_Email#']; // class constructor
    /** @type {typeof Fl32_Teq_User_Store_RDb_Schema_Id_Phone} */
    const EIdPhone = spec['Fl32_Teq_User_Store_RDb_Schema_Id_Phone#']; // class constructor
    /** @type {typeof Fl32_Teq_User_Store_RDb_Schema_Profile} */
    const EProfile = spec['Fl32_Teq_User_Store_RDb_Schema_Profile#'];
    /** @type {typeof Fl32_Teq_User_Store_RDb_Schema_Ref_Tree} */
    const ERefTree = spec['Fl32_Teq_User_Store_RDb_Schema_Ref_Tree#']; // class constructor
    /** @type {typeof Fl32_Teq_User_Store_RDb_Schema_User} */
    const EUser = spec['Fl32_Teq_User_Store_RDb_Schema_User#']; // class constructor

    /**
     * Process to add new user.
     * @param trx
     * @param {Fl32_Teq_User_Shared_Api_Data_User} user
     * @returns {Promise<Fl32_Teq_User_Shared_Api_Data_User>}
     * @memberOf Fl32_Teq_User_Back_Process_User_Create
     */
    async function process({trx, user}) {
        // create new user in registry
        const rs = await trx(EUser.ENTITY).insert({}, EUser.A_ID);
        const userId = rs[0];
        // register login & password
        if (user.login && user.password) {
            const hash = await $bcrypt.hash(user.password, DEF.BCRYPT_HASH_ROUNDS);
            await trx(EAuthPass.ENTITY).insert({
                [EAuthPass.A_USER_REF]: userId,
                [EAuthPass.A_LOGIN]: user.login.trim().toLowerCase(),
                [EAuthPass.A_PASSWORD_HASH]: hash,
            });
        }
        // register profile
        if (user.name) {
            await trx(EProfile.ENTITY).insert({
                [EProfile.A_USER_REF]: userId,
                [EProfile.A_NAME]: user.name.trim(),
            });
        }
        // register user in the referrals tree
        await trx(ERefTree.ENTITY).insert({
            [ERefTree.A_USER_REF]: userId,
            [ERefTree.A_PARENT_REF]: user.parentId,
        });
        // register email
        if (Array.isArray(user.emails)) {
            for (const one of user.emails) {
                await trx(EIdEmail.ENTITY).insert({
                    [EIdEmail.A_USER_REF]: userId,
                    [EIdEmail.A_EMAIL]: one.trim().toLowerCase(),
                });
            }
        }
        // register phone
        if (Array.isArray(user.phones)) {
            for (const one of user.phones) {
                await trx(EIdPhone.ENTITY).insert({
                    [EIdPhone.A_USER_REF]: userId,
                    [EIdPhone.A_PHONE]: one.trim().toLowerCase(),
                });
            }
        }

        // COMPOSE RESULT
        return userId;
    }

    Object.defineProperty(process, 'name', {value: `${NS}.${process.name}`});
    return process;
}

// MODULE'S EXPORT
Object.defineProperty(Factory, 'name', {value: `${NS}.${Factory.name}`});
export default Factory;
