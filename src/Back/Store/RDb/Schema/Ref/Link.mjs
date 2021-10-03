/**
 *  'user_ref_link' entity.
 */
class Fl32_Teq_User_Back_Store_RDb_Schema_Ref_Link {
    code;
    date_expired;
    user_ref;
}

// table name and columns names (entity and attributes) to use in queries to RDb
Fl32_Teq_User_Back_Store_RDb_Schema_Ref_Link.A_CODE = 'code';
Fl32_Teq_User_Back_Store_RDb_Schema_Ref_Link.A_DATE_EXPIRED = 'date_expired';
Fl32_Teq_User_Back_Store_RDb_Schema_Ref_Link.A_USER_REF = 'user_ref';
Fl32_Teq_User_Back_Store_RDb_Schema_Ref_Link.ENTITY = 'user_ref_link';

// freeze class to deny attributes changes
Object.freeze(Fl32_Teq_User_Back_Store_RDb_Schema_Ref_Link);

// MODULE'S EXPORT
export default Fl32_Teq_User_Back_Store_RDb_Schema_Ref_Link;
