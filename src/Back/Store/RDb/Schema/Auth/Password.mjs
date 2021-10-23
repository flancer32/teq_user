/**
 *  Meta data for '/user/auth/password' entity.
 *  @namespace Fl32_Teq_User_Back_Store_RDb_Schema_Auth_Password
 */
// MODULE'S VARS
const NS = 'Fl32_Teq_User_Back_Store_RDb_Schema_Auth_Password';
/**
 * Path to the entity in plugin's DEM.
 * @type {string}
 */
const ENTITY = '/user/auth/password';

/**
 * @memberOf Fl32_Teq_User_Back_Store_RDb_Schema_Auth_Password
 * @type {Object}
 */
const ATTR = {
    LOGIN: 'login',
    PASSWORD_HASH: 'password_hash',
    USER_REF: 'user_ref'
};

// MODULE'S CLASSES
/**
 * @memberOf Fl32_Teq_User_Back_Store_RDb_Schema_Auth_Password
 */
class Dto {
    static name = `${NS}.Dto`;
    login;
    password_hash;
    user_ref;
}

// noinspection JSClosureCompilerSyntax
/**
 * @implements TeqFw_Db_Back_RDb_Meta_IEntity
 */
export default class Fl32_Teq_User_Back_Store_RDb_Schema_Auth_Password {
    constructor(spec) {
        /** @type {Fl32_Teq_User_Back_Defaults} */
        const DEF = spec['Fl32_Teq_User_Back_Defaults$'];
        /** @type {TeqFw_Db_Back_RDb_Schema_EntityBase} */
        const base = spec['TeqFw_Db_Back_RDb_Schema_EntityBase$'];

        return base.create(this,
            `${DEF.SHARED.NAME}${ENTITY}`,
            ATTR,
            [ATTR.LOGIN],
            Dto
        );
    }
}

// finalize code components for this es6-module
Object.freeze(ATTR);
