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
    /** @type {Fl32_Teq_User_Store_RDb_Schema_Auth_Password} */
    const eAuthPass = spec['Fl32_Teq_User_Store_RDb_Schema_Auth_Password$'];   // instance singleton
    /** @type {Fl32_Teq_User_Store_RDb_Schema_Id_Email} */
    const eIdEmail = spec['Fl32_Teq_User_Store_RDb_Schema_Id_Email$']; // instance singleton
    /** @type {Fl32_Teq_User_Store_RDb_Schema_Id_Phone} */
    const eIdPhone = spec['Fl32_Teq_User_Store_RDb_Schema_Id_Phone$']; // instance singleton
    /** @type {Fl32_Teq_User_Store_RDb_Schema_Profile} */
    const eProfile = spec['Fl32_Teq_User_Store_RDb_Schema_Profile$'];          // instance singleton
    /** @type {Fl32_Teq_User_Store_RDb_Schema_Ref_Tree} */
    const eRefTree = spec['Fl32_Teq_User_Store_RDb_Schema_Ref_Tree$'];         // instance singleton
    /** @type {Fl32_Teq_User_Store_RDb_Schema_User} */
    const eUser = spec['Fl32_Teq_User_Store_RDb_Schema_User$']; // instance singleton

    /**
     * Process to add new user.
     * @param trx
     * @param {Fl32_Teq_User_Shared_Api_Data_User} user
     * @returns {Promise<Fl32_Teq_User_Shared_Api_Data_User>}
     * @memberOf Fl32_Teq_User_Back_Process_User_Create
     */
    async function process({trx, user}) {
        // create new user in registry
        const rs = await trx(eUser.ENTITY).insert({}, eUser.A_ID);
        const userId = rs[0];
        // register login & password
        if (user.login && user.password) {
            const hash = await $bcrypt.hash(user.password, DEF.BCRYPT_HASH_ROUNDS);
            await trx(eAuthPass.ENTITY).insert({
                [eAuthPass.A_USER_REF]: userId,
                [eAuthPass.A_LOGIN]: user.login.trim().toLowerCase(),
                [eAuthPass.A_PASSWORD_HASH]: hash,
            });
        }
        // register profile
        if (user.name) {
            await trx(eProfile.ENTITY).insert({
                [eProfile.A_USER_REF]: userId,
                [eProfile.A_NAME]: user.name.trim(),
            });
        }
        // register user in the referrals tree
        await trx(eRefTree.ENTITY).insert({
            [eRefTree.A_USER_REF]: userId,
            [eRefTree.A_PARENT_REF]: user.parentId,
        });
        // register email
        if (Array.isArray(user.emails)) {
            for (const one of user.emails) {
                await trx(eIdEmail.ENTITY).insert({
                    [eIdEmail.A_USER_REF]: userId,
                    [eIdEmail.A_EMAIL]: one.trim().toLowerCase(),
                });
            }
        }
        // register phone
        if (Array.isArray(user.phones)) {
            for (const one of user.phones) {
                await trx(eIdPhone.ENTITY).insert({
                    [eIdPhone.A_USER_REF]: userId,
                    [eIdPhone.A_PHONE]: one.trim().toLowerCase(),
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
