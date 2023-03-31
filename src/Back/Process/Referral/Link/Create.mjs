/**
 * Process to generate referral link.
 *
 * @namespace Fl32_Teq_User_Back_Process_Referral_Link_Create
 */
// MODULE'S IMPORT
import $crypto from 'crypto';

// MODULE'S VARS
const NS = 'Fl32_Teq_User_Back_Process_Referral_Link_Create';
const CODE_LENGTH = 16;
const LIFETIME_DAY = 1;

// MODULE'S FUNCTIONS
/**
 * Factory to setup execution context and to create the processor.
 *
 * @param {TeqFw_Di_Shared_SpecProxy} spec
 * @constructs Fl32_Teq_User_Back_Process_Referral_Link_Create.process
 * @memberOf Fl32_Teq_User_Back_Process_Referral_Link_Create
 */
function Factory(spec) {
    // PARSE INPUT & DEFINE WORKING VARS
    /** @type {TeqFw_Db_Back_Api_RDb_CrudEngine} */
    const crud = spec['TeqFw_Db_Back_Api_RDb_CrudEngine$'];
    /** @type {Fl32_Teq_User_Back_Process_Referral_Link_CleanUp.process|function} */
    const procCleanUp = spec['Fl32_Teq_User_Back_Process_Referral_Link_CleanUp$'];
    /** @type {Fl32_Teq_User_Back_Store_RDb_Schema_Ref_Link} */
    const metaRefLink = spec['Fl32_Teq_User_Back_Store_RDb_Schema_Ref_Link$'];

    // DEFINE WORKING VARS / PROPS
    /** @type {typeof Fl32_Teq_User_Back_Store_RDb_Schema_Ref_Link.ATTR} */
    const A_REF_LINK = metaRefLink.getAttributes();

    // DEFINE INNER FUNCTIONS
    /**
     * Process to generate referral link.
     * @param {TeqFw_Db_Back_RDb_ITrans} trx
     * @param {Number} userId
     * @returns {Promise<{link: string, dateExp: Date}>}
     * @memberOf Fl32_Teq_User_Back_Process_Referral_Link_Create
     */
    async function process({trx, userId}) {

        // DEFINE INNER FUNCTIONS
        async function createLink(trx, userId, dateExp) {
            // DEFINE INNER FUNCTIONS
            /**
             * Generate unique referral code.
             * @param {TeqFw_Db_Back_RDb_ITrans} trx
             * @returns {Promise<string>}
             */
            async function generateReferralCode(trx) {
                let code, dto;
                do {
                    code = $crypto.randomBytes(CODE_LENGTH).toString('hex').toLowerCase();
                    dto = await crud.readOne(trx, metaRefLink, {[A_REF_LINK.CODE]: code});
                } while (dto !== null);
                return code;
            }

            // MAIN FUNCTIONALITY
            const code = await generateReferralCode(trx);
            await crud.create(trx, metaRefLink, {
                [A_REF_LINK.USER_REF]: userId,
                [A_REF_LINK.CODE]: code,
                [A_REF_LINK.DATE_EXPIRED]: dateExp,
            });
            return code;
        }

        // MAIN FUNCTIONALITY
        await procCleanUp({trx});
        const dateExp = new Date();
        dateExp.setUTCDate(dateExp.getUTCDate() + LIFETIME_DAY);
        const link = await createLink(trx, userId, dateExp);
        // COMPOSE RESULT
        return {link, dateExp};
    }

    // MAIN FUNCTIONALITY
    Object.defineProperty(process, 'name', {value: `${NS}.${process.name}`});
    return process;
}

// MODULE'S EXPORT
Object.defineProperty(Factory, 'name', {value: `${NS}.${Factory.name}`});
export default Factory;
