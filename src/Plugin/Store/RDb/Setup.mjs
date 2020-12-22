export default class Fl32_Teq_User_Plugin_Store_RDb_Setup {
    constructor(spec) {
        /** @type {TeqFw_Core_App_Util_Store_RDb_NameForForeignKey} */
        const utilFKName = spec['TeqFw_Core_App_Util_Store_RDb#NameForForeignKey'];
        /** @type {TeqFw_Core_App_Util_Store_RDb_NameForUniqueKey} */
        const utilUKName = spec['TeqFw_Core_App_Util_Store_RDb#NameForUniqueKey'];
        /** @type {Fl32_Teq_User_Store_RDb_Schema_Auth_Password} */
        const eAuthPassword = spec.Fl32_Teq_User_Store_RDb_Schema_Auth_Password$;
        /** @type {Fl32_Teq_User_Store_RDb_Schema_Auth_Session} */
        const eAuthSession = spec.Fl32_Teq_User_Store_RDb_Schema_Auth_Session$;
        /** @type {Fl32_Teq_User_Store_RDb_Schema_Id_Email} */
        const eIdEmail = spec.Fl32_Teq_User_Store_RDb_Schema_Id_Email$;
        /** @type {Fl32_Teq_User_Store_RDb_Schema_Id_Phone} */
        const eIdPhone = spec.Fl32_Teq_User_Store_RDb_Schema_Id_Phone$;
        /** @type {Fl32_Teq_User_Store_RDb_Schema_Profile} */
        const eProfile = spec.Fl32_Teq_User_Store_RDb_Schema_Profile$;
        /** @type {Fl32_Teq_User_Store_RDb_Schema_Ref_Link} */
        const eRefLink = spec.Fl32_Teq_User_Store_RDb_Schema_Ref_Link$;
        /** @type {Fl32_Teq_User_Store_RDb_Schema_Ref_Tree} */
        const eRefTree = spec.Fl32_Teq_User_Store_RDb_Schema_Ref_Tree$;
        /** @type {Fl32_Teq_User_Store_RDb_Schema_User} */
        const eUser = spec.Fl32_Teq_User_Store_RDb_Schema_User$;


        this.upgradeData = async function (knex, trx) {
            // DEFINE INNER FUNCTIONS
            async function insertTestUsers(trx) {
                await trx(eUser.ENTITY).insert({[eUser.A_ID]: 1});
                await trx(eProfile.ENTITY).insert({
                    [eProfile.A_USER_REF]: 1,
                    [eProfile.A_NAME]: 'User Test',
                });
                await trx(eAuthPassword.ENTITY).insert({
                    [eAuthPassword.A_USER_REF]: 1,
                    [eAuthPassword.A_LOGIN]: 'user',
                    [eAuthPassword.A_PASSWORD]: 'test',
                });
                await trx(eIdEmail.ENTITY).insert({
                    [eIdEmail.A_EMAIL]: 'user@test.com',
                    [eIdEmail.A_USER_REF]: 1,
                });
                await trx(eIdPhone.ENTITY).insert({
                    [eIdPhone.A_PHONE]: '(371)29181801',
                    [eIdPhone.A_USER_REF]: 1,
                });
                await trx(eRefLink.ENTITY).insert({
                    [eRefLink.A_USER_REF]: 1,
                    [eRefLink.A_CODE]: 'addMeHere',
                });
                await trx(eRefTree.ENTITY).insert({
                    [eRefTree.A_USER_REF]: 1,
                    [eRefTree.A_PARENT_REF]: 1,
                });
            }

            // MAIN FUNCTIONALITY
            // compose queries to drop existing tables
            await insertTestUsers(trx);
        }

        /**
         * Upgrade database structure (drop/create tables).
         *
         * @param knex
         * @param {SchemaBuilder} schema
         * @return {Promise<void>}
         */
        this.upgradeStructure = async function (knex, schema) {

            // DEFINE INNER FUNCTIONS
            function createTblAuthPassword(schema, knex) {
                schema.createTable(eAuthPassword.ENTITY, (table) => {
                    table.string(eAuthPassword.A_LOGIN).notNullable().primary()
                        .comment('Login name as user identity.');
                    table.integer(eAuthPassword.A_USER_REF).unsigned().notNullable();
                    table.string(eAuthPassword.A_PASSWORD).notNullable()
                        .comment('Password to authenticate user.');
                    table.unique(eAuthPassword.A_USER_REF, utilUKName(eAuthPassword.ENTITY, eAuthPassword.A_USER_REF));
                    table.foreign(eAuthPassword.A_USER_REF).references(eUser.A_ID).inTable(eUser.ENTITY)
                        .onDelete('CASCADE').onUpdate('CASCADE')
                        .withKeyName(utilFKName(eAuthPassword.ENTITY, eAuthPassword.A_USER_REF, eUser.ENTITY, eUser.A_ID));
                    table.comment('Authentication by password.');
                });
            }

            function createTblAuthSession(schema, knex) {
                schema.createTable(eAuthSession.ENTITY, (table) => {
                    table.string(eAuthSession.A_SESSION_ID).notNullable().primary()
                        .comment('Unique ID for user session.');
                    table.integer(eAuthSession.A_USER_REF).unsigned().notNullable();
                    table.foreign(eAuthSession.A_USER_REF).references(eUser.A_ID).inTable(eUser.ENTITY)
                        .onDelete('CASCADE').onUpdate('CASCADE')
                        .withKeyName(utilFKName(eAuthSession.ENTITY, eAuthSession.A_USER_REF, eUser.ENTITY, eUser.A_ID));
                    table.comment('Authentication by password.');
                });
            }

            function createTblIdEmail(schema, knex) {
                schema.createTable(eIdEmail.ENTITY, (table) => {
                    table.string(eIdEmail.A_EMAIL).notNullable().primary()
                        .comment('Email.');
                    table.integer(eIdEmail.A_USER_REF).unsigned().notNullable();
                    table.foreign(eIdEmail.A_USER_REF).references(eUser.A_ID).inTable(eUser.ENTITY)
                        .onDelete('CASCADE').onUpdate('CASCADE')
                        .withKeyName(utilFKName(eIdEmail.ENTITY, eIdEmail.A_USER_REF, eUser.ENTITY, eUser.A_ID));
                    table.comment('Emails as identifiers for users.');
                });
            }

            function createTblIdPhone(schema, knex) {
                schema.createTable(eIdPhone.ENTITY, (table) => {
                    table.string(eIdPhone.A_PHONE).notNullable().primary()
                        .comment('Phone number.');
                    table.integer(eIdPhone.A_USER_REF).unsigned().notNullable();
                    table.foreign(eIdPhone.A_USER_REF).references(eUser.A_ID).inTable(eUser.ENTITY)
                        .onDelete('CASCADE').onUpdate('CASCADE')
                        .withKeyName(utilFKName(eIdPhone.ENTITY, eIdPhone.A_USER_REF, eUser.ENTITY, eUser.A_ID));
                    table.comment('Emails as identifiers for users.');
                });
            }

            function createTblProfile(schema, knex) {
                schema.createTable(eProfile.ENTITY, (table) => {
                    table.integer(eProfile.A_USER_REF).unsigned().notNullable().primary();
                    table.string(eProfile.A_NAME).notNullable()
                        .comment('Phone number.');
                    table.foreign(eProfile.A_USER_REF).references(eUser.A_ID).inTable(eUser.ENTITY)
                        .onDelete('CASCADE').onUpdate('CASCADE')
                        .withKeyName(utilFKName(eProfile.ENTITY, eProfile.A_USER_REF, eUser.ENTITY, eUser.A_ID));
                    table.comment('Emails as identifiers for users.');
                });
            }

            function createTblRefLink(schema, knex) {
                schema.createTable(eRefLink.ENTITY, (table) => {
                    table.string(eRefLink.A_CODE).notNullable().primary()
                        .comment('Referral link code.');
                    table.integer(eRefLink.A_USER_REF).unsigned().notNullable();
                    table.foreign(eRefLink.A_USER_REF).references(eUser.A_ID).inTable(eUser.ENTITY)
                        .onDelete('CASCADE').onUpdate('CASCADE')
                        .withKeyName(utilFKName(eRefLink.ENTITY, eRefLink.A_USER_REF, eUser.ENTITY, eUser.A_ID));
                    table.comment('Referral links to registration.');
                });
            }

            function createTblRefTree(schema, knex) {
                schema.createTable(eRefTree.ENTITY, (table) => {
                    table.integer(eRefTree.A_USER_REF).unsigned().notNullable();
                    table.integer(eRefTree.A_PARENT_REF).unsigned().notNullable();
                    table.primary([eRefTree.A_USER_REF, eRefTree.A_PARENT_REF]);
                    table.foreign(eRefTree.A_USER_REF).references(eUser.A_ID).inTable(eUser.ENTITY)
                        .onDelete('CASCADE').onUpdate('CASCADE')
                        .withKeyName(utilFKName(eRefTree.ENTITY, eRefTree.A_USER_REF, eUser.ENTITY, eUser.A_ID));
                    table.foreign(eRefTree.A_PARENT_REF).references(eRefTree.A_USER_REF).inTable(eRefTree.ENTITY)
                        .onDelete('CASCADE').onUpdate('CASCADE')
                        .withKeyName(utilFKName(
                            eRefTree.ENTITY, eRefTree.A_USER_REF, eRefTree.ENTITY, eRefTree.A_USER_REF
                        ));
                    table.comment('Referrals tree.');
                });
            }

            function createTblUser(schema, knex) {
                schema.createTable(eUser.ENTITY, (table) => {
                    table.increments(eUser.A_ID);
                    table.dateTime(eUser.A_DATE_CREATED).notNullable().defaultTo(knex.fn.now())
                        .comment('Date-time for registration of the user.');
                    table.comment('User registry.');
                });
            }

            function dropTables(schema) {
                /* drop related tables (foreign keys) */
                schema.dropTableIfExists(eAuthPassword.ENTITY);
                schema.dropTableIfExists(eAuthSession.ENTITY);
                schema.dropTableIfExists(eIdEmail.ENTITY);
                schema.dropTableIfExists(eIdPhone.ENTITY);
                schema.dropTableIfExists(eRefLink.ENTITY);
                schema.dropTableIfExists(eRefTree.ENTITY);
                schema.dropTableIfExists(eProfile.ENTITY);

                /* drop registries */
                schema.dropTableIfExists(eUser.ENTITY);
            }

            // MAIN FUNCTIONALITY
            // compose queries to drop existing tables
            dropTables(schema);
            // compose queries to create main tables (registries)
            createTblUser(schema, knex);
            // compose queries to create additional tables (relations and details)
            createTblAuthPassword(schema, knex);
            createTblAuthSession(schema, knex);
            createTblIdEmail(schema, knex);
            createTblIdPhone(schema, knex);
            createTblProfile(schema, knex);
            createTblRefLink(schema, knex);
            createTblRefTree(schema, knex);
        }
    }
}