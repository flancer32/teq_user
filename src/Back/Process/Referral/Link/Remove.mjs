/**
 * Remove referral link by code.
 *
 * @namespace Fl32_Teq_User_Back_Process_Referral_Link_Remove
 */
// MODULE'S VARS
const NS = 'Fl32_Teq_User_Back_Process_Referral_Link_Remove';

// MODULE'S FUNCTIONS
/**
 * Factory to setup execution context and to create the processor.
 *
 * @param {TeqFw_Di_SpecProxy} spec
 * @constructs Fl32_Teq_User_Back_Process_Referral_Link_Remove.process
 * @memberOf Fl32_Teq_User_Back_Process_Referral_Link_Remove
 */
function Factory(spec) {
    /** @type {typeof Fl32_Teq_User_Store_RDb_Schema_Ref_Link} */
    const ERefLink = spec['Fl32_Teq_User_Store_RDb_Schema_Ref_Link#']; // class

    /**
     * Remove referral link by code.
     * @param trx
     * @param {String} code
     * @returns {Promise<Number>}
     * @memberOf Fl32_Teq_User_Back_Process_Referral_Link_Remove
     */
    async function process({trx, code}) {
        const rs = await trx.from(ERefLink.ENTITY)
            .where(ERefLink.A_CODE, code.trim().toLowerCase())
            .del();
        return rs;
    }

    Object.defineProperty(process, 'name', {value: `${NS}.${process.name}`});
    return process;
}

// MODULE'S EXPORT
Object.defineProperty(Factory, 'name', {value: `${NS}.${Factory.name}`});
export default Factory;
