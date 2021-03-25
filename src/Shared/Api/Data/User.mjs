/**
 * User data in services API.
 */
export default class Fl32_Teq_User_Shared_Api_Data_User {
    // attributes names to use in queries to RDb
    static A_DATE_CREATED = 'dateCreated';
    static A_DATE_LOGGED_IN = 'dateLoggedIn';
    static A_EMAILS = 'emails';
    static A_ID = 'id';
    static A_LOGIN = 'login';
    static A_NAME = 'name';
    static A_PARENT_ID = 'parentId';
    static A_PHONES = 'phones';
    static A_REF_CODE = 'refCode';

    /** @type {Date} */
    dateCreated
    /** @type {Date} */
    dateLoggedIn
    /**
     * Identity email or emails.
     * @type {String[]}
     */
    emails
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
    /** Name of the parent user. Can be omitted for new users (not saved yet).
     * @type {String}
     */
    parentName;
    /**
     * Identity phone number or numbers.
     * @type {String|String[]}
     */
    phones
    /**
     * Referral code or codes.
     * @type {String[]}
     */
    refCode
}
