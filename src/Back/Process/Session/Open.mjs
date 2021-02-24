import $crypto from 'crypto';

/**
 * Process to open new authentication session.
 */
export default class Fl32_Teq_User_Back_Process_Session_Open {

    constructor(spec) {
        /** @type {Fl32_Teq_User_Defaults} */
        const DEF = spec['Fl32_Teq_User_Defaults$'];    // instance singleton
        /** @type {Fl32_Teq_User_Store_RDb_Schema_Auth_Session} */
        const eAuthSess = spec['Fl32_Teq_User_Store_RDb_Schema_Auth_Session$'];   // instance singleton

        /**
         * We should use separate classes for data objects in input (not services) to reduce coupling
         * between services & processes.
         *
         * @param trx
         * @param {Fl32_Teq_User_Api_Process_Data_Profile} input
         * @returns {Promise<{output: *, error}>}
         */
        this.exec = async function ({trx, userId}) {
            // DEFINE INNER FUNCTIONS
            async function getSessionById(trx, sessId) {
                const query = trx.from(eAuthSess.ENTITY);
                query.select([eAuthSess.A_USER_REF]);
                query.where(eAuthSess.A_SESSION_ID, sessId);
                const rs = await query;
                return rs[0] !== undefined;
            }

            async function createSession(trx, userId, sessId) {
                await trx(eAuthSess.ENTITY).insert({
                    [eAuthSess.A_USER_REF]: userId,
                    [eAuthSess.A_SESSION_ID]: sessId,
                });
            }

            // MAIN FUNCTIONALITY
            // register user
            let sessionId = $crypto.randomBytes(DEF.SESSION_ID_BYTES).toString('hex');
            let found = true;
            do {
                found = await getSessionById(trx, sessionId);
            } while (found);
            await createSession(trx, userId, sessionId);

            // COMPOSE RESULT
            return {output: {sessId: sessionId}, error: {}};
        };

    }

}
