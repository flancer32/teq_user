/**
 * User DTO for frontend areas.
 */
// MODULE'S VARS
const NS = 'Fl32_Teq_User_Front_Dto_User';

class Fl32_Teq_User_Front_Dto_User {
    /** @type {number} */
    id;
}

Fl32_Teq_User_Front_Dto_User.ID = 'id';

/**
 * Factory to create new DTO instances.
 * @memberOf Fl32_Teq_User_Front_Dto_User
 */
class Factory {
    constructor() {
        /**
         * @param {Fl32_Teq_User_Front_Dto_User|null} data
         * @return {Fl32_Teq_User_Front_Dto_User}
         */
        this.create = function (data = null) {
            const res = new Fl32_Teq_User_Front_Dto_User();
            res.id = data?.id;
            return res;
        }
    }
}

// freeze class to deny attributes changes then export class
Object.freeze(Fl32_Teq_User_Front_Dto_User);
Object.defineProperty(Factory, 'name', {value: `${NS}.${Factory.name}`});
export {
    Fl32_Teq_User_Front_Dto_User as default,
    Factory
} ;
