/**
 * Factory to create frontend gate to 'current' service (get info about currently authenticated user).
 * Use as spec['Fl32_Teq_User_Front_Gate_Current$'].
 * @namespace Fl32_Teq_User_Front_Gate_Current
 */
export default function Fl32_Teq_User_Front_Gate_Current(spec) {
    /** @type {Fl32_Teq_User_Defaults} */
    const DEF = spec['Fl32_Teq_User_Defaults$'];    // instance singleton
    /** @type {TeqFw_Core_App_Front_Gate_Connect} */
    const backConnect = spec['TeqFw_Core_App_Front_Gate_Connect$']; // instance singleton
    /** @type {typeof Fl32_Teq_User_Shared_Service_Route_Current_Response} */
    const Response = spec['Fl32_Teq_User_Shared_Service_Route_Current#Response']; // class constructor

    /**
     * @param {Fl32_Teq_User_Shared_Service_Route_Current_Request} data
     * @returns {Promise<Fl32_Teq_User_Shared_Service_Route_Current_Response|Boolean>}
     * @memberOf Fl32_Teq_User_Front_Gate_Current
     */
    async function gate(data) {
        let result = false;
        const res = await backConnect.send(data, DEF.BACK_REALM, DEF.SERV_CURRENT);
        if (res) {
            result = Object.assign(new Response(), res);
        }
        return result;
    }

    // COMPOSE RESULT
    Object.defineProperty(gate, 'name', {value: 'Fl32_Teq_User_Front_Gate_Current.gate'});
    return gate;
}
