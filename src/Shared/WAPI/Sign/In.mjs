/**
 * Route data for service to user sign in.
 * @namespace Fl32_Teq_User_Shared_WAPI_Sign_In
 */
// MODULE'S VARS
const NS = 'Fl32_Teq_User_Shared_WAPI_Sign_In';

// MODULE'S CLASSES
/**
 * @memberOf Fl32_Teq_User_Shared_WAPI_Sign_In
 */
class Request {
    /** @type {string} user identity - login/email/phone */
    user
    /** @type {string} plain password */
    password
}

/**
 * @memberOf Fl32_Teq_User_Shared_WAPI_Sign_In
 */
class Response {
    /** @type {string} */
    sessionId
}

/**
 * Factory to create new DTOs and get route address.
 * @implements TeqFw_Web_Back_Api_WAPI_IRoute
 * @memberOf Fl32_Teq_User_Shared_WAPI_Sign_In
 */
class Factory {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {Fl32_Teq_User_Shared_Defaults} */
        const DEF = spec['Fl32_Teq_User_Shared_Defaults$'];

        // DEFINE INSTANCE METHODS
        this.getRoute = () => `/${DEF.NAME}${DEF.SRV.SIGN.IN}`;

        /**
         * @param {Request|Object|null} data
         * @return {Fl32_Teq_User_Shared_WAPI_Sign_In.Request}
         */
        this.createReq = function (data = null) {
            const res = new Request();
            res.password = data?.password;
            res.user = data?.user;
            return res;
        }

        /**
         * @param {Response|Object|null} data
         * @return {Fl32_Teq_User_Shared_WAPI_Sign_In.Response}
         */
        this.createRes = function (data = null) {
            const res = new Response();
            res.sessionId = data?.sessionId;
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
