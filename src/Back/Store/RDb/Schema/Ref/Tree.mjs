/**
 *  Meta data for '/user/ref/tree' entity.
 *  @namespace Fl32_Teq_User_Back_Store_RDb_Schema_Ref_Tree
 */
// MODULE'S VARS
const NS = 'Fl32_Teq_User_Back_Store_RDb_Schema_Ref_Tree';
/**
 * Path to the entity in plugin's DEM.
 * @type {string}
 */
const ENTITY = '/user/ref/tree';

/**
 * @memberOf Fl32_Teq_User_Back_Store_RDb_Schema_Ref_Tree
 * @type {Object}
 */
const ATTR = {
    PARENT_REF: 'parent_ref',
    USER_REF: 'user_ref'
};

// MODULE'S CLASSES
/**
 * @memberOf Fl32_Teq_User_Back_Store_RDb_Schema_Ref_Tree
 */
class Dto {
    static name = `${NS}.Dto`;
    parent_ref;
    user_ref;
}

// noinspection JSClosureCompilerSyntax
/**
 * @implements TeqFw_Db_Back_RDb_Meta_IEntity
 */
export default class Fl32_Teq_User_Back_Store_RDb_Schema_Ref_Tree {
    constructor(spec) {
        /** @type {Fl32_Teq_User_Back_Defaults} */
        const DEF = spec['Fl32_Teq_User_Back_Defaults$'];
        /** @type {TeqFw_Db_Back_RDb_Schema_EntityBase} */
        const base = spec['TeqFw_Db_Back_RDb_Schema_EntityBase$'];

        return base.create(this,
            `${DEF.SHARED.NAME}${ENTITY}`,
            ATTR,
            [ATTR.USER_REF],
            Dto
        );
    }
}

// finalize code components for this es6-module
Object.freeze(ATTR);
