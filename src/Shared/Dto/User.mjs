/**
 * User DTO in Service API.
 */
// MODULE'S VARS
const NS = 'Fl32_Teq_User_Shared_Dto_User';

// MODULE'S CLASSES
export default class Fl32_Teq_User_Shared_Dto_User {
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
     * Plain password (pass password to process if new user is created).
     * @type {String}
     */
    password;
    /**
     * Identity phone number or numbers.
     * @type {String[]}
     */
    phones
}

// attributes names to use as aliases in queries to RDb
Fl32_Teq_User_Shared_Dto_User.DATE_CREATED = 'dateCreated';
Fl32_Teq_User_Shared_Dto_User.DATE_LOGGED_IN = 'dateLoggedIn';
Fl32_Teq_User_Shared_Dto_User.EMAILS = 'emails';
Fl32_Teq_User_Shared_Dto_User.ID = 'id';
Fl32_Teq_User_Shared_Dto_User.LOGIN = 'login';
Fl32_Teq_User_Shared_Dto_User.NAME = 'name';
Fl32_Teq_User_Shared_Dto_User.PARENT_ID = 'parentId';
Fl32_Teq_User_Shared_Dto_User.PARENT_NAME = 'parentName';
Fl32_Teq_User_Shared_Dto_User.PASSWORD = 'password';
Fl32_Teq_User_Shared_Dto_User.PHONES = 'phones';

// noinspection JSCheckFunctionSignatures
/**
 * Factory to create new DTO instances.
 * @memberOf Fl32_Teq_User_Shared_Dto_User
 */
export class Factory {
    constructor(spec) {
        const {castArray, castInt, castString} = spec['TeqFw_Core_Shared_Util_Cast'];

        /**
         * @param {Fl32_Teq_User_Shared_Dto_User|null} data
         * @return {Fl32_Teq_User_Shared_Dto_User}
         */
        this.create = function (data = null) {
            const res = new Fl32_Teq_User_Shared_Dto_User();
            res.dateCreated = data?.dateCreated ? new Date(data.dateCreated) : null;
            res.dateLoggedIn = data?.dateLoggedIn ? new Date(data.dateLoggedIn) : null;
            res.emails = castArray(data?.emails);
            res.id = castInt(data?.id);
            res.login = castString(data?.login);
            res.name = castString(data?.name);
            res.parentId = castInt(data?.parentId);
            res.parentName = castString(data?.parentName);
            res.password = castString(data?.password);
            res.phones = castArray(data?.phones);
            return res;
        }
    }
}

// freeze class to deny attributes changes then export class
Object.freeze(Fl32_Teq_User_Shared_Dto_User);
Object.defineProperty(Factory, 'name', {value: `${NS}.${Factory.constructor.name}`});
