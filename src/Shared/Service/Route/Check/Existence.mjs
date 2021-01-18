/**
 * Request and response for 'Check Existence' service.
 */
class Fl32_Teq_User_Shared_Service_Route_Check_Existence_Request {
    static TYPE_EMAIL = 'email';
    static TYPE_LOGIN = 'login';
    static TYPE_PHONE = 'phone';
    static TYPE_REF_CODE = 'refCode';
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

class Fl32_Teq_User_Shared_Service_Route_Check_Existence_Response {
    /** @type {Boolean} */
    exist;
}

export {
    Fl32_Teq_User_Shared_Service_Route_Check_Existence_Request as Request,
    Fl32_Teq_User_Shared_Service_Route_Check_Existence_Response as Response,
};
