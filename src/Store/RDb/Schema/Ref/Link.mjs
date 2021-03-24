/**
 *  'user_ref_link' entity attributes (table and columns names)
 */
class Fl32_Teq_User_Store_RDb_Schema_Ref_Link {
    // table name and columns names (entity and attributes)
    static A_CODE = 'code'
    static A_DATE_EXPIRED = 'date_expired'
    static A_USER_REF = 'user_ref'
    static ENTITY = 'user_ref_link'

    // data object props to represent table row
    code;
    date_expired;
    user_ref;
}

// freeze class to deny attributes changes
Object.freeze(Fl32_Teq_User_Store_RDb_Schema_Ref_Link);

export default Fl32_Teq_User_Store_RDb_Schema_Ref_Link;
