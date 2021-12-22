import $crypto from 'crypto';

/**
 * Process to open new authentication session.
 */
export default class Fl32_Teq_User_Back_Process_Session_Open {

    constructor(spec) {
        /** @type {Fl32_Teq_User_Back_Defaults} */
        const DEF = spec['Fl32_Teq_User_Back_Defaults$'];
        /** @type {TeqFw_Db_Back_Api_RDb_ICrudEngine} */
        const crud = spec['TeqFw_Db_Back_Api_RDb_ICrudEngine$'];
        /** @type {Fl32_Teq_User_Back_Store_RDb_Schema_Auth_Session} */
        const metaSess = spec['Fl32_Teq_User_Back_Store_RDb_Schema_Auth_Session$'];

        // DEFINE WORKING VARS / PROPS
        /** @type {typeof Fl32_Teq_User_Back_Store_RDb_Schema_Auth_Session.ATTR} */
        const A_SESS = metaSess.getAttributes();

        /**
         * We should use separate classes for data objects in input (not services) to reduce coupling
         * between services & processes.
         *
         * @param {TeqFw_Db_Back_RDb_ITrans} trx
         * @param {number} userId
         * @returns {Promise<{output: *, error}>}
         */
        this.exec = async function ({trx, userId}) {
            // DEFINE INNER FUNCTIONS

            /**
             * @param {TeqFw_Db_Back_RDb_ITrans} trx
             * @return {Promise<string>}
             */
            async function generateSessId(trx) {
                const sessId = $crypto.randomBytes(DEF.SESSION_ID_BYTES).toString('hex');
                let found = true;
                do {
                    found = await crud.readOne(trx, metaSess, {[A_SESS.SESSION_ID]: sessId});
                } while (found !== null);
                return sessId;
            }

            // MAIN FUNCTIONALITY
            const sessId = await generateSessId(trx);
            // create session for the user
            await crud.create(trx, metaSess, {
                [A_SESS.USER_REF]: userId,
                [A_SESS.SESSION_ID]: sessId,
            });

            // COMPOSE RESULT
            return {output: {sessId}, error: {}};
        };

    }

}
