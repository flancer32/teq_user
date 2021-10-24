/**
 *  Meta data for '/user/auth/session' entity.
 *  @namespace Fl32_Teq_User_Back_Store_RDb_Schema_Auth_Session
 */
// MODULE'S VARS
const NS = 'Fl32_Teq_User_Back_Store_RDb_Schema_Auth_Session';
/**
 * Path to the entity in plugin's DEM.
 * @type {string}
 */
const ENTITY = '/user/auth/session';

/**
 * @memberOf Fl32_Teq_User_Back_Store_RDb_Schema_Auth_Session
 * @type {Object}
 */
const ATTR = {
    DATE_CREATED: 'date_created',
    SESSION_ID: 'session_id',
    USER_REF: 'user_ref'
};

// MODULE'S CLASSES
/**
 * @memberOf Fl32_Teq_User_Back_Store_RDb_Schema_Auth_Session
 */
class Dto {
    static name = `${NS}.Dto`;
    date_created;
    session_id;
    user_ref;
}

// noinspection JSClosureCompilerSyntax
/**
 * @implements TeqFw_Db_Back_RDb_Meta_IEntity
 */
export default class Fl32_Teq_User_Back_Store_RDb_Schema_Auth_Session {
    constructor(spec) {
        /** @type {Fl32_Teq_User_Back_Defaults} */
        const DEF = spec['Fl32_Teq_User_Back_Defaults$'];
        /** @type {TeqFw_Db_Back_RDb_Schema_EntityBase} */
        const base = spec['TeqFw_Db_Back_RDb_Schema_EntityBase$'];

        return base.create(this,
            `${DEF.SHARED.NAME}${ENTITY}`,
            ATTR,
            [ATTR.SESSION_ID],
            Dto
        );
    }
}

// finalize code components for this es6-module
Object.freeze(ATTR);
