/**
 *  'user_auth_password' entity attributes (table and columns names)
 */
export default class Fl32_Teq_User_Store_RDb_Schema_Auth_Password {

    A_LOGIN = 'login'
    A_PASSWORD_HASH = 'password_hash'
    A_USER_REF = 'user_ref'

    ENTITY = 'user_auth_password'

    constructor() {
        Object.freeze(this);
    }
}
