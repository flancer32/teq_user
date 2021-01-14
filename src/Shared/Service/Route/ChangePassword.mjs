/**
 * Request and response for 'changePassword' service.
 */
class Fl32_Teq_User_Shared_Service_Route_ChangePassword_Request {
    /** @type {String} */
    passwordCurrent;
    /** @type {String} */
    passwordNew;
}

class Fl32_Teq_User_Shared_Service_Route_ChangePassword_Response {
    /** @type {Boolean} */
    success;
}

export {
    Fl32_Teq_User_Shared_Service_Route_ChangePassword_Request as Request,
    Fl32_Teq_User_Shared_Service_Route_ChangePassword_Response as Response,
};
