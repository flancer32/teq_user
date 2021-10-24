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
            await crud.create(trx, metaAuthPass, {
                [A_AUTH_PASS.USER_REF]: userId,
                [A_AUTH_PASS.LOGIN]: user.login.trim().toLowerCase(),
                [A_AUTH_PASS.PASSWORD_HASH]: hash,
            });

        }
        // register profile
        if (user.name) {
            await crud.create(trx, metaProfile, {
                [A_PROFILE.USER_REF]: userId,
                [A_PROFILE.NAME]: user.name.trim(),
            });
        }
        // register user in the referrals tree
        await crud.create(trx, metaRefTree, {
            [A_REF_TREE.USER_REF]: userId,
            [A_REF_TREE.PARENT_REF]: user.parentId,
        });
        // register email
        if (Array.isArray(user.emails))
            for (const one of user.emails)
                await crud.create(trx, metaIdEmail, {
                    [A_ID_EMAIL.USER_REF]: userId,
                    [A_ID_EMAIL.EMAIL]: one.trim().toLowerCase(),
                });
        // register phone
        if (Array.isArray(user.phones))
            for (const one of user.phones)
                await crud.create(trx, metaIdPhone, {
                    [A_ID_PHONE.USER_REF]: userId,
                    [A_ID_PHONE.PHONE]: one.trim().toLowerCase(),
                });

        // COMPOSE RESULT
        return userId;
    }

    Object.defineProperty(process, 'name', {value: `${NS}.${process.name}`});
    return process;
}

// MODULE'S EXPORT
Object.defineProperty(Factory, 'name', {value: `${NS}.${Factory.name}`});
export default Factory;
