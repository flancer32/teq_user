/**
 * Query to get users data.
 *
 * @namespace Fl32_Teq_User_Back_Store_RDb_Query_GetUsers
 */
// MODULE'S VARS
const NS = 'Fl32_Teq_User_Back_Store_RDb_Query_GetUsers';

/**
 * Factory to create builder to get queries.
 *
 * @memberOf Fl32_Teq_User_Back_Store_RDb_Query_GetUsers
 * @returns {function(*): *}
 */
function Factory(spec) {
    /** @type {typeof Fl32_Teq_User_Shared_Service_Dto_User} */
    const User = spec['Fl32_Teq_User_Shared_Service_Dto_User#'];
    /** @type {TeqFw_User_Back_Store_RDb_Schema_User} */
    const metaUser = spec['TeqFw_User_Back_Store_RDb_Schema_User$'];
    /** @type {Fl32_Teq_User_Back_Store_RDb_Schema_Profile} */
    const metaProfile = spec['Fl32_Teq_User_Back_Store_RDb_Schema_Profile$'];
    /** @type {Fl32_Teq_User_Back_Store_RDb_Schema_Auth_Password} */
    const metaAuthPass = spec['Fl32_Teq_User_Back_Store_RDb_Schema_Auth_Password$'];
    /** @type {Fl32_Teq_User_Back_Store_RDb_Schema_Ref_Tree} */
    const metaRefTree = spec['Fl32_Teq_User_Back_Store_RDb_Schema_Ref_Tree$'];


    // DEFINE WORKING VARS / PROPS
    /** @type {typeof TeqFw_User_Back_Store_RDb_Schema_User.ATTR} */
    const A_USER = metaUser.getAttributes();
    /** @type {typeof Fl32_Teq_User_Back_Store_RDb_Schema_Profile.ATTR} */
    const A_PROFILE = metaProfile.getAttributes();
    /** @type {typeof Fl32_Teq_User_Back_Store_RDb_Schema_Auth_Password.ATTR} */
    const A_AUTH_PASS = metaAuthPass.getAttributes();
    /** @type {typeof Fl32_Teq_User_Back_Store_RDb_Schema_Ref_Tree.ATTR} */
    const A_REF_TREE = metaRefTree.getAttributes();

    // DEFINE INNER FUNCTIONS
    /**
     * @param {TeqFw_Db_Back_RDb_ITrans} trx
     * @returns {*}
     * @memberOf Fl32_Teq_User_Back_Store_RDb_Query_GetUsers
     */
    function queryBuilder(trx) {
        // DEFINE WORKING VARS / PROPS
        const PASS = 'ap';
        const PROF = 'p';
        const TREE = 't';
        const USER = 'u';

        const T_AUTH_PASS = trx.getTableName(metaAuthPass);
        const T_PROFILE = trx.getTableName(metaProfile);
        const T_REF_TREE = trx.getTableName(metaRefTree);
        const T_USER = trx.getTableName(metaUser);


        // MAIN FUNCTIONALITY
        // select from user
        const query = trx.getQuery({[USER]: T_USER});
        query.select([
            {[User.ID]: `${USER}.${A_USER.ID}`},
            {[User.DATE_CREATED]: `${USER}.${A_USER.DATE_CREATED}`},
        ]);
        query.leftOuterJoin(
            {[PROF]: T_PROFILE},
            `${PROF}.${A_PROFILE.USER_REF}`,
            `${USER}.${A_USER.ID}`);
        query.select([{[User.NAME]: `${PROF}.${A_PROFILE.NAME}`}]);
        query.leftOuterJoin(
            {[PASS]: T_AUTH_PASS},
            `${PASS}.${A_AUTH_PASS.USER_REF}`,
            `${USER}.${A_USER.ID}`);
        query.select([{[User.LOGIN]: `${PASS}.${A_AUTH_PASS.LOGIN}`}]);
        query.leftOuterJoin(
            {[TREE]: T_REF_TREE},
            `${TREE}.${A_REF_TREE.USER_REF}`,
            `${USER}.${A_USER.ID}`);
        query.select([{[User.PARENT_ID]: `${TREE}.${A_REF_TREE.PARENT_REF}`}]);

        return query;
    }

    // MAIN FUNCTIONALITY
    Object.defineProperty(queryBuilder, 'name', {value: `${NS}.${queryBuilder.name}`});

    // COMPOSE RESULT
    return queryBuilder;
}

// MODULE'S FUNCTIONALITY
Object.defineProperty(Factory, 'name', {value: `${NS}.${Factory.name}`});

// MODULE'S EXPORT
export default Factory;
