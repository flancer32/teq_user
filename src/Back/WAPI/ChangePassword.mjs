/**
 * Change user password.
 *
 * @namespace Fl32_Teq_User_Back_WAPI_ChangePassword
 */
// MODULE'S IMPORT
import $bcrypt from 'bcrypt';

// MODULE'S VARS
const NS = 'Fl32_Teq_User_Back_WAPI_ChangePassword';
/**
 * @implements TeqFw_Web_Back_Api_WAPI_IFactory
 */
export default class Fl32_Teq_User_Back_WAPI_ChangePassword {

    constructor(spec) {
        /** @type {Fl32_Teq_User_Back_Defaults} */
        const DEF = spec['Fl32_Teq_User_Back_Defaults$'];
        /** @type {TeqFw_Db_Back_RDb_IConnect} */
        const rdb = spec['TeqFw_Db_Back_RDb_IConnect$'];
        /** @type {Fl32_Teq_User_Shared_WAPI_ChangePassword.Factory} */
        const route = spec['Fl32_Teq_User_Shared_WAPI_ChangePassword#Factory$'];
        /** @type {Fl32_Teq_User_Back_Store_RDb_Schema_Auth_Password} */
        const metaAuthPass = spec['Fl32_Teq_User_Back_Store_RDb_Schema_Auth_Password$'];

        // DEFINE WORKING VARS / PROPS
        /** @type {typeof Fl32_Teq_User_Back_Store_RDb_Schema_Auth_Password.ATTR} */
        const A_AUTH_PASS = metaAuthPass.getAttributes();

        // DEFINE INSTANCE METHODS

        this.getRouteFactory = () => route;

        this.getService = function () {

            // DEFINE INNER FUNCTIONS
            /**
             * @param {TeqFw_Web_Back_Handler_WAPI_Context} context
             * @return Promise<void>
             */
            async function service(context) {

                // DEFINE INNER FUNCTIONS
                /**
                 * @param {TeqFw_Db_Back_RDb_ITrans} trx
                 * @param userId
                 * @param password
                 * @return {Promise<boolean>}
                 */
                async function isValidPassword(trx, userId, password) {
                    let result = false;
                    const T_AUTH_PASS = trx.getTableName(metaAuthPass);
                    const query = trx.getQuery(T_AUTH_PASS)
                        .select([A_AUTH_PASS.PASSWORD_HASH])
                        .where(A_AUTH_PASS.USER_REF, userId);
                    /** @type {TextRow[]} */
                    const rs = await query;
                    if (rs.length) {
                        const [first] = rs;
                        const hash = first[A_AUTH_PASS.PASSWORD_HASH];
                        // validate password
                        result = await $bcrypt.compare(password, hash);
                    }
                    return result;
                }

                async function setPassword(trx, userId, password) {
                    const T_AUTH_PASS = trx.getTableName(metaAuthPass);
                    const hash = await $bcrypt.hash(password, DEF.BCRYPT_HASH_ROUNDS);
                    await trx.getQuery(T_AUTH_PASS)
                        .update({
                            [A_AUTH_PASS.PASSWORD_HASH]: hash,
                        })
                        .where({[A_AUTH_PASS.USER_REF]: userId});
                }

                // MAIN FUNCTIONALITY
                /** @type {Fl32_Teq_User_Shared_WAPI_ChangePassword.Request} */
                const req = context.getInData();
                /** @type {Fl32_Teq_User_Shared_WAPI_ChangePassword.Response} */
                const res = context.getOutData();
                const share = context.getHandlersShare();
                //
                const trx = await rdb.startTransaction();
                res.success = false;
                try {
                    if (share.get(DEF.SHARE_USER)) {
                        /** @type {Fl32_Teq_User_Shared_Dto_User} */
                        const user = share.get(DEF.SHARE_USER);
                        const isValid = await isValidPassword(trx, user.id, req.passwordCurrent);
                        if (isValid) {
                            await setPassword(trx, user.id, req.passwordNew);
                            res.success = true;
                        }
                    }
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
