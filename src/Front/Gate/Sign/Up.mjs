/**
 * Factory to create frontend gate to 'signUp' service.
 * Use as "spec['Fl32_Teq_User_Front_Gate_Sign_Up$']".
 * @namespace Fl32_Teq_User_Front_Gate_Sign_Up
 */
export default function Fl32_Teq_User_Front_Gate_Sign_Up(spec) {
    /** @type {Fl32_Teq_User_Defaults} */
    const DEF = spec['Fl32_Teq_User_Defaults$'];    // instance singleton
    /** @type {TeqFw_Core_App_Front_Gate_Connect} */
    const backConnect = spec['TeqFw_Core_App_Front_Gate_Connect$']; // instance singleton
    /** @type {typeof Fl32_Teq_User_Shared_Service_Dto_User} */
    const User = spec['Fl32_Teq_User_Shared_Service_Dto_User#']; // class
    /** @type {typeof Fl32_Teq_User_Shared_Service_Route_Sign_Up.Response} */
    const Response = spec['Fl32_Teq_User_Shared_Service_Route_Sign_Up#Response']; // class

    /**
     * @param {Fl32_Teq_User_Shared_Service_Route_Sign_Up.Request} data
     * @returns {Promise<Fl32_Teq_User_Shared_Service_Route_Sign_Up.Response|TeqFw_Core_App_Front_Gate_Response_Error>}
     * @memberOf Fl32_Teq_User_Front_Gate_Sign_Up
     */
    async function gate(data) {
        let result = false;
        const res = await backConnect.send(data, DEF.BACK_REALM, DEF.SERV_SIGN_UP);
        if (res && res.user) {
            result = new Response();
            result.user = Object.assign(new User, res.user);
        }
        return result;
    }

    // COMPOSE RESULT
    Object.defineProperty(gate, 'name', {value: 'Fl32_Teq_User_Front_Gate_Sign_Up.gate'});
    return gate;
}
