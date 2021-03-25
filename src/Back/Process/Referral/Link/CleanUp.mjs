/**
 * Process to clean up expired referral link.
 *
 * @namespace Fl32_Teq_User_Back_Process_Referral_Link_CleanUp
 */
// MODULE'S VARS
const NS = 'Fl32_Teq_User_Back_Process_Referral_Link_CleanUp';

// MODULE'S FUNCTIONS
/**
 * Factory to setup execution context and to create the processor.
 *
 * @param {TeqFw_Di_SpecProxy} spec
 * @constructs Fl32_Teq_User_Back_Process_Referral_Link_CleanUp.process
 * @memberOf Fl32_Teq_User_Back_Process_Referral_Link_CleanUp
 */
function Factory(spec) {
    /** @type {typeof Fl32_Teq_User_Store_RDb_Schema_Ref_Link} */
    const ERefLink = spec['Fl32_Teq_User_Store_RDb_Schema_Ref_Link#']; // class constructor

    /**
     * Process to clean up expired referral link.
     * @param trx
     * @returns {Promise<number>}
     * @memberOf Fl32_Teq_User_Back_Process_Referral_Link_CleanUp
     */
    async function process({trx}) {
        return await trx.from(ERefLink.ENTITY)
            .where(ERefLink.A_DATE_EXPIRED, '<', new Date())
            .del();
    }

    Object.defineProperty(process, 'name', {value: `${NS}.${process.name}`});
    return process;
}

// MODULE'S EXPORT
Object.defineProperty(Factory, 'name', {value: `${NS}.${Factory.name}`});
export default Factory;
