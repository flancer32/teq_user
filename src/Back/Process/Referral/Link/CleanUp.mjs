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
 * @param {TeqFw_Di_Shared_SpecProxy} spec
 * @constructs Fl32_Teq_User_Back_Process_Referral_Link_CleanUp.process
 * @memberOf Fl32_Teq_User_Back_Process_Referral_Link_CleanUp
 */
function Factory(spec) {
    /** @type {TeqFw_Db_Back_Api_RDb_ICrudEngine} */
    const crud = spec['TeqFw_Db_Back_Api_RDb_ICrudEngine$'];
    /** @type {Fl32_Teq_User_Back_Store_RDb_Schema_Ref_Link} */
    const metaRefLink = spec['Fl32_Teq_User_Back_Store_RDb_Schema_Ref_Link$'];

    // DEFINE WORKING VARS / PROPS
    /** @type {typeof Fl32_Teq_User_Back_Store_RDb_Schema_Ref_Link.ATTR} */
    const A_REF_LINK = metaRefLink.getAttributes();

    /**
     * Process to clean up expired referral link.
     * @param {TeqFw_Db_Back_RDb_ITrans} trx
     * @returns {Promise<number>}
     * @memberOf Fl32_Teq_User_Back_Process_Referral_Link_CleanUp
     */
    async function process({trx}) {
        const where = (build) => build.where(A_REF_LINK.DATE_EXPIRED, '<', new Date());
        return await crud.deleteSet(trx, metaRefLink, where);
    }

    Object.defineProperty(process, 'name', {value: `${NS}.${process.name}`});
    return process;
}

// MODULE'S EXPORT
Object.defineProperty(Factory, 'name', {value: `${NS}.${Factory.name}`});
export default Factory;
