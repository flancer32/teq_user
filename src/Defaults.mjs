/**
 * Hardcoded configuration for the module.
 */
export default class Fl32_Teq_User_Defaults {
    API_SIGN_IN = '/sign/in';
    BACK_REALM = 'user';
    BCRYPT_HASH_ROUNDS = 10;    // Number of salt rounds used in bcrypt hash.
    DI_SESSION = 'userSession'; // ID of the session singleton in DI-container.
    HTTP_SHARE_CTX_SESSION_ID = `${this.BACK_REALM}/sessionId`;  // Attribute of the HTTP request to store session ID.
    HTTP_SHARE_CTX_USER = `${this.BACK_REALM}/data`; // Attribute of the HTTP request to store authenticated user data.
    /** @type {TeqFw_Core_App_Defaults} */
    MOD_CORE;
    ROUTE_CHANGE_PASSWORD = '/changePassword';
    ROUTE_CHECK_EXISTENCE = '/check/existence';
    ROUTE_CURRENT = '/current';
    ROUTE_LIST = '/list';
    ROUTE_SIGN_OUT = '/signOut';
    ROUTE_SIGN_UP = '/signUp';
    SESSION_COOKIE_LIFETIME = 31536000000;  // 3600 * 24 * 365 * 1000
    SESSION_COOKIE_NAME = 'TEQ_SESSION_ID';
    SESSION_ID_BYTES = 20;  // Number of bytes for generated session ID.

    constructor(spec) {
        /** @type {TeqFw_Core_App_Defaults} */
        const DEF = spec['TeqFw_Core_App_Defaults$'];    // instance singleton
        this.MOD_CORE = DEF;    // pin 'core' defaults
        Object.freeze(this);
    }
}
