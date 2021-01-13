/**
 * Process to update user profile.
 */
export default class Fl32_Teq_User_Back_Process_Profile_Save {

    constructor(spec) {
        /** @type {Fl32_Teq_User_Store_RDb_Schema_Id_Email} */
        const eIdEmail = spec.Fl32_Teq_User_Store_RDb_Schema_Id_Email$;         // singleton instance
        /** @type {Fl32_Teq_User_Store_RDb_Schema_Id_Phone} */
        const eIdPhone = spec.Fl32_Teq_User_Store_RDb_Schema_Id_Phone$;         // singleton instance
        /** @type {Fl32_Teq_User_Store_RDb_Schema_Profile} */
        const eProfile = spec.Fl32_Teq_User_Store_RDb_Schema_Profile$;          // singleton instance


        /**
         * We should use separate classes for data objects in input (not services) to reduce coupling
         * between services & processes.
         *
         * @param trx
         * @param {Fl32_Teq_User_Api_Process_Data_Profile} input
         * @return {Promise<{output: *, error}>}
         */
        this.exec = async function ({trx, input}) {
            // DEFINE INNER FUNCTIONS

            async function updateEmails(trx, userId, emails) {
                // select current entries (<=1)
                const rs = await trx.from(eIdEmail.ENTITY)
                    .select([eIdEmail.A_EMAIL])
                    .where(eIdEmail.A_USER_REF, userId);
                // we have one only entry for now
                let [newValue] = emails;
                newValue = newValue.toLowerCase().trim();
                if (rs[0] && rs[0][eIdEmail.A_EMAIL] === newValue) {
                    // current email is equal to new value; do nothing
                } else if (rs[0] && rs[0][eIdEmail.A_EMAIL]) {
                    // there is value an it is not equal to new value; update it
                    const query = trx(eIdEmail.ENTITY)
                        .update({
                            [eIdEmail.A_EMAIL]: newValue,
                        })
                        .where({[eIdEmail.A_USER_REF]: userId});
                    await query;
                } else {
                    // insert new value
                    const query = trx(eIdEmail.ENTITY)
                        .insert({
                            [eIdEmail.A_USER_REF]: userId,
                            [eIdEmail.A_EMAIL]: newValue,
                        });
                    await query;
                }
            }

            async function updatePhones(trx, userId, phones) {
                // select current entries (<=1)
                const rs = await trx.from(eIdPhone.ENTITY)
                    .select([eIdPhone.A_PHONE])
                    .where(eIdPhone.A_USER_REF, userId);
                // we have one only entry for now
                let [newValue] = phones;
                newValue = newValue.toLowerCase().trim();
                if (rs[0] && rs[0][eIdPhone.A_PHONE] === newValue) {
                    // current value is equal to the new value; do nothing
                } else if (rs[0] && rs[0][eIdPhone.A_PHONE]) {
                    // there is value an it is not equal to new value; update it
                    const query = trx(eIdPhone.ENTITY)
                        .update({
                            [eIdPhone.A_PHONE]: newValue,
                        })
                        .where({[eIdPhone.A_USER_REF]: userId});
                    await query;
                } else {
                    // insert new value
                    const query = trx(eIdPhone.ENTITY)
                        .insert({
                            [eIdPhone.A_USER_REF]: userId,
                            [eIdPhone.A_PHONE]: newValue,
                        });
                    await query;
                }
            }

            async function updateProfile(trx, userId, name) {
                const query = trx(eProfile.ENTITY)
                    .update({[eProfile.A_NAME]: name})
                    .where(eProfile.A_USER_REF, userId);
                await query;
            }

            // MAIN FUNCTIONALITY
            // register user
            await updateProfile(trx, input.id, input.name);
            await updateEmails(trx, input.id, input.emails);
            await updatePhones(trx, input.id, input.phones);
            // I don't know what I should return here
            return {output: {}, error: {}};
        };

    }

}
