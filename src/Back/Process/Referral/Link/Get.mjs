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
 * @param {TeqFw_Di_Shared_SpecProxy} spec
 * @constructs Fl32_Teq_User_Back_Process_Referral_Link_Get.process
 * @memberOf Fl32_Teq_User_Back_Process_Referral_Link_Get
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
     * Get referral link.
     * @param {TeqFw_Db_Back_RDb_ITrans} trx
     * @param {string} code
     * @returns {Promise<Fl32_Teq_User_Back_Store_RDb_Schema_Ref_Link.Dto|null>}
     * @memberOf Fl32_Teq_User_Back_Process_Referral_Link_Get
     */
    async function process({trx, code}) {
        const norm = code.trim().toLowerCase();
        return await crud.readOne(trx, metaRefLink, {[A_REF_LINK.CODE]: norm});
    }

    Object.defineProperty(process, 'name', {value: `${NS}.${process.name}`});
    return process;
}

// MODULE'S EXPORT
Object.defineProperty(Factory, 'name', {value: `${NS}.${Factory.name}`});
export default Factory;
