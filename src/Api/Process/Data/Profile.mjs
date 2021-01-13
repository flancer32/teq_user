/**
 * User profile data for backend processes.
 * Some attributes are only to transfer data from back to front ('id', 'dateCreated', etc.).
 */
export default class Fl32_Teq_User_Api_Process_Data_Profile {
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
     * Identity emails.
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
     * Identity phone numbers.
     * @type {String[]}
     */
    phones
    /**
     * Referral codes.
     * @type {String[]}
     */
    refCode
}
