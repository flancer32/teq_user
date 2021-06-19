/**
 * Request and response DTO for 'Get Current User' service.
 * @namespace Fl32_Teq_User_Shared_Service_Route_Current
 */
// MODULE'S VARS
const NS = 'Fl32_Teq_User_Shared_Service_Route_Current';

// MODULE'S CLASSES
/**
 * @memberOf Fl32_Teq_User_Shared_Service_Route_Current
 */
class Request {
}

/**
 * @memberOf Fl32_Teq_User_Shared_Service_Route_Current
 */
class Response {
    /** @type {Fl32_Teq_User_Shared_Service_Dto_User} */
    user;
}

/**
 * Factory to create new DTOs.
 * @memberOf Fl32_Teq_User_Shared_Service_Route_Current
 */
class Factory {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {typeof Fl32_Teq_User_Shared_Service_Dto_User} */
        const DUser = spec['Fl32_Teq_User_Shared_Service_Dto_User#']; // class
        /** @type {Fl32_Teq_User_Shared_Service_Dto_User.Factory} */
        const fUser = spec['Fl32_Teq_User_Shared_Service_Dto_User#Factory$']; // singleton

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
