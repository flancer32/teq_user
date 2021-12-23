/**
 * Referral link DTO in Service API.
 */
// MODULE'S VARS
const NS = 'Fl32_Teq_User_Shared_Dto_RefLink';

// MODULE'S CLASSES
export default class Fl32_Teq_User_Shared_Dto_RefLink {
    /** @type {Date} */
    dateExpired
    /** @type {Fl32_Teq_User_Shared_Dto_User} */
    parent
    /**
     * Referral code.
     * @type {String}
     */
    refCode
}

// attributes names to use as aliases in queries to RDb
Fl32_Teq_User_Shared_Dto_RefLink.DATE_EXPIRED = 'dateExpired';
Fl32_Teq_User_Shared_Dto_RefLink.PARENT = 'parent';
Fl32_Teq_User_Shared_Dto_RefLink.REF_CODE = 'refCode';

/**
 * Factory to create new DTO instances.
 * @memberOf Fl32_Teq_User_Shared_Dto_RefLink
 */
export class Factory {
    constructor(spec) {
        const {castString} = spec['TeqFw_Core_Shared_Util_Cast'];
        /** @type {Fl32_Teq_User_Shared_Dto_User.Factory} */
        const fUser = spec['Fl32_Teq_User_Shared_Dto_User#Factory$'];

        /**
         * @param {Fl32_Teq_User_Shared_Dto_RefLink|null} data
         * @return {Fl32_Teq_User_Shared_Dto_RefLink}
         */
        this.create = function (data = null) {
            const res = new Fl32_Teq_User_Shared_Dto_RefLink();
            res.dateExpired = data?.dateExpired ? new Date(data.dateExpired) : null;
            res.parent = data?.parent ? fUser.create(data?.parent) : null;
            res.refCode = castString(data?.refCode);
            return res;
        }
    }
}

// freeze class to deny attributes changes then export class
Object.freeze(Fl32_Teq_User_Shared_Dto_RefLink);
Object.defineProperty(Factory, 'name', {value: `${NS}.${Factory.constructor.name}`});
