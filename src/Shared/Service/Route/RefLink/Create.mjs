/**
 * Route data for service to create referral link.
 * @namespace Fl32_Teq_User_Shared_Service_Route_RefLink_Create
 */
// MODULE'S VARS
const NS = 'Fl32_Teq_User_Shared_Service_Route_RefLink_Create';

// MODULE'S CLASSES
/**
 * @memberOf Fl32_Teq_User_Shared_Service_Route_RefLink_Create
 */
class Request {}

/**
 * @memberOf Fl32_Teq_User_Shared_Service_Route_RefLink_Create
 */
class Response {
    /** @type {Fl32_Teq_User_Shared_Service_Dto_RefLink} */
    link;
}

/**
 * Factory to create new DTOs and get route address.
 * @implements TeqFw_Web_Back_Api_Service_Factory_IRoute
 * @memberOf Fl32_Teq_User_Shared_Service_Route_RefLink_Create
 */
class Factory {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {Fl32_Teq_User_Shared_Defaults} */
        const DEF = spec['Fl32_Teq_User_Shared_Defaults$'];
        /** @type {typeof Fl32_Teq_User_Shared_Service_Dto_RefLink} */
        const DLink = spec['Fl32_Teq_User_Shared_Service_Dto_RefLink#']; // class
        /** @type {Fl32_Teq_User_Shared_Service_Dto_RefLink.Factory} */
        const fLink = spec['Fl32_Teq_User_Shared_Service_Dto_RefLink#Factory$']; // singleton

        // DEFINE INSTANCE METHODS
        this.getRoute = () => `/${DEF.NAME}${DEF.SRV.REF_LINK.CREATE}`;

        /**
         * @param {Request|null} data
         * @return {Fl32_Teq_User_Shared_Service_Route_RefLink_Create.Request}
         */
        this.createReq = function (data = null) {
            return new Request();
        }
        /**
         * @param {Response|null} data
         * @return {Fl32_Teq_User_Shared_Service_Route_RefLink_Create.Response}
         */
        this.createRes = function (data = null) {
            const res = new Response();
            res.link = (data?.link instanceof DLink) ? data.link : fLink.create(data?.link);
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
