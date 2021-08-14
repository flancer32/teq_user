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
        /** @type {TeqFw_Db_Back_RDb_Connect} */
        const rdb = spec['TeqFw_Db_Back_RDb_Connect$'];
        /** @type {typeof Fl32_Teq_User_Store_RDb_Schema_Auth_Password} */
        const EAuthPass = spec['Fl32_Teq_User_Store_RDb_Schema_Auth_Password#'];
        /** @type {typeof Fl32_Teq_User_Store_RDb_Schema_Id_Email} */
        const EIdEmail = spec['Fl32_Teq_User_Store_RDb_Schema_Id_Email#'];
        /** @type {typeof Fl32_Teq_User_Store_RDb_Schema_Id_Phone} */
        const EIdPhone = spec['Fl32_Teq_User_Store_RDb_Schema_Id_Phone#'];
        /** @type {typeof Fl32_Teq_User_Store_RDb_Schema_Ref_Link} */
        const ERefLink = spec['Fl32_Teq_User_Store_RDb_Schema_Ref_Link#'];
        /** @type {typeof Fl32_Teq_User_Shared_Service_Route_Check_Existence.Request} */
        const Request = spec['Fl32_Teq_User_Shared_Service_Route_Check_Existence#Request'];
        /** @type {Fl32_Teq_User_Shared_Service_Route_Check_Existence.Factory} */
        const route = spec['Fl32_Teq_User_Shared_Service_Route_Check_Existence#Factory$'];

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

                async function checkEmail(trx, value) {
                    const query = trx.from(EIdEmail.ENTITY);
                    query.select([EIdEmail.A_USER_REF]);
                    query.where(EIdEmail.A_EMAIL, value);
                    const rs = await query;
                    return (rs.length >= 1);
                }

                async function checkLogin(trx, value) {
                    const query = trx.from(EAuthPass.ENTITY);
                    query.select([EAuthPass.A_USER_REF]);
                    query.where(EAuthPass.A_LOGIN, value);
                    const rs = await query;
                    return (rs.length >= 1);
                }

                async function checkPhone(trx, value) {
                    const query = trx.from(EIdPhone.ENTITY);
                    query.select([EIdPhone.A_USER_REF]);
                    query.where(EIdPhone.A_PHONE, value);
                    const rs = await query;
                    return (rs.length >= 1);
                }

                async function checkRefCode(trx, value) {
                    const query = trx.from(ERefLink.ENTITY);
                    query.select([ERefLink.A_USER_REF]);
                    query.where(ERefLink.A_CODE, value);
                    const rs = await query;
                    return (rs.length >= 1);
                }

                // MAIN FUNCTIONALITY
                /** @type {Fl32_Teq_User_Shared_Service_Route_Check_Existence.Request} */
                const req = context.getInData();
                /** @type {Fl32_Teq_User_Shared_Service_Route_Check_Existence.Response} */
                const res = context.getOutData();
                //
                const trx = await rdb.startTransaction();
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
                    trx.commit();
                } catch (error) {
                    trx.rollback();
                    throw error;
                }
            }

            // MAIN FUNCTIONALITY
            Object.defineProperty(service, 'name', {value: `${NS}.${service.name}`});
            return service;
        }
    }
}
