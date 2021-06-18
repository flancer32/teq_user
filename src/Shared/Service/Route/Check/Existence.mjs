/**
 * Request and response for 'Check Existence' service.
 */
class Fl32_Teq_User_Shared_Service_Route_Check_Existence_Request {
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
Fl32_Teq_User_Shared_Service_Route_Check_Existence_Request.TYPE_EMAIL = 'email';
Fl32_Teq_User_Shared_Service_Route_Check_Existence_Request.TYPE_LOGIN = 'login';
Fl32_Teq_User_Shared_Service_Route_Check_Existence_Request.TYPE_PHONE = 'phone';
Fl32_Teq_User_Shared_Service_Route_Check_Existence_Request.TYPE_REF_CODE = 'refCode';

class Fl32_Teq_User_Shared_Service_Route_Check_Existence_Response {
    /** @type {Boolean} */
    exist;
}

export {
    Fl32_Teq_User_Shared_Service_Route_Check_Existence_Request as Request,
    Fl32_Teq_User_Shared_Service_Route_Check_Existence_Response as Response,
};
