/**
 * Request and response DTO for 'Sign In' service.
 * @namespace Fl32_Teq_User_Shared_Service_Route_Sign_In
 */
// MODULE'S VARS
const NS = 'Fl32_Teq_User_Shared_Service_Route_Sign_In';

// MODULE'S CLASSES
/**
 * @memberOf Fl32_Teq_User_Shared_Service_Route_Sign_In
 */
class Request {
    /** @type {String} user identity - login/email/phone */
    user
    /** @type {String} plain password */
    password
}

/**
 * @memberOf Fl32_Teq_User_Shared_Service_Route_Sign_In
 */
class Response {
    /** @type {String} */
    sessionId
}

/**
 * Factory to create new DTOs.
 * @memberOf Fl32_Teq_User_Shared_Service_Route_Sign_In
 */
class Factory {
    constructor() {
        /**
         * @param {Request|Object|null} data
         * @return {Fl32_Teq_User_Shared_Service_Route_Sign_In.Request}
         */
        this.createReq = function (data = null) {
            const res = new Request();
            res.password = data?.password;
            res.user = data?.user;
            return res;
        }

        /**
         * @param {Response|Object|null} data
         * @return {Fl32_Teq_User_Shared_Service_Route_Sign_In.Response}
         */
        this.createRes = function (data = null) {
            const res = new Response();
            res.sessionId = data?.sessionId;
            return res;
        }
    }
}

// freeze class to deny attributes changes then export classes
Object.defineProperty(Request, 'name', {value: `${NS}.${Request.constructor.name}`});
Object.defineProperty(Response, 'name', {value: `${NS}.${Response.constructor.name}`});
Object.freeze(Request);
Object.freeze(Response);
Object.defineProperty(Factory, 'name', {value: `${NS}.${Factory.constructor.name}`});

export {
    Factory,
    Request,
    Response,
};
