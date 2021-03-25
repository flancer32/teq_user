/**
 * Factory to create frontend gate to 'list' service.
 * Use as spec['Fl32_Teq_User_Front_Gate_List$'].
 * @namespace Fl32_Teq_User_Front_Gate_List
 */
export default function Fl32_Teq_User_Front_Gate_List(spec) {
    /** @type {Fl32_Teq_User_Defaults} */
    const DEF = spec['Fl32_Teq_User_Defaults$'];    // instance singleton
    /** @type {TeqFw_Core_App_Front_Gate_Connect} */
    const backConnect = spec['TeqFw_Core_App_Front_Gate_Connect$']; // instance singleton
    /** @type {typeof Fl32_Teq_User_Shared_Api_Data_User} */
    const User = spec['Fl32_Teq_User_Shared_Api_Data_User#']; // class constructor
    /** @type {typeof Fl32_Teq_User_Shared_Service_Route_List_Response} */
    const Response = spec['Fl32_Teq_User_Shared_Service_Route_List#Response']; // class constructor

    /**
     * @param {Fl32_Teq_User_Shared_Service_Route_List_Request} data
     * @returns {Promise<Fl32_Teq_User_Shared_Service_Route_List_Response|TeqFw_Core_App_Front_Gate_Response_Error>}
     * @memberOf Fl32_Teq_User_Front_Gate_List
     */
    async function gate(data) {
        let result = false;
        const res = await backConnect.send(data, DEF.BACK_REALM, DEF.SERV_LIST);
        if (res && res.items) {
            result = new Response();
            result.items = {};
            for (const one of Object.values(res.items)) {
                /** @type {Fl32_Teq_User_Shared_Api_Data_User} */
                const item = Object.assign(new User, one);
                result.items[item.id] = item;
            }
        }
        return result;
    }

    // COMPOSE RESULT
    Object.defineProperty(gate, 'name', {value: 'Fl32_Teq_User_Front_Gate_List.gate'});
    return gate;
}
