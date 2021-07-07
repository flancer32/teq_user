/**
 * Route data for service to list users data.
 *
 * This request should contain standard grid listing structure (filters, order, limit).
 *
 * @namespace Fl32_Teq_User_Shared_Service_Route_List
 */
// MODULE'S VARS
const NS = 'Fl32_Teq_User_Shared_Service_Route_List';

// MODULE'S CLASSES
/**
 * @memberOf Fl32_Teq_User_Shared_Service_Route_List
 */
class Request {
    // initial structure is empty, just return all data w/o filters/order/limit
    cond;    // should be conditions structure here (filters/order/limit)
}

/**
 * @memberOf Fl32_Teq_User_Shared_Service_Route_List
 */
class Response {
    /** @type {Fl32_Teq_User_Shared_Service_Dto_User[]} */
    items;
}

/**
 * Factory to create new DTOs and get route address.
 * @implements TeqFw_Web_Back_Api_Service_Factory_IRoute
 * @memberOf Fl32_Teq_User_Shared_Service_Route_List
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
        this.getRoute = () => `/${DEF.NAME}${DEF.SRV.LIST}`;

        /**
         * @param {Request|null} data
         * @return {Fl32_Teq_User_Shared_Service_Route_List.Request}
         */
        this.createReq = function (data = null) {
            const res = new Request();
            res.cond = data?.cond;
            return res;
        }

        /**
         * @param {Response|null} data
         * @return {Fl32_Teq_User_Shared_Service_Route_List.Response}
         */
        this.createRes = function (data = null) {
            const res = new Response();
            res.items = Array.isArray(data?.items)
                ? data.items.map((one) => (one instanceof DUser) ? one : fUser.create(one))
                : [];
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
