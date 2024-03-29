/**
 * Route data for service to list users data.
 *
 * This request should contain standard grid listing structure (filters, order, limit).
 *
 * @namespace Fl32_Teq_User_Shared_WAPI_List
 */
// MODULE'S VARS
const NS = 'Fl32_Teq_User_Shared_WAPI_List';

// MODULE'S CLASSES
/**
 * @memberOf Fl32_Teq_User_Shared_WAPI_List
 */
class Request {
    // initial structure is empty, just return all data w/o filters/order/limit
    cond;    // should be conditions structure here (filters/order/limit)
}

/**
 * @memberOf Fl32_Teq_User_Shared_WAPI_List
 */
class Response {
    /** @type {Fl32_Teq_User_Shared_Dto_User[]} */
    items;
}

/**
 * Factory to create new DTOs and get route address.
 * @implements TeqFw_Web_Back_Api_WAPI_IRoute
 * @memberOf Fl32_Teq_User_Shared_WAPI_List
 */
class Factory {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {Fl32_Teq_User_Shared_Defaults} */
        const DEF = spec['Fl32_Teq_User_Shared_Defaults$'];
        /** @type {Function|TeqFw_Core_Shared_Util_Cast.castArrayOfObj} */
        const castArrayOfObj = spec['TeqFw_Core_Shared_Util_Cast#castArrayOfObj'];
        /** @type {Fl32_Teq_User_Shared_Dto_User.Factory} */
        const fUser = spec['Fl32_Teq_User_Shared_Dto_User#Factory$'];

        // DEFINE INSTANCE METHODS
        this.getRoute = () => `/${DEF.NAME}${DEF.SRV.LIST}`;

        /**
         * @param {Request|null} data
         * @return {Fl32_Teq_User_Shared_WAPI_List.Request}
         */
        this.createReq = function (data = null) {
            const res = new Request();
            res.cond = data?.cond;
            return res;
        }

        /**
         * @param {Response|null} data
         * @return {Fl32_Teq_User_Shared_WAPI_List.Response}
         */
        this.createRes = function (data = null) {
            const res = new Response();
            res.items =castArrayOfObj(data?.items, fUser.create);
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
