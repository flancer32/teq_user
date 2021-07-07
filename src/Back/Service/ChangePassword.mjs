/**
 * Change user password.
 *
 * @namespace Fl32_Teq_User_Back_Service_ChangePassword
 */
// MODULE'S IMPORT
import $bcrypt from 'bcrypt';

// MODULE'S VARS
const NS = 'Fl32_Teq_User_Back_Service_ChangePassword';
/**
 * @implements TeqFw_Web_Back_Api_Service_IFactory
 */
export default class Fl32_Teq_User_Back_Service_ChangePassword {

    constructor(spec) {
        /** @type {Fl32_Teq_User_Back_Defaults} */
        const DEF = spec['Fl32_Teq_User_Back_Defaults$'];    
        /** @type {TeqFw_Core_Back_RDb_Connector} */
        const rdb = spec['TeqFw_Core_Back_RDb_Connector$'];  
        /** @type {typeof Fl32_Teq_User_Store_RDb_Schema_Auth_Password} */
        const EAuthPass = spec['Fl32_Teq_User_Store_RDb_Schema_Auth_Password#']; 
        /** @type {Fl32_Teq_User_Shared_Service_Route_ChangePassword.Factory} */
        const route = spec['Fl32_Teq_User_Shared_Service_Route_ChangePassword#Factory$'];

        // DEFINE INSTANCE METHODS

        this.getRouteFactory = () => route;

        this.getService = function () {
            // DEFINE INNER FUNCTIONS
            /**
             * @param {TeqFw_Web_Back_Api_Service_IContext} context
             * @return Promise<void>
             */
            async function service(context) {
                // DEFINE INNER FUNCTIONS
                async function isValidPassword(trx, userId, password) {
                    let result = false;
                    const query = trx.from(EAuthPass.ENTITY)
                        .select([EAuthPass.A_PASSWORD_HASH])
                        .where(EAuthPass.A_USER_REF, userId);
                    /** @type {TextRow[]} */
                    const rs = await query;
                    if (rs.length) {
                        const [first] = rs;
                        const hash = first[EAuthPass.A_PASSWORD_HASH];
                        // validate password
                        result = await $bcrypt.compare(password, hash);
                    }
                    return result;
                }

                async function setPassword(trx, userId, password) {
                    const hash = await $bcrypt.hash(password, DEF.BCRYPT_HASH_ROUNDS);
                    await trx(EAuthPass.ENTITY)
                        .update({
                            [EAuthPass.A_PASSWORD_HASH]: hash,
                        })
                        .where({[EAuthPass.A_USER_REF]: userId});
                }

                // MAIN FUNCTIONALITY
                /** @type {Fl32_Teq_User_Shared_Service_Route_ChangePassword.Request} */
                const req = context.getInData();
                /** @type {Fl32_Teq_User_Shared_Service_Route_ChangePassword.Response} */
                const res = context.getOutData();
                const shared = context.getHandlersShare();
                //
                const trx = await rdb.startTransaction();
                res.success = false;
                try {
                    if (shared && shared[DEF.HTTP_SHARE_CTX_USER]) {
                        /** @type {Fl32_Teq_User_Shared_Service_Dto_User} */
                        const user = shared && shared[DEF.HTTP_SHARE_CTX_USER];
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
