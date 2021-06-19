/**
 * Referral link DTO in Service API.
 */
// MODULE'S VARS
const NS = 'Fl32_Teq_User_Shared_Dto_RefLink';

// MODULE'S CLASSES
class Fl32_Teq_User_Shared_Dto_RefLink {
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
class Factory {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {typeof Fl32_Teq_User_Shared_Dto_User} */
        const DUser = spec['Fl32_Teq_User_Shared_Dto_User#']; // class
        /** @type {Fl32_Teq_User_Shared_Dto_User.Factory} */
        const fUser = spec['Fl32_Teq_User_Shared_Dto_User#Factory$']; // singleton

        /**
         * @param {Fl32_Teq_User_Shared_Dto_RefLink|null} data
         * @return {Fl32_Teq_User_Shared_Dto_RefLink}
         */
        this.create = function (data = null) {
            const res = new Fl32_Teq_User_Shared_Dto_RefLink();
            res.dateExpired = data?.dateExpired
                ? (data.dateExpired instanceof Date) ? data.dateExpired : new Date(data.dateExpired)
                : null;
            res.parent = data?.parent
                ? (data.parent instanceof DUser) ? data.parent : fUser.create(data.parent)
                : null;
            res.refCode = data?.refCode;
            return res;
        }
    }
}

// freeze class to deny attributes changes then export class
Object.freeze(Fl32_Teq_User_Shared_Dto_RefLink);
Object.defineProperty(Factory, 'name', {value: `${NS}.${Factory.name}`});
export {
    Fl32_Teq_User_Shared_Dto_RefLink as default,
    Factory
};
