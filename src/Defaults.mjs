/**
 * Hardcoded configuration for the module.
 */
export default class Fl32_Teq_User_Defaults {
    BACK_REALM = 'user';
    BCRYPT_HASH_ROUNDS = 10;    // Number of salt rounds used in bcrypt hash.
    DI_SESSION = 'userSession'; // ID of the session singleton in DI-container.
    HTTP_SHARE_CTX_SESSION_ID = `${this.BACK_REALM}/sessionId`;  // Attribute of the HTTP request to store session ID.
    HTTP_SHARE_CTX_USER = `${this.BACK_REALM}/data`; // Attribute of the HTTP request to store authenticated user data.

    /** @type {TeqFw_Core_App_Defaults} */
    MOD_CORE;

    SERV_CHANGE_PASSWORD = '/changePassword';
    SERV_CHECK_EXISTENCE = '/check/existence';
    SERV_CURRENT = '/current';
    SERV_LIST = '/list';
    SERV_REF_LINK_CREATE = '/refLink/create';
    SERV_SIGN_IN = '/sign/in';
    SERV_SIGN_OUT = '/sign/out';
    SERV_SIGN_UP = '/sign/up';

    SESSION_COOKIE_LIFETIME = 31536000000;  // 3600 * 24 * 365 * 1000
    SESSION_COOKIE_NAME = 'TEQ_SESSION_ID';
    SESSION_ID_BYTES = 20;  // Number of bytes for generated session ID.

    constructor(spec) {
        /** @type {TeqFw_Core_App_Defaults} */
        this.MOD_CORE = spec['TeqFw_Core_App_Defaults$'];    // pin 'core' defaults
        Object.freeze(this);
    }
}
