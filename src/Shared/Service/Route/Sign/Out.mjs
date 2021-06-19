/**
 * Request and response DTO for 'Sign Out' service.
 * @namespace Fl32_Teq_User_Shared_Service_Route_Sign_Out
 */
// MODULE'S VARS
const NS = 'Fl32_Teq_User_Shared_Service_Route_Sign_Out';

// MODULE'S CLASSES
/**
 * @memberOf Fl32_Teq_User_Shared_Service_Route_Sign_Out
 */
class Request {
}

/**
 * @memberOf Fl32_Teq_User_Shared_Service_Route_Sign_Out
 */
class Response {
}

/**
 * Factory to create new DTOs.
 * @memberOf Fl32_Teq_User_Shared_Service_Route_Sign_Out
 */
class Factory {
    constructor() {
        /**
         * @param {Request|null} data
         * @return {Fl32_Teq_User_Shared_Service_Route_Sign_Out.Request}
         */
        this.createReq = function (data = null) {
            return new Request();
        }

        /**
         * @param {Response|null} data
         * @return {Fl32_Teq_User_Shared_Service_Route_Sign_Out.Response}
         */
        this.createRes = function (data = null) {
            return new Response();
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
