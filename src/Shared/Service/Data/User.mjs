/**
 * User data in services API.
 */
export default class Fl32_Teq_User_Shared_Service_Data_User {
    // attributes names to use in queries to RDb
    static A_DATE_CREATED = 'dateCreated';
    static A_DATE_LOGGED_IN = 'dateLoggedIn';
    static A_EMAIL = 'email';
    static A_ID = 'id';
    static A_LOGIN = 'login';
    static A_NAME = 'name';
    static A_PARENT_ID = 'parentId';
    static A_PHONE = 'phone';
    static A_REF_CODE = 'refCode';

    /** @type {Date} */
    dateCreated
    /** @type {Date} */
    dateLoggedIn
    /**
     * Identity email or emails.
     * @type {String|String[]}
     */
    email
    /**
     * Internal id. Can be omitted for new users (not saved yet).
     * @type {Number}
     */
    id
    /** @type {String} */
    login
    /** @type {String} */
    name
    /**
     * Internal id for parent user. Can be omitted for new users (not saved yet).
     * @type {Number}
     */
    parentId
    /**
     * Identity phone number or numbers.
     * @type {String|String[]}
     */
    phone
    /**
     * Referral code or codes.
     * @type {String|String[]}
     */
    refCode
}
