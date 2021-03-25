/**
 * Request and response for 'List Users' service.
 *
 * This request should contain standard grid listing structure (filters, order, limit).
 *
 */
class Fl32_Teq_User_Shared_Service_Route_List_Request {
    // initial structure is empty, just return all data w/o filters/order/limit
    cond    // should be conditions structure here (filters/order/limit)
}

class Fl32_Teq_User_Shared_Service_Route_List_Response {
    /** @type {Object.<Number, Fl32_Teq_User_Shared_Api_Data_User>} */
    items
}

export {
    Fl32_Teq_User_Shared_Service_Route_List_Request as Request,
    Fl32_Teq_User_Shared_Service_Route_List_Response as Response,
};
