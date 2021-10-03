/**
 *  'user_auth_password' entity.
 */
class Fl32_Teq_User_Back_Store_RDb_Schema_Auth_Password {
    login;
    password_hash;
    user_ref;
}

// table name and columns names (entity and attributes) to use in queries to RDb
Fl32_Teq_User_Back_Store_RDb_Schema_Auth_Password.A_LOGIN = 'login';
Fl32_Teq_User_Back_Store_RDb_Schema_Auth_Password.A_PASSWORD_HASH = 'password_hash';
Fl32_Teq_User_Back_Store_RDb_Schema_Auth_Password.A_USER_REF = 'user_ref';
Fl32_Teq_User_Back_Store_RDb_Schema_Auth_Password.ENTITY = 'user_auth_password';

// freeze class to deny attributes changes
Object.freeze(Fl32_Teq_User_Back_Store_RDb_Schema_Auth_Password);

// MODULE'S EXPORT
export default Fl32_Teq_User_Back_Store_RDb_Schema_Auth_Password;
