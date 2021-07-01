/**
 * Route data for service to get profile for currently authenticated user.
 * @namespace Fl32_Teq_User_Shared_Service_Route_Current
 */
// MODULE'S VARS
const NS = 'Fl32_Teq_User_Shared_Service_Route_Current';

// MODULE'S CLASSES
/**
 * @memberOf Fl32_Teq_User_Shared_Service_Route_Current
 */
class Request {}

/**
 * @memberOf Fl32_Teq_User_Shared_Service_Route_Current
 */
class Response {
    /** @type {Fl32_Teq_User_Shared_Service_Dto_User} */
    user;
}

/**
 * Factory to create new DTOs and get route address.
 * @memberOf Fl32_Teq_User_Shared_Service_Route_Current
 * @implements TeqFw_Web_Back_Api_Service_Factory_IRoute
 */
class Factory {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {Fl32_Teq_User_Shared_Defaults} */
        const DEF = spec['Fl32_Teq_User_Shared_Defaults$'];
        /** @type {typeof Fl32_Teq_User_Shared_Service_Dto_User} */
        const DUser = spec['Fl32_Teq_User_Shared_Service_Dto_User#'];
        /** @type {Fl32_Teq_User_Shared_Service_Dto_User.Factory} */
        const fUser = spec['Fl32_Teq_User_Shared_Service_Dto_User#Factory$'];

        // DEFINE INSTANCE METHODS
        /**
         * @param {Request|null} data
         * @return {Fl32_Teq_User_Shared_Service_Route_Current.Request}
         */
        this.createReq = function (data = null) {
            return new Request();
        }

        /**
         * @param {Response|null} data
         * @return {Fl32_Teq_User_Shared_Service_Route_Current.Response}
         */
        this.createRes = function (data = null) {
            const res = new Response();
            res.user = (data?.user instanceof DUser) ? data.user : fUser.create(data?.user);
            return res;
        }

        this.getRoute = () => DEF.API.CURRENT;
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
