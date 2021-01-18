/**
 * Hardcoded configuration for the module.
 */
export default class Fl32_Teq_User_Defaults {
    BCRYPT_HASH_ROUNDS = 10;    // Number of salt rounds used in bcrypt hash.
    DI_SESSION = 'session'; // ID of the session singleton in DI-container.
    HTTP_REQ_SESSION_ID = 'sessionId';  // Attribute of the HTTP request to store session ID.
    HTTP_REQ_USER = 'user'; // Attribute of the HTTP request to store authenticated user data.
    ROUTE_CHANGE_PASSWORD = '/changePassword';
    ROUTE_CHECK_EXISTENCE = '/check/existence';
    ROUTE_CURRENT = '/current';
    ROUTE_LIST = '/list';
    ROUTE_SIGN_IN = '/signIn';
    ROUTE_SIGN_OUT = '/signOut';
    ROUTE_SIGN_UP = '/signUp';
    SESSION_COOKIE_LIFETIME = 31536000000;  // 3600 * 24 * 365 * 1000
    SESSION_COOKIE_NAME = 'TEQ_SESSION_ID';
    SESSION_ID_BYTES = 20;  // Number of bytes for generated session ID.

    constructor() {
        Object.freeze(this);
    }
}
