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
 * @param {TeqFw_Di_Shared_SpecProxy} spec
 * @constructs Fl32_Teq_User_Back_Process_User_Create.process
 * @memberOf Fl32_Teq_User_Back_Process_User_Create
 */
function Factory(spec) {
    /** @type {Fl32_Teq_User_Back_Defaults} */
    const DEF = spec['Fl32_Teq_User_Back_Defaults$'];
    /** @type {TeqFw_Db_Back_Api_RDb_ICrudEngine} */
    const crud = spec['TeqFw_Db_Back_Api_RDb_ICrudEngine$'];
    /** @type {typeof Fl32_Teq_User_Back_Store_RDb_Schema_Auth_Password} */
    const EAuthPass = spec['Fl32_Teq_User_Back_Store_RDb_Schema_Auth_Password#'];
    /** @type {typeof Fl32_Teq_User_Back_Store_RDb_Schema_Id_Email} */
    const EIdEmail = spec['Fl32_Teq_User_Back_Store_RDb_Schema_Id_Email#'];
    /** @type {typeof Fl32_Teq_User_Back_Store_RDb_Schema_Id_Phone} */
    const EIdPhone = spec['Fl32_Teq_User_Back_Store_RDb_Schema_Id_Phone#'];
    /** @type {typeof Fl32_Teq_User_Back_Store_RDb_Schema_Profile} */
    const EProfile = spec['Fl32_Teq_User_Back_Store_RDb_Schema_Profile#'];
    /** @type {typeof Fl32_Teq_User_Back_Store_RDb_Schema_Ref_Tree} */
    const ERefTree = spec['Fl32_Teq_User_Back_Store_RDb_Schema_Ref_Tree#'];
    /** @type {TeqFw_User_Back_Store_RDb_Schema_User} */
    const metaUser = spec['TeqFw_User_Back_Store_RDb_Schema_User$'];

    // DEFINE WORKING VARS / PROPS
    /** @type {typeof TeqFw_User_Back_Store_RDb_Schema_User.ATTR} */
    const A_USER = metaUser.getAttributes();


    // DEFINE INNER FUNCTIONS
    /**
     * Process to add new user.
     * @param {TeqFw_Db_Back_RDb_ITrans} trx
     * @param {Fl32_Teq_User_Shared_Service_Dto_User} user
     * @returns {Promise<Fl32_Teq_User_Shared_Service_Dto_User>}
     * @memberOf Fl32_Teq_User_Back_Process_User_Create
     */
    async function process({trx, user}) {
        // create new user in registry
        const pkey = await crud.create(trx, metaUser, {});
        const userId = pkey[A_USER.ID];
        // register login & password
        if (user.login && user.password) {
            const hash = await $bcrypt.hash(user.password, DEF.BCRYPT_HASH_ROUNDS);
            await trx.getQuery(EAuthPass.ENTITY).insert({
                [EAuthPass.A_USER_REF]: userId,
                [EAuthPass.A_LOGIN]: user.login.trim().toLowerCase(),
                [EAuthPass.A_PASSWORD_HASH]: hash,
            });
        }
        // register profile
        if (user.name) {
            await trx.getQuery(EProfile.ENTITY).insert({
                [EProfile.A_USER_REF]: userId,
                [EProfile.A_NAME]: user.name.trim(),
            });
        }
        // register user in the referrals tree
        await trx.getQuery(ERefTree.ENTITY).insert({
            [ERefTree.A_USER_REF]: userId,
            [ERefTree.A_PARENT_REF]: user.parentId,
        });
        // register email
        if (Array.isArray(user.emails)) {
            for (const one of user.emails) {
                await trx.getQuery(EIdEmail.ENTITY).insert({
                    [EIdEmail.A_USER_REF]: userId,
                    [EIdEmail.A_EMAIL]: one.trim().toLowerCase(),
                });
            }
        }
        // register phone
        if (Array.isArray(user.phones)) {
            for (const one of user.phones) {
                await trx.getQuery(EIdPhone.ENTITY).insert({
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
