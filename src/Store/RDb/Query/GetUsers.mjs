/**
 * Query to get users data.
 *
 * @namespace Fl32_Teq_User_Store_RDb_Query_GetUsers
 */
// MODULE'S VARS
const NS = 'Fl32_Teq_User_Store_RDb_Query_GetUsers';

/**
 * Factory to create builder to get queries.
 *
 * @memberOf Fl32_Teq_User_Store_RDb_Query_GetUsers
 * @returns {function(*): *}
 */
function Factory(spec) {
    /** @type {typeof Fl32_Teq_User_Shared_Api_Data_User} */
    const User = spec['Fl32_Teq_User_Shared_Api_Data_User#']; // class
    /** @type {typeof Fl32_Teq_User_Store_RDb_Schema_Auth_Password} */
    const EAuthPass = spec['Fl32_Teq_User_Store_RDb_Schema_Auth_Password#']; // class
    /** @type {typeof Fl32_Teq_User_Store_RDb_Schema_Profile} */
    const EProfile = spec['Fl32_Teq_User_Store_RDb_Schema_Profile#']; // class
    /** @type {typeof Fl32_Teq_User_Store_RDb_Schema_Ref_Tree} */
    const ERefTree = spec['Fl32_Teq_User_Store_RDb_Schema_Ref_Tree#']; // class
    /** @type {typeof Fl32_Teq_User_Store_RDb_Schema_User} */
    const EUser = spec['Fl32_Teq_User_Store_RDb_Schema_User#']; // class

    // DEFINE INNER FUNCTIONS
    /**
     * @param trx
     * @returns {*}
     * @memberOf Fl32_Teq_User_Store_RDb_Query_GetUsers
     */
    function queryBuilder(trx) {

        const T_AP = 'ap';
        const T_P = 'p';
        const T_T = 't';
        const T_U = 'u';

        // select from user
        const query = trx.from({u: EUser.ENTITY});
        query.select([
            {[User.A_ID]: `${T_U}.${EUser.A_ID}`},
            {[User.A_DATE_CREATED]: `${T_U}.${EUser.A_DATE_CREATED}`},
        ]);
        query.leftOuterJoin(
            {[T_P]: EProfile.ENTITY},
            `${T_P}.${EProfile.A_USER_REF}`,
            `${T_U}.${EUser.A_ID}`);
        query.select([{[User.A_NAME]: `${T_P}.${EProfile.A_NAME}`}]);
        query.leftOuterJoin(
            {[T_AP]: EAuthPass.ENTITY},
            `${T_AP}.${EAuthPass.A_USER_REF}`,
            `${T_U}.${EUser.A_ID}`);
        query.select([{[User.A_LOGIN]: `${T_AP}.${EAuthPass.A_LOGIN}`}]);
        query.leftOuterJoin(
            {[T_T]: ERefTree.ENTITY},
            `${T_T}.${ERefTree.A_USER_REF}`,
            `${T_U}.${EUser.A_ID}`);
        query.select([{[User.A_PARENT_ID]: `${T_T}.${ERefTree.A_PARENT_REF}`}]);

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
