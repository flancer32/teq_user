/**
 * Route data for service to change user password.
 *
 * @namespace Fl32_Teq_User_Shared_WAPI_ChangePassword
 */
// MODULE'S VARS
const NS = 'Fl32_Teq_User_Shared_WAPI_ChangePassword';

// MODULE'S CLASSES
/**
 * @memberOf Fl32_Teq_User_Shared_WAPI_ChangePassword
 */
class Request {
    /** @type {string} */
    passwordCurrent;
    /** @type {string} */
    passwordNew;
}

/**
 * @memberOf Fl32_Teq_User_Shared_WAPI_ChangePassword
 */
class Response {
    /** @type {boolean} */
    success;
}

/**
 * Factory to create new DTOs and get route address.
 * @implements TeqFw_Web_Back_Api_WAPI_IRoute
 * @memberOf Fl32_Teq_User_Shared_WAPI_ChangePassword
 */
class Factory {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {Fl32_Teq_User_Shared_Defaults} */
        const DEF = spec['Fl32_Teq_User_Shared_Defaults$'];

        // DEFINE INSTANCE METHODS
        this.getRoute = () => `/${DEF.NAME}${DEF.SRV.CHANGE_PASSWORD}`;

        /**
         * @param {Request|null} data
         * @return {Fl32_Teq_User_Shared_WAPI_ChangePassword.Request}
         */
        this.createReq = function (data = null) {
            const res = new Request();
            res.passwordCurrent = data?.passwordCurrent;
            res.passwordNew = data?.passwordNew;
            return res;
        }

        /**
         * @param {Response|null} data
         * @return {Fl32_Teq_User_Shared_WAPI_ChangePassword.Response}
         */
        this.createRes = function (data = null) {
            const res = new Response();
            res.success = data?.success;
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
