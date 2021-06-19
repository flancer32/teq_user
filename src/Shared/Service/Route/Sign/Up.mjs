/**
 * Request and response DTO for 'Sign Up' service.
 * @namespace Fl32_Teq_User_Shared_Service_Route_Sign_Up
 */
// MODULE'S VARS
const NS = 'Fl32_Teq_User_Shared_Service_Route_Sign_Up';

// MODULE'S CLASSES
/**
 * Required fields:
 *  - login
 *  - name
 *  - password
 *  - referralCode
 * @memberOf Fl32_Teq_User_Shared_Service_Route_Sign_Up
 */
class Request {
    /** @type {String} */
    email;
    /** @type {String} */
    login;
    /** @type {String} */
    name;
    /** @type {String} */
    password;
    /** @type {String} */
    phone;
    /** @type {String} */
    referralCode;
}

/**
 * @memberOf Fl32_Teq_User_Shared_Service_Route_Sign_Up
 */
class Response {
    /** @type {Fl32_Teq_User_Shared_Dto_User} */
    user;
}

/**
 * Factory to create new DTOs.
 * @memberOf Fl32_Teq_User_Shared_Service_Route_Sign_Up
 */
class Factory {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {typeof Fl32_Teq_User_Shared_Dto_User} */
        const DUser = spec['Fl32_Teq_User_Shared_Dto_User#']; // class
        /** @type {Fl32_Teq_User_Shared_Dto_User.Factory} */
        const fUser = spec['Fl32_Teq_User_Shared_Dto_User#Factory$']; // singleton

        /**
         * @param {Request|null} data
         * @return {Fl32_Teq_User_Shared_Service_Route_Sign_Up.Request}
         */
        this.createReq = function (data = null) {
            const res = new Request();
            res.email = data?.email;
            res.login = data?.login;
            res.name = data?.name;
            res.password = data?.password;
            res.phone = data?.phone;
            res.referralCode = data?.referralCode;
            return res;
        }

        /**
         * @param {Response|null} data
         * @return {Fl32_Teq_User_Shared_Service_Route_Sign_Up.Response}
         */
        this.createRes = function (data = null) {
            const res = new Response();
            res.user = (data?.user instanceof DUser) ? data.user : fUser.create(data.user);
            return res;
        }
    }
}

// freeze class to deny attributes changes then export classes
Object.defineProperty(Request, 'name', {value: `${NS}.${Request.name}`});
Object.defineProperty(Response, 'name', {value: `${NS}.${Response.name}`});
Object.freeze(Request);
Object.freeze(Response);
Object.defineProperty(Factory, 'name', {value: `${NS}.${Factory.name}`});

export {
    Factory,
    Request,
    Response,
};
