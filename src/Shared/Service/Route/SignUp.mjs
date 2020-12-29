/**
 * Request and response for 'signUp' service.
 *
 * Required fields:
 *  - login
 *  - password
 *  - name
 *
 */
class Fl32_Teq_User_Shared_Service_Route_SignUp_Request {
    /** @type {String} */
    email
    /** @type {String} */
    login
    /** @type {String} */
    name
    /** @type {String} */
    password
    /** @type {String} */
    phone
}

class Fl32_Teq_User_Shared_Service_Route_SignUp_Response {
    /** @type {Fl32_Teq_User_Shared_Service_Data_User} */
    user
}

export {
    Fl32_Teq_User_Shared_Service_Route_SignUp_Request as Request,
    Fl32_Teq_User_Shared_Service_Route_SignUp_Response as Response,
};