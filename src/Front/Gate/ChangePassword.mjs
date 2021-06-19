/**
 * Factory to create frontend gate to 'changePassword' service.
 * Use as spec['Fl32_Teq_User_Front_Gate_ChangePassword$'].
 * @namespace Fl32_Teq_User_Front_Gate_ChangePassword
 */
export default function Fl32_Teq_User_Front_Gate_ChangePassword(spec) {
    /** @type {Fl32_Teq_User_Defaults} */
    const DEF = spec['Fl32_Teq_User_Defaults$'];    // instance singleton
    /** @type {TeqFw_Core_App_Front_Gate_Connect} */
    const backConnect = spec['TeqFw_Core_App_Front_Gate_Connect$']; // instance singleton
    /** @type {typeof Fl32_Teq_User_Shared_Service_Route_ChangePassword.Response} */
    const Response = spec['Fl32_Teq_User_Shared_Service_Route_ChangePassword#Response']; // class

    /**
     * @param {Fl32_Teq_User_Shared_Service_Route_ChangePassword.Request} data
     * @returns {Promise<Fl32_Teq_User_Shared_Service_Route_ChangePassword.Response|TeqFw_Core_App_Front_Gate_Response_Error>}
     * @memberOf Fl32_Teq_User_Front_Gate_ChangePassword
     */
    async function gate(data) {
        let result = false;
        const res = await backConnect.send(data, DEF.BACK_REALM, DEF.SERV_CHANGE_PASSWORD);
        if (res) {
            result = Object.assign(new Response(), res);
        }
        return result;
    }

    // COMPOSE RESULT
    Object.defineProperty(gate, 'name', {value: 'Fl32_Teq_User_Front_Gate_ChangePassword.gate'});
    return gate;
}
