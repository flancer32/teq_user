/**
 * Route data for service to different values existence checking (login, referral code, email, phone, ...).
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
     * @type {string}
     */
    type;
    /**
     * Value to be checked for existence.
     * @type {string}
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
    /** @type {boolean} */
    exist;
}


/**
 * Factory to create new DTOs and get route address.
 * @implements TeqFw_Web_Back_Api_Service_IRoute
 * @memberOf Fl32_Teq_User_Shared_Service_Route_Check_Existence
 */
class Factory {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {Fl32_Teq_User_Shared_Defaults} */
        const DEF = spec['Fl32_Teq_User_Shared_Defaults$'];

        // DEFINE INSTANCE METHODS
        this.getRoute = () => `/${DEF.NAME}${DEF.SRV.CHECK.EXISTENCE}`;

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

// MODULE'S EXPORT
Object.defineProperty(Factory, 'name', {value: `${NS}.${Factory.constructor.name}`});
Object.defineProperty(Request, 'name', {value: `${NS}.${Request.constructor.name}`});
Object.defineProperty(Response, 'name', {value: `${NS}.${Response.constructor.name}`});
export {
    Factory,
    Request,
    Response,
};
