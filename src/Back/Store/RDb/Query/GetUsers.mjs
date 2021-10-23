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
    /** @type {typeof Fl32_Teq_User_Back_Store_RDb_Schema_Auth_Password} */
    const EAuthPass = spec['Fl32_Teq_User_Back_Store_RDb_Schema_Auth_Password#'];
    /** @type {typeof Fl32_Teq_User_Back_Store_RDb_Schema_Profile} */
    const EProfile = spec['Fl32_Teq_User_Back_Store_RDb_Schema_Profile#'];
    /** @type {typeof Fl32_Teq_User_Back_Store_RDb_Schema_Ref_Tree} */
    const ERefTree = spec['Fl32_Teq_User_Back_Store_RDb_Schema_Ref_Tree#'];
    /** @type {TeqFw_User_Back_Store_RDb_Schema_User} */
    const metaUser = spec['TeqFw_User_Back_Store_RDb_Schema_User$'];

    // DEFINE WORKING VARS / PROPS
    /** @type {typeof TeqFw_User_Back_Store_RDb_Schema_User.ATTR} */
    const A_USER = metaUser.getAttributes();

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

        const T_USER = trx.getTableName(metaUser);


        // MAIN FUNCTIONALITY
        // select from user
        const query = trx.getQuery({[USER]: T_USER});
        query.select([
            {[User.ID]: `${USER}.${A_USER.ID}`},
            {[User.DATE_CREATED]: `${USER}.${A_USER.DATE_CREATED}`},
        ]);
        query.leftOuterJoin(
            {[PROF]: EProfile.ENTITY},
            `${PROF}.${EProfile.A_USER_REF}`,
            `${USER}.${A_USER.ID}`);
        query.select([{[User.NAME]: `${PROF}.${EProfile.A_NAME}`}]);
        query.leftOuterJoin(
            {[PASS]: EAuthPass.ENTITY},
            `${PASS}.${EAuthPass.A_USER_REF}`,
            `${USER}.${A_USER.ID}`);
        query.select([{[User.LOGIN]: `${PASS}.${EAuthPass.A_LOGIN}`}]);
        query.leftOuterJoin(
            {[TREE]: ERefTree.ENTITY},
            `${TREE}.${ERefTree.A_USER_REF}`,
            `${USER}.${A_USER.ID}`);
        query.select([{[User.PARENT_ID]: `${TREE}.${ERefTree.A_PARENT_REF}`}]);

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
