/**
 * Get referral link.
 *
 * @namespace Fl32_Teq_User_Back_Process_Referral_Link_Get
 */
// MODULE'S VARS
const NS = 'Fl32_Teq_User_Back_Process_Referral_Link_Get';

// MODULE'S FUNCTIONS
/**
 * Factory to setup execution context and to create the processor.
 *
 * @param {TeqFw_Di_SpecProxy} spec
 * @constructs Fl32_Teq_User_Back_Process_Referral_Link_Get.process
 * @memberOf Fl32_Teq_User_Back_Process_Referral_Link_Get
 */
function Factory(spec) {
    /** @type {typeof Fl32_Teq_User_Store_RDb_Schema_Ref_Link} */
    const ERefLink = spec['Fl32_Teq_User_Store_RDb_Schema_Ref_Link#']; // class

    /**
     * Get referral link.
     * @param trx
     * @param {String} code
     * @returns {Promise<Fl32_Teq_User_Store_RDb_Schema_Ref_Link>}
     * @memberOf Fl32_Teq_User_Back_Process_Referral_Link_Get
     */
    async function process({trx, code}) {
        let result;
        const norm = code.trim().toLowerCase();
        const query = trx.from(ERefLink.ENTITY);
        query.select();
        query.where(ERefLink.A_CODE, norm);
        /** @type {Array} */
        const rs = await query;
        if (rs.length === 1) {
            const [first] = rs;
            result = Object.assign(new ERefLink(), first);
        }
        return result;
    }

    Object.defineProperty(process, 'name', {value: `${NS}.${process.name}`});
    return process;
}

// MODULE'S EXPORT
Object.defineProperty(Factory, 'name', {value: `${NS}.${Factory.constructor.name}`});
export default Factory;
