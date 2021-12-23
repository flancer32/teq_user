/**
 * Route data for service to sign out.
 * @namespace Fl32_Teq_User_Shared_WAPI_Sign_Out
 */
// MODULE'S VARS
const NS = 'Fl32_Teq_User_Shared_WAPI_Sign_Out';

// MODULE'S CLASSES
/**
 * @memberOf Fl32_Teq_User_Shared_WAPI_Sign_Out
 */
class Request {}

/**
 * @memberOf Fl32_Teq_User_Shared_WAPI_Sign_Out
 */
class Response {}

/**
 * Factory to create new DTOs and get route address.
 * @implements TeqFw_Web_Back_Api_WAPI_IRoute
 * @memberOf Fl32_Teq_User_Shared_WAPI_Sign_Out
 */
class Factory {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {Fl32_Teq_User_Shared_Defaults} */
        const DEF = spec['Fl32_Teq_User_Shared_Defaults$'];

        // DEFINE INSTANCE METHODS
        this.getRoute = () => `/${DEF.NAME}${DEF.SRV.SIGN.OUT}`;

        /**
         * @param {Request|null} data
         * @return {Fl32_Teq_User_Shared_WAPI_Sign_Out.Request}
         */
        this.createReq = function (data = null) {
            return new Request();
        }

        /**
         * @param {Response|null} data
         * @return {Fl32_Teq_User_Shared_WAPI_Sign_Out.Response}
         */
        this.createRes = function (data = null) {
            return new Response();
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
