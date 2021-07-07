/**
 * Hardcoded configuration for the module.
 */
export default class Fl32_Teq_User_Back_Defaults {
    BACK_REALM = 'user';
    BCRYPT_HASH_ROUNDS = 10;    // Number of salt rounds used in bcrypt hash.

    HTTP_SHARE_CTX_SESSION_ID = null; // bind in constructor
    HTTP_SHARE_CTX_USER = null; // bind in constructor

    /** @type {TeqFw_I18n_Back_Defaults} */
    MOD_I18N;
    /** @type {TeqFw_Http2_Back_Defaults} */
    MOD_HTTP2;

    MOD = {
        /** @type {TeqFw_Web_Back_Defaults} */
        WEB: null, // bind in constructor
    };

    SESSION_COOKIE_LIFETIME = 31536000000;  // 3600 * 24 * 365 * 1000
    SESSION_COOKIE_NAME = 'TEQ_SESSION_ID';
    SESSION_ID_BYTES = 20;  // Number of bytes for generated session ID.

    /** @type {TeqFw_Web_Shared_Defaults} */
    SHARED = null;

    constructor(spec) {
        this.SHARED = spec['Fl32_Teq_User_Shared_Defaults$'];
        this.MOD_I18N = spec['TeqFw_I18n_Back_Defaults$'];
        this.MOD_HTTP2 = spec['TeqFw_Http2_Back_Defaults$'];
        this.MOD.WEB = spec['TeqFw_Web_Back_Defaults$'];
        // init props after dependencies was injected
        this.HTTP_SHARE_CTX_SESSION_ID = `${this.SHARED.NAME}/sessionId`;  // Attribute of the HTTP request to share session ID.
        this.HTTP_SHARE_CTX_USER = `${this.SHARED.NAME}/data`; // Attribute of the HTTP request to share authenticated user data.


        Object.freeze(this);
    }
}
