/**
 * Hardcoded configuration for the module.
 */
export default class Fl32_Teq_User_Defaults {
    /**
     * Number of salt rounds used in bcrypt hash.
     * @type {Number}
     * @default
     */
    BCRYPT_HASH_ROUNDS = 10;
    /**
     * @type {string}
     */
    SESSION_COOKIE_NAME = 'TEQ_SESSION_ID';
    /**
     * @type {number}
     */
    SESSION_COOKIE_LIFETIME = 900000;
    /**
     * Number of bytes for generated session ID.
     * @type {number}
     */
    SESSION_ID_BYTES = 20;
}
