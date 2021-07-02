/**
 * Route data for service to sign up users.
 *
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
    /** @type {string} */
    email;
    /** @type {string} */
    login;
    /** @type {string} */
    name;
    /** @type {string} */
    password;
    /** @type {string} */
    phone;
    /** @type {string} */
    referralCode;
}

/**
 * @memberOf Fl32_Teq_User_Shared_Service_Route_Sign_Up
 */
class Response {
    /** @type {string} */
    error;
    /** @type {string} */
    sessionId;
    /** @type {Fl32_Teq_User_Shared_Service_Dto_User} */
    user;
}

/**
 * Factory to create new DTOs and get route address.
 * @implements TeqFw_Web_Back_Api_Service_Factory_IRoute
 * @memberOf Fl32_Teq_User_Shared_Service_Route_Sign_Up
 */
class Factory {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {Fl32_Teq_User_Shared_Defaults} */
        const DEF = spec['Fl32_Teq_User_Shared_Defaults$'];
        /** @type {typeof Fl32_Teq_User_Shared_Service_Dto_User} */
        const DUser = spec['Fl32_Teq_User_Shared_Service_Dto_User#']; // class
        /** @type {Fl32_Teq_User_Shared_Service_Dto_User.Factory} */
        const fUser = spec['Fl32_Teq_User_Shared_Service_Dto_User#Factory$']; // singleton

        // DEFINE INSTANCE METHODS
        this.getRoute = () => `/${DEF.NAME}${DEF.SRV.SIGN.UP}`;

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
            res.error = data?.error;
            res.sessionId = data?.sessionId;
            res.user = (data?.user instanceof DUser) ? data.user : fUser.create(data?.user);
            return res;
        }
    }
}

// MODULE'S EXPORT
Object.defineProperty(Factory, 'name', {value: `${NS}.${Factory.constructor.name}`});
Object.defineProperty(Request, 'name', {value: `${NS}.${Request.constructor.name}`});
Object.defineProperty(Response, 'name', {value: `${NS}.${Response.constructor.name}`});
export {
    Factory,
    Request,
    Response,
};
