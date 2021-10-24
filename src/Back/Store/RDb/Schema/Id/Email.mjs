/**
 *  Meta data for '/user/id/email' entity.
 *  @namespace Fl32_Teq_User_Back_Store_RDb_Schema_Id_Email
 */
// MODULE'S VARS
const NS = 'Fl32_Teq_User_Back_Store_RDb_Schema_Id_Email';
/**
 * Path to the entity in plugin's DEM.
 * @type {string}
 */
const ENTITY = '/user/id/email';

/**
 * @memberOf Fl32_Teq_User_Back_Store_RDb_Schema_Id_Email
 * @type {Object}
 */
const ATTR = {
    EMAIL: 'email',
    USER_REF: 'user_ref'
};

// MODULE'S CLASSES
/**
 * @memberOf Fl32_Teq_User_Back_Store_RDb_Schema_Id_Email
 */
class Dto {
    static name = `${NS}.Dto`;
    email;
    user_ref;
}

// noinspection JSClosureCompilerSyntax
/**
 * @implements TeqFw_Db_Back_RDb_Meta_IEntity
 */
export default class Fl32_Teq_User_Back_Store_RDb_Schema_Id_Email {
    constructor(spec) {
        /** @type {Fl32_Teq_User_Back_Defaults} */
        const DEF = spec['Fl32_Teq_User_Back_Defaults$'];
        /** @type {TeqFw_Db_Back_RDb_Schema_EntityBase} */
        const base = spec['TeqFw_Db_Back_RDb_Schema_EntityBase$'];

        return base.create(this,
            `${DEF.SHARED.NAME}${ENTITY}`,
            ATTR,
            [ATTR.EMAIL],
            Dto
        );
    }
}

// finalize code components for this es6-module
Object.freeze(ATTR);
