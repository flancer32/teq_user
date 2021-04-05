/**
 *  'user_profile' entity.
 */
class Fl32_Teq_User_Store_RDb_Schema_Profile {
    user_ref;
    name;
}

// table name and columns names (entity and attributes) to use in queries to RDb
Fl32_Teq_User_Store_RDb_Schema_Profile.A_NAME = 'name';
Fl32_Teq_User_Store_RDb_Schema_Profile.A_USER_REF = 'user_ref';
Fl32_Teq_User_Store_RDb_Schema_Profile.ENTITY = 'user_profile';

// freeze class to deny attributes changes
Object.freeze(Fl32_Teq_User_Store_RDb_Schema_Profile);

// MODULE'S EXPORT
export default Fl32_Teq_User_Store_RDb_Schema_Profile;
