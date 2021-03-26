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

// MODULE'S FUNCTIONS
/**
 * Factory to setup execution context and to create the processor.
 *
 * @param {TeqFw_Di_SpecProxy} spec
 * @constructs Fl32_Teq_User_Back_Process_Referral_Link_Create.process
 * @memberOf Fl32_Teq_User_Back_Process_Referral_Link_Create
 */
function Factory(spec) {
    // PARSE INPUT & DEFINE WORKING VARS
    /** @type {typeof Fl32_Teq_User_Store_RDb_Schema_Ref_Link} */
    const ERefLink = spec['Fl32_Teq_User_Store_RDb_Schema_Ref_Link#']; // class constructor
    /** @function {@type Fl32_Teq_User_Back_Process_Referral_Link_CleanUp.process} */
    const procCleanUp = spec['Fl32_Teq_User_Back_Process_Referral_Link_CleanUp$'];

    // DEFINE INNER FUNCTIONS
    /**
     * Process to generate referral link.
     * @param trx
     * @param {Number} userId
     * @returns {Promise<{link: string}>}
     * @memberOf Fl32_Teq_User_Back_Process_Referral_Link_Create
     */
    async function process({trx, userId}) {
        // DEFINE INNER FUNCTIONS
        async function createLink(trx, userId, dateExp) {
            // DEFINE INNER FUNCTIONS
            /**
             * @param trx
             * @returns {Promise<string>}
             */
            async function generateReferralCode(trx) {
                let code, rs;
                do {
                    code = $crypto.randomBytes(CODE_LENGTH).toString('hex').toLowerCase();
                    const query = trx.from(ERefLink.ENTITY);
                    rs = await query.select().where(ERefLink.A_CODE, code);
                } while (rs.length > 0);
                return code;
            }

            // MAIN FUNCTIONALITY
            const code = await generateReferralCode(trx);
            await trx(ERefLink.ENTITY)
                .insert({
                    [ERefLink.A_USER_REF]: userId,
                    [ERefLink.A_CODE]: code,
                    [ERefLink.A_DATE_EXPIRED]: dateExp,
                });
            // COMPOSE RESULT
            return code;
        }

        // MAIN FUNCTIONALITY
        await procCleanUp({trx});
        const dateExp = new Date();
        dateExp.setUTCDate(dateExp.getUTCDate() + 1);
        const link = await createLink(trx, userId, dateExp);
        // COMPOSE RESULT
        return {link, dateExp};
    }

    // MAIN FUNCTIONALITY

    // COMPOSE RESULT
    Object.defineProperty(process, 'name', {value: `${NS}.${process.name}`});
    return process;
}

// MODULE'S EXPORT
Object.defineProperty(Factory, 'name', {value: `${NS}.${Factory.name}`});
export default Factory;
