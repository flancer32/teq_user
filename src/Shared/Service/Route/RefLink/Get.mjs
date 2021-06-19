/**
 * Request and response DTO for 'Get Referral Link' service.
 * @namespace Fl32_Teq_User_Shared_Service_Route_RefLink_Get
 */
// MODULE'S VARS
const NS = 'Fl32_Teq_User_Shared_Service_Route_RefLink_Get';

// MODULE'S CLASSES
/**
 * @memberOf Fl32_Teq_User_Shared_Service_Route_RefLink_Get
 */
class Request {
    /** @type {String} */
    code;
}

/**
 * @memberOf Fl32_Teq_User_Shared_Service_Route_RefLink_Get
 */
class Response {
    /** @type {Fl32_Teq_User_Shared_Dto_RefLink} */
    link
}

/**
 * Factory to create new DTOs.
 * @memberOf Fl32_Teq_User_Shared_Service_Route_RefLink_Get
 */
class Factory {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {typeof Fl32_Teq_User_Shared_Dto_RefLink} */
        const DLink = spec['Fl32_Teq_User_Shared_Dto_RefLink#']; // class
        /** @type {Fl32_Teq_User_Shared_Dto_RefLink.Factory} */
        const fLink = spec['Fl32_Teq_User_Shared_Dto_RefLink#Factory$']; // singleton

        /**
         * @param {Request|null} data
         * @return {Fl32_Teq_User_Shared_Service_Route_RefLink_Get.Request}
         */
        this.createReq = function (data = null) {
            const res = new Request();
            res.code = data?.code;
            return res;
        }

        /**
         * @param {Response|null} data
         * @return {Fl32_Teq_User_Shared_Service_Route_RefLink_Get.Response}
         */
        this.createRes = function (data = null) {
            const res = new Response();
            res.link = (data?.link instanceof DLink) ? data.link : fLink.create(data.link);
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
