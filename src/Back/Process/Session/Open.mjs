import $crypto from 'crypto';

/**
 * Process to open new authentication session.
 */
export default class Fl32_Teq_User_Back_Process_Session_Open {

    constructor(spec) {
        /** @type {Fl32_Teq_User_Back_Defaults} */
        const DEF = spec['Fl32_Teq_User_Back_Defaults$'];    // singleton
        /** @type {typeof Fl32_Teq_User_Store_RDb_Schema_Auth_Session} */
        const EAuthSess = spec['Fl32_Teq_User_Store_RDb_Schema_Auth_Session#']; // class

        /**
         * We should use separate classes for data objects in input (not services) to reduce coupling
         * between services & processes.
         *
         * @param trx
         * @param {Number} userId
         * @returns {Promise<{output: *, error}>}
         */
        this.exec = async function ({trx, userId}) {
            // DEFINE INNER FUNCTIONS
            async function getSessionById(trx, sessId) {
                const query = trx.from(EAuthSess.ENTITY);
                query.select([EAuthSess.A_USER_REF]);
                query.where(EAuthSess.A_SESSION_ID, sessId);
                const rs = await query;
                return rs[0] !== undefined;
            }

            async function createSession(trx, userId, sessId) {
                await trx(EAuthSess.ENTITY).insert({
                    [EAuthSess.A_USER_REF]: userId,
                    [EAuthSess.A_SESSION_ID]: sessId,
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
