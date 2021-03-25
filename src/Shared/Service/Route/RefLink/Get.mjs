/**
 * Request and response for 'Get Referral Link' service.
 */
class Fl32_Teq_User_Shared_Service_Route_RefLink_Get_Request {
    /** @type {String} */
    code;
}

class Fl32_Teq_User_Shared_Service_Route_RefLink_Get_Response {
    /** @type {Date} */
    dateExpired;
    /** @type {Fl32_Teq_User_Shared_Api_Data_User} */
    parent;
}

export {
    Fl32_Teq_User_Shared_Service_Route_RefLink_Get_Request as Request,
    Fl32_Teq_User_Shared_Service_Route_RefLink_Get_Response as Response,
};