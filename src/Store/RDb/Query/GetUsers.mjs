/**
 * Factory to create queries to get user data.
 */
function Fl32_Teq_User_Store_RDb_Query_GetUsers_Factory(spec) {
    /** @type {typeof Fl32_Teq_User_Shared_Service_Data_User} */
    const User = spec['Fl32_Teq_User_Shared_Service_Data_User#']; // class constructor
    /** @type {Fl32_Teq_User_Store_RDb_Schema_Auth_Password} */
    const eAuthPass = spec.Fl32_Teq_User_Store_RDb_Schema_Auth_Password$;   // singleton object
    /** @type {Fl32_Teq_User_Store_RDb_Schema_Profile} */
    const eProfile = spec.Fl32_Teq_User_Store_RDb_Schema_Profile$;          // singleton object
    /** @type {Fl32_Teq_User_Store_RDb_Schema_Ref_Link} */
    const eRefLink = spec.Fl32_Teq_User_Store_RDb_Schema_Ref_Link$;         // singleton object
    /** @type {Fl32_Teq_User_Store_RDb_Schema_Ref_Tree} */
    const eRefTree = spec.Fl32_Teq_User_Store_RDb_Schema_Ref_Tree$;         // singleton object
    /** @type {Fl32_Teq_User_Store_RDb_Schema_User} */
    const eUser = spec.Fl32_Teq_User_Store_RDb_Schema_User$;                // singleton object

    /**
     * @param trx
     * @return {*}
     * @exports Fl32_Teq_User_Store_RDb_Query_GetUsers
     */
    function Fl32_Teq_User_Store_RDb_Query_GetUsers(trx) {
        const query = trx.from({u: eUser.ENTITY});
        query.select([
            {[User.A_ID]: `u.${eUser.A_ID}`},
            {[User.A_DATE_CREATED]: `u.${eUser.A_DATE_CREATED}`},
        ]);
        query.leftOuterJoin(
            {p: eProfile.ENTITY},
            `p.${eProfile.A_USER_REF}`,
            `u.${eUser.A_ID}`);
        query.select([{[User.A_NAME]: `p.${eProfile.A_NAME}`}]);
        query.leftOuterJoin(
            {a: eAuthPass.ENTITY},
            `a.${eAuthPass.A_USER_REF}`,
            `u.${eUser.A_ID}`);
        query.select([{[User.A_LOGIN]: `a.${eAuthPass.A_LOGIN}`}]);
        query.leftOuterJoin(
            {t: eRefTree.ENTITY},
            `t.${eRefTree.A_USER_REF}`,
            `u.${eUser.A_ID}`);
        query.select([{[User.A_PARENT_ID]: `t.${eRefTree.A_PARENT_REF}`}]);
        query.leftOuterJoin(
            {l: eRefLink.ENTITY},
            `l.${eRefLink.A_USER_REF}`,
            `u.${eUser.A_ID}`);
        query.select([{[User.A_REF_CODE]: `l.${eRefLink.A_CODE}`}]);
        return query;
    }

    return Fl32_Teq_User_Store_RDb_Query_GetUsers;
}

export default Fl32_Teq_User_Store_RDb_Query_GetUsers_Factory;
