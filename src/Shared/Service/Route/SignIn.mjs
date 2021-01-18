/**
 * Request and response for 'Sign In' service.
 */
class Fl32_Teq_User_Shared_Service_Route_SignIn_Request {
    /** @type {String} user identity - login/email/phone */
    user
    /** @type {String} plain password */
    password
}

class Fl32_Teq_User_Shared_Service_Route_SignIn_Response {
    /** @type {String} */
    sessionId
}

export {
    Fl32_Teq_User_Shared_Service_Route_SignIn_Request as Request,
    Fl32_Teq_User_Shared_Service_Route_SignIn_Response as Response,
};
