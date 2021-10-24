/**
 * Check existence for different values (login, referral code, email, phone, ...).
 *
 * @namespace Fl32_Teq_User_Back_Service_Check_Existence
 */
// MODULE'S VARS
const NS = 'Fl32_Teq_User_Back_Service_Check_Existence';

/**
 * @implements TeqFw_Web_Back_Api_Service_IFactory
 */
export default class Fl32_Teq_User_Back_Service_Check_Existence {

    constructor(spec) {
        // EXTRACT DEPS
        /** @type {TeqFw_Db_Back_RDb_IConnect} */
        const conn = spec['TeqFw_Db_Back_RDb_IConnect$'];
        /** @type {TeqFw_Db_Back_Api_RDb_ICrudEngine} */
        const crud = spec['TeqFw_Db_Back_Api_RDb_ICrudEngine$'];
        /** @type {typeof Fl32_Teq_User_Shared_Service_Route_Check_Existence.Request} */
        const Request = spec['Fl32_Teq_User_Shared_Service_Route_Check_Existence#Request'];
        /** @type {Fl32_Teq_User_Shared_Service_Route_Check_Existence.Factory} */
        const route = spec['Fl32_Teq_User_Shared_Service_Route_Check_Existence#Factory$'];
        /** @type {Fl32_Teq_User_Back_Store_RDb_Schema_Auth_Password} */
        const metaAuthPass = spec['Fl32_Teq_User_Back_Store_RDb_Schema_Auth_Password$'];
        /** @type {Fl32_Teq_User_Back_Store_RDb_Schema_Id_Email} */
        const metaIdEmail = spec['Fl32_Teq_User_Back_Store_RDb_Schema_Id_Email$'];
        /** @type {Fl32_Teq_User_Back_Store_RDb_Schema_Id_Phone} */
        const metaIdPhone = spec['Fl32_Teq_User_Back_Store_RDb_Schema_Id_Phone$'];
        /** @type {Fl32_Teq_User_Back_Store_RDb_Schema_Ref_Link} */
        const metaRefLink = spec['Fl32_Teq_User_Back_Store_RDb_Schema_Ref_Link$'];

        // DEFINE WORKING VARS / PROPS
        /** @type {typeof Fl32_Teq_User_Back_Store_RDb_Schema_Auth_Password.ATTR} */
        const A_AUTH_PASS = metaAuthPass.getAttributes();
        /** @type {typeof Fl32_Teq_User_Back_Store_RDb_Schema_Id_Email.ATTR} */
        const A_ID_EMAIL = metaIdEmail.getAttributes();
        /** @type {typeof Fl32_Teq_User_Back_Store_RDb_Schema_Id_Phone.ATTR} */
        const A_ID_PHONE = metaIdPhone.getAttributes();
        /** @type {typeof Fl32_Teq_User_Back_Store_RDb_Schema_Ref_Link.ATTR} */
        const A_REF_LINK = metaRefLink.getAttributes();
        // DEFINE INSTANCE METHODS
        this.getRouteFactory = () => route;

        this.getService = function () {
            // DEFINE INNER FUNCTIONS
            /**
             * @param {TeqFw_Web_Back_Api_Service_Context} context
             * @return Promise<void>
             */
            async function service(context) {
                // DEFINE INNER FUNCTIONS

                /**
                 * @param {TeqFw_Db_Back_RDb_ITrans} trx
                 * @param {string} value
                 * @return {Promise<boolean>}
                 */
                async function checkEmail(trx, value) {
                    const dto = await crud.readOne(trx, metaIdEmail, {[A_ID_EMAIL.EMAIL]: value});
                    return (dto !== null);
                }

                /**
                 * @param {TeqFw_Db_Back_RDb_ITrans} trx
                 * @param {string} value
                 * @return {Promise<boolean>}
                 */
                async function checkLogin(trx, value) {
                    const dto = await crud.readOne(trx, metaAuthPass, {[A_AUTH_PASS.LOGIN]: value});
                    return (dto !== null);
                }

                /**
                 * @param {TeqFw_Db_Back_RDb_ITrans} trx
                 * @param {string} value
                 * @return {Promise<boolean>}
                 */
                async function checkPhone(trx, value) {
                    const dto = await crud.readOne(trx, metaIdPhone, {[A_ID_PHONE.PHONE]: value});
                    return (dto !== null);
                }

                /**
                 * @param {TeqFw_Db_Back_RDb_ITrans} trx
                 * @param {string} value
                 * @return {Promise<boolean>}
                 */
                async function checkRefCode(trx, value) {
                    const dto = await crud.readOne(trx, metaRefLink, {[A_REF_LINK.CODE]: value});
                    return (dto !== null);
                }

                // MAIN FUNCTIONALITY
                /** @type {Fl32_Teq_User_Shared_Service_Route_Check_Existence.Request} */
                const req = context.getInData();
                /** @type {Fl32_Teq_User_Shared_Service_Route_Check_Existence.Response} */
                const res = context.getOutData();
                //
                const trx = await conn.startTransaction();
                try {
                    const type = req.type;
                    if (req.value) {
                        const value = req.value.trim().toLowerCase();
                        // TODO: types are not navigable in IDEA on ctrl+click
                        if (type === Request.TYPE_EMAIL) {
                            res.exist = await checkEmail(trx, value);
                        } else if (type === Request.TYPE_LOGIN) {
                            res.exist = await checkLogin(trx, value);
                        } else if (type === Request.TYPE_PHONE) {
                            res.exist = await checkPhone(trx, value);
                        } else if (type === Request.TYPE_REF_CODE) {
                            res.exist = await checkRefCode(trx, value);
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
