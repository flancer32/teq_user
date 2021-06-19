/**
 * Process to update user profile.
 * @deprecated used in Leana project only
 */
export default class Fl32_Teq_User_Back_Process_Profile_Save {

    constructor(spec) {
        /** @type {typeof Fl32_Teq_User_Store_RDb_Schema_Id_Email} */
        const EIdEmail = spec['Fl32_Teq_User_Store_RDb_Schema_Id_Email#']; // class
        /** @type {typeof Fl32_Teq_User_Store_RDb_Schema_Id_Phone} */
        const EIdPhone = spec['Fl32_Teq_User_Store_RDb_Schema_Id_Phone#']; // class
        /** @type {typeof Fl32_Teq_User_Store_RDb_Schema_Profile} */
        const EProfile = spec['Fl32_Teq_User_Store_RDb_Schema_Profile#']; // class

        /**
         * We should use separate classes for data objects in input (not services) to reduce coupling
         * between services & processes.
         *
         * @param trx
         * @param {Fl32_Teq_User_Shared_Dto_User} input
         * @returns {Promise<{output: *, error}>}
         */
        this.exec = async function ({trx, input}) {
            // DEFINE INNER FUNCTIONS

            async function updateEmails(trx, userId, values) {
                // we have one only entry for now
                let [newValue] = values;
                newValue = newValue.toLowerCase().trim();
                if (newValue.length === 0) {
                    // remove values
                    await trx.from(EIdEmail.ENTITY)
                        .where(EIdEmail.A_USER_REF, userId)
                        .del();
                } else {
                    // select current entries (<=1)
                    const rs = await trx.from(EIdEmail.ENTITY)
                        .select([EIdEmail.A_EMAIL])
                        .where(EIdEmail.A_USER_REF, userId);
                    if (rs.length) {
                        const [first] = rs;
                        const curValue = first[EIdEmail.A_EMAIL];
                        if (curValue !== newValue) {
                            // there is value an it is not equal to new value; update it
                            const query = trx(EIdEmail.ENTITY)
                                .update({
                                    [EIdEmail.A_EMAIL]: newValue,
                                })
                                .where({[EIdEmail.A_USER_REF]: userId});
                            await query;
                        }
                    } else {
                        // insert new value
                        const query = trx(EIdEmail.ENTITY)
                            .insert({
                                [EIdEmail.A_USER_REF]: userId,
                                [EIdEmail.A_EMAIL]: newValue,
                            });
                        await query;
                    }
                }
            }

            async function updatePhones(trx, userId, values) {
                // we have one only entry for now
                let [newValue] = values;
                newValue = newValue.toLowerCase().trim();
                if (newValue.length === 0) {
                    // remove values
                    await trx.from(EIdPhone.ENTITY)
                        .where(EIdPhone.A_USER_REF, userId)
                        .del();
                } else {
                    // select current entries (<=1)
                    const rs = await trx.from(EIdPhone.ENTITY)
                        .select([EIdPhone.A_PHONE])
                        .where(EIdPhone.A_USER_REF, userId);
                    if (rs.length) {
                        const [first] = rs;
                        const curValue = first[EIdPhone.A_PHONE];
                        if (curValue !== newValue) {
                            // there is value an it is not equal to new value; update it
                            const query = trx(EIdPhone.ENTITY)
                                .update({
                                    [EIdPhone.A_PHONE]: newValue,
                                })
                                .where({[EIdPhone.A_USER_REF]: userId});
                            await query;
                        }
                    } else {
                        // insert new value
                        const query = trx(EIdPhone.ENTITY)
                            .insert({
                                [EIdPhone.A_USER_REF]: userId,
                                [EIdPhone.A_PHONE]: newValue,
                            });
                        await query;
                    }
                }
            }

            async function updateProfile(trx, userId, name) {
                const query = trx(EProfile.ENTITY)
                    .update({[EProfile.A_NAME]: name})
                    .where(EProfile.A_USER_REF, userId);
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
