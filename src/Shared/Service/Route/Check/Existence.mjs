/**
 * Request and response DTO for 'Check Existence' service.
 * @namespace Fl32_Teq_User_Shared_Service_Route_Check_Existence
 */
// MODULE'S VARS
const NS = 'Fl32_Teq_User_Shared_Service_Route_Check_Existence';

// MODULE'S CLASSES
/**
 * @memberOf Fl32_Teq_User_Shared_Service_Route_Check_Existence
 */
class Request {
    /**
     * Type for value to be checked (see static 'TYPE_...' props for available types).
     * @type {String}
     */
    type;
    /**
     * Value to be checked for existence.
     * @type {String}
     */
    value;
}

// static properties (compatible with Safari "< 14.1", "iOS < 14.5" form)
/** @memberOf Fl32_Teq_User_Shared_Service_Route_Check_Existence */
Request.TYPE_EMAIL = 'email';
Request.TYPE_LOGIN = 'login';
Request.TYPE_PHONE = 'phone';
Request.TYPE_REF_CODE = 'refCode';

/**
 * @memberOf Fl32_Teq_User_Shared_Service_Route_Check_Existence
 */
class Response {
    /** @type {Boolean} */
    exist;
}


/**
 * Factory to create new DTOs.
 * @memberOf Fl32_Teq_User_Shared_Service_Route_Check_Existence
 */
class Factory {
    constructor() {
        /**
         * @param {Request|null} data
         * @return {Fl32_Teq_User_Shared_Service_Route_Check_Existence.Request}
         */
        this.createReq = function (data = null) {
            const res = new Request();
            res.type = data?.type;
            res.value = data?.value;
            return res;
        }
        /**
         * @param {Response|null} data
         * @return {Fl32_Teq_User_Shared_Service_Route_Check_Existence.Response}
         */
        this.createRes = function (data = null) {
            const res = new Response();
            res.exist = data?.exist;
            return res;
        }
    }
}

// freeze class to deny attributes changes then export classes
Object.defineProperty(Request, 'name', {value: `${NS}.${Request.constructor.name}`});
Object.defineProperty(Response, 'name', {value: `${NS}.${Response.constructor.name}`});
Object.freeze(Request);
Object.freeze(Response);
Object.defineProperty(Factory, 'name', {value: `${NS}.${Factory.constructor.name}`});

export {
    Factory,
    Request,
    Response,
};
