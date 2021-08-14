export default class Fl32_Teq_User_Plugin_Store_RDb_Setup {
    constructor(spec) {
        /** @function {@type TeqFw_Db_Back_Util.nameFK} */
        const nameFK = spec['TeqFw_Db_Back_Util#nameFK'];
        /** @function {@type TeqFw_Db_Back_Util.nameUQ} */
        const nameUQ = spec['TeqFw_Db_Back_Util#nameUQ'];
        /** @type {typeof Fl32_Teq_User_Store_RDb_Schema_Auth_Password} */
        const EAuthPassword = spec['Fl32_Teq_User_Store_RDb_Schema_Auth_Password#']; 
        /** @type {typeof Fl32_Teq_User_Store_RDb_Schema_Auth_Session} */
        const EAuthSession = spec['Fl32_Teq_User_Store_RDb_Schema_Auth_Session#']; 
        /** @type {typeof Fl32_Teq_User_Store_RDb_Schema_Id_Email} */
        const EIdEmail = spec['Fl32_Teq_User_Store_RDb_Schema_Id_Email#']; 
        /** @type {typeof Fl32_Teq_User_Store_RDb_Schema_Id_Phone} */
        const EIdPhone = spec['Fl32_Teq_User_Store_RDb_Schema_Id_Phone#']; 
        /** @type {typeof Fl32_Teq_User_Store_RDb_Schema_Profile} */
        const EProfile = spec['Fl32_Teq_User_Store_RDb_Schema_Profile#']; 
        /** @type {typeof Fl32_Teq_User_Store_RDb_Schema_Ref_Link} */
        const ERefLink = spec['Fl32_Teq_User_Store_RDb_Schema_Ref_Link#']; 
        /** @type {typeof Fl32_Teq_User_Store_RDb_Schema_Ref_Tree} */
        const ERefTree = spec['Fl32_Teq_User_Store_RDb_Schema_Ref_Tree#']; 
        /** @type {typeof Fl32_Teq_User_Store_RDb_Schema_User} */
        const EUser = spec['Fl32_Teq_User_Store_RDb_Schema_User#']; 

        /**
         * TODO: tables drop should be ordered according to relations between tables (DEM).
         * For the moment I use levels for drop: N, ..., 2, 1, 0.
         *
         * @param schema
         */
        this.dropTables0 = function (schema) {
            schema.dropTableIfExists(EUser.ENTITY);
        };
        this.dropTables1 = function (schema) {
            /* drop related tables (foreign keys) */
            schema.dropTableIfExists(EAuthPassword.ENTITY);
            schema.dropTableIfExists(EAuthSession.ENTITY);
            schema.dropTableIfExists(EIdEmail.ENTITY);
            schema.dropTableIfExists(EIdPhone.ENTITY);
            schema.dropTableIfExists(ERefLink.ENTITY);
            schema.dropTableIfExists(ERefTree.ENTITY);
            schema.dropTableIfExists(EProfile.ENTITY);
        };

        /**
         * Upgrade database structure (drop/create tables).
         *
         * @param knex
         * @param {SchemaBuilder} schema
         */
        this.createStructure = function (knex, schema) {

            // DEFINE INNER FUNCTIONS
            function createTblAuthPassword(schema, knex) {
                schema.createTable(EAuthPassword.ENTITY, (table) => {
                    table.string(EAuthPassword.A_LOGIN).notNullable().primary()
                        .comment('Login name as user identity.');
                    table.integer(EAuthPassword.A_USER_REF).unsigned().notNullable();
                    table.string(EAuthPassword.A_PASSWORD_HASH).notNullable()
                        .comment('Password\'s hash to authenticate user.');
                    table.unique(EAuthPassword.A_USER_REF, nameUQ(EAuthPassword.ENTITY, EAuthPassword.A_USER_REF));
                    table.foreign(EAuthPassword.A_USER_REF).references(EUser.A_ID).inTable(EUser.ENTITY)
                        .onDelete('CASCADE').onUpdate('CASCADE')
                        .withKeyName(nameFK(EAuthPassword.ENTITY, EAuthPassword.A_USER_REF, EUser.ENTITY, EUser.A_ID));
                    table.comment('Authentication by password.');
                });
            }

            function createTblAuthSession(schema, knex) {
                schema.createTable(EAuthSession.ENTITY, (table) => {
                    table.string(EAuthSession.A_SESSION_ID).notNullable().primary()
                        .comment('Unique ID for user session.');
                    table.integer(EAuthSession.A_USER_REF).unsigned().notNullable();
                    table.dateTime(EAuthSession.A_DATE_CREATED).notNullable().defaultTo(knex.fn.now())
                        .comment('Date-time for session registration.');
                    table.foreign(EAuthSession.A_USER_REF).references(EUser.A_ID).inTable(EUser.ENTITY)
                        .onDelete('CASCADE').onUpdate('CASCADE')
                        .withKeyName(nameFK(EAuthSession.ENTITY, EAuthSession.A_USER_REF, EUser.ENTITY, EUser.A_ID));
                    table.comment('Registry for opened sessions.');
                });
            }

            function createTblIdEmail(schema, knex) {
                schema.createTable(EIdEmail.ENTITY, (table) => {
                    table.string(EIdEmail.A_EMAIL).notNullable().primary()
                        .comment('Email.');
                    table.integer(EIdEmail.A_USER_REF).unsigned().notNullable();
                    table.foreign(EIdEmail.A_USER_REF).references(EUser.A_ID).inTable(EUser.ENTITY)
                        .onDelete('CASCADE').onUpdate('CASCADE')
                        .withKeyName(nameFK(EIdEmail.ENTITY, EIdEmail.A_USER_REF, EUser.ENTITY, EUser.A_ID));
                    table.comment('Emails as identifiers for users.');
                });
            }

            function createTblIdPhone(schema, knex) {
                schema.createTable(EIdPhone.ENTITY, (table) => {
                    table.string(EIdPhone.A_PHONE).notNullable().primary()
                        .comment('Phone number.');
                    table.integer(EIdPhone.A_USER_REF).unsigned().notNullable();
                    table.foreign(EIdPhone.A_USER_REF).references(EUser.A_ID).inTable(EUser.ENTITY)
                        .onDelete('CASCADE').onUpdate('CASCADE')
                        .withKeyName(nameFK(EIdPhone.ENTITY, EIdPhone.A_USER_REF, EUser.ENTITY, EUser.A_ID));
                    table.comment('Phones as identifiers for users.');
                });
            }

            function createTblProfile(schema, knex) {
                schema.createTable(EProfile.ENTITY, (table) => {
                    table.integer(EProfile.A_USER_REF).unsigned().notNullable().primary();
                    table.string(EProfile.A_NAME).notNullable()
                        .comment('Name to display in profile.');
                    table.foreign(EProfile.A_USER_REF).references(EUser.A_ID).inTable(EUser.ENTITY)
                        .onDelete('CASCADE').onUpdate('CASCADE')
                        .withKeyName(nameFK(EProfile.ENTITY, EProfile.A_USER_REF, EUser.ENTITY, EUser.A_ID));
                    table.comment('Personal information for users.');
                });
            }

            function createTblRefLink(schema, knex) {
                schema.createTable(ERefLink.ENTITY, (table) => {
                    table.string(ERefLink.A_CODE).notNullable().primary()
                        .comment('Referral link code.');
                    table.integer(ERefLink.A_USER_REF).unsigned().notNullable();
                    table.dateTime(ERefLink.A_DATE_EXPIRED).notNullable()
                        .comment('Date-time for referral code expiration.');
                    table.foreign(ERefLink.A_USER_REF).references(EUser.A_ID).inTable(EUser.ENTITY)
                        .onDelete('CASCADE').onUpdate('CASCADE')
                        .withKeyName(nameFK(ERefLink.ENTITY, ERefLink.A_USER_REF, EUser.ENTITY, EUser.A_ID));
                    table.comment('Referral links to registration.');
                });
            }

            function createTblRefTree(schema, knex) {
                schema.createTable(ERefTree.ENTITY, (table) => {
                    table.integer(ERefTree.A_USER_REF).unsigned().notNullable();
                    table.integer(ERefTree.A_PARENT_REF).unsigned().notNullable();
                    table.primary([ERefTree.A_USER_REF]);
                    table.foreign(ERefTree.A_USER_REF).references(EUser.A_ID).inTable(EUser.ENTITY)
                        .onDelete('CASCADE').onUpdate('CASCADE')
                        .withKeyName(nameFK(ERefTree.ENTITY, ERefTree.A_USER_REF, EUser.ENTITY, EUser.A_ID));
                    table.foreign(ERefTree.A_PARENT_REF).references(ERefTree.A_USER_REF).inTable(ERefTree.ENTITY)
                        .onDelete('CASCADE').onUpdate('CASCADE')
                        .withKeyName(nameFK(
                            ERefTree.ENTITY, ERefTree.A_USER_REF, ERefTree.ENTITY, ERefTree.A_USER_REF
                        ));
                    table.comment('Referrals tree.');
                });
            }

            function createTblUser(schema, knex) {
                schema.createTable(EUser.ENTITY, (table) => {
                    table.increments(EUser.A_ID);
                    table.dateTime(EUser.A_DATE_CREATED).notNullable().defaultTo(knex.fn.now())
                        .comment('Date-time for registration of the user.');
                    table.comment('User registry.');
                });
            }


            // MAIN FUNCTIONALITY
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
        };
    }
}
