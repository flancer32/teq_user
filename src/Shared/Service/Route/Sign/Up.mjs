/**
 * Request and response for 'Sign Up' service.
 *
 * Required fields:
 *  - login
 *  - name
 *  - password
 *  - referralCode
 *
 */
class Fl32_Teq_User_Shared_Service_Route_Sign_Up_Request {
    /** @type {String} */
    email;
    /** @type {String} */
    login;
    /** @type {String} */
    name;
    /** @type {String} */
    password;
    /** @type {String} */
    phone;
    /** @type {String} */
    referralCode;
}

class Fl32_Teq_User_Shared_Service_Route_Sign_Up_Response {
    /** @type {Fl32_Teq_User_Shared_Api_Data_User} */
    user;
}

export {
    Fl32_Teq_User_Shared_Service_Route_Sign_Up_Request as Request,
    Fl32_Teq_User_Shared_Service_Route_Sign_Up_Response as Response,
};
