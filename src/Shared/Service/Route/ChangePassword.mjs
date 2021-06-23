/**
 * Request and response DTO for 'Change Password' service.
 * @namespace Fl32_Teq_User_Shared_Service_Route_ChangePassword
 */
// MODULE'S VARS
const NS = 'Fl32_Teq_User_Shared_Service_Route_ChangePassword';

// MODULE'S CLASSES
/**
 * @memberOf Fl32_Teq_User_Shared_Service_Route_ChangePassword
 */
class Request {
    /** @type {String} */
    passwordCurrent;
    /** @type {String} */
    passwordNew;
}

/**
 * @memberOf Fl32_Teq_User_Shared_Service_Route_ChangePassword
 */
class Response {
    /** @type {Boolean} */
    success;
}

/**
 * Factory to create new DTOs.
 * @memberOf Fl32_Teq_User_Shared_Service_Route_ChangePassword
 */
class Factory {
    constructor() {
        /**
         * @param {Request|null} data
         * @return {Fl32_Teq_User_Shared_Service_Route_ChangePassword.Request}
         */
        this.createReq = function (data = null) {
            const res = new Request();
            res.passwordCurrent = data?.passwordCurrent;
            res.passwordNew = data?.passwordNew;
            return res;
        }

        /**
         * @param {Response|null} data
         * @return {Fl32_Teq_User_Shared_Service_Route_ChangePassword.Response}
         */
        this.createRes = function (data = null) {
            const res = new Response();
            res.success = data?.success;
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
