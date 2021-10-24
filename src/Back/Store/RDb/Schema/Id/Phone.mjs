/**
 *  Meta data for '/user/id/phone' entity.
 *  @namespace Fl32_Teq_User_Back_Store_RDb_Schema_Id_Phone
 */
// MODULE'S VARS
const NS = 'Fl32_Teq_User_Back_Store_RDb_Schema_Id_Phone';
/**
 * Path to the entity in plugin's DEM.
 * @type {string}
 */
const ENTITY = '/user/id/phone';

/**
 * @memberOf Fl32_Teq_User_Back_Store_RDb_Schema_Id_Phone
 * @type {Object}
 */
const ATTR = {
    PHONE: 'phone',
    USER_REF: 'user_ref'
};

// MODULE'S CLASSES
/**
 * @memberOf Fl32_Teq_User_Back_Store_RDb_Schema_Id_Phone
 */
class Dto {
    static name = `${NS}.Dto`;
    phone;
    user_ref;
}

// noinspection JSClosureCompilerSyntax
/**
 * @implements TeqFw_Db_Back_RDb_Meta_IEntity
 */
export default class Fl32_Teq_User_Back_Store_RDb_Schema_Id_Phone {
    constructor(spec) {
        /** @type {Fl32_Teq_User_Back_Defaults} */
        const DEF = spec['Fl32_Teq_User_Back_Defaults$'];
        /** @type {TeqFw_Db_Back_RDb_Schema_EntityBase} */
        const base = spec['TeqFw_Db_Back_RDb_Schema_EntityBase$'];

        return base.create(this,
            `${DEF.SHARED.NAME}${ENTITY}`,
            ATTR,
            [ATTR.PHONE],
            Dto
        );
    }
}

// finalize code components for this es6-module
Object.freeze(ATTR);
