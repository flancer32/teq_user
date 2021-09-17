/**
 * User DTO for frontend areas.
 */
// MODULE'S VARS
const NS = 'Fl32_Teq_User_Front_Dto_User';

export default class Fl32_Teq_User_Front_Dto_User {
    /** @type {number} */
    id;
}

Fl32_Teq_User_Front_Dto_User.ID = 'id';

// noinspection JSCheckFunctionSignatures
/**
 * Factory to create new DTO instances.
 * @memberOf Fl32_Teq_User_Front_Dto_User
 */
export class Factory {
    constructor(spec) {
        const {castInt} = spec['TeqFw_Core_Shared_Util_Cast'];
        /**
         * @param {Fl32_Teq_User_Front_Dto_User|null} data
         * @return {Fl32_Teq_User_Front_Dto_User}
         */
        this.create = function (data = null) {
            const res = new Fl32_Teq_User_Front_Dto_User();
            res.id = castInt(data?.id);
            return res;
        };
    }
}

// freeze class to deny attributes changes then export class
Object.freeze(Fl32_Teq_User_Front_Dto_User);
Object.defineProperty(Factory, 'name', {value: `${NS}.${Factory.constructor.name}`});
