/**
 * Factory to create frontend gate to 'signIn' service.
 * Use as "spec['Fl32_Teq_User_Front_Gate_Sign_In$']".
 * @namespace Fl32_Teq_User_Front_Gate_Sign_In
 */
function Fl32_Teq_User_Front_Gate_Sign_In(spec) {
    /** @type {Fl32_Teq_User_Defaults} */
    const DEF = spec['Fl32_Teq_User_Defaults$'];    // instance singleton
    /** @type {TeqFw_Core_App_Front_Gate_Connect} */
    const backConnect = spec['TeqFw_Core_App_Front_Gate_Connect$']; // instance singleton
    /** @type {typeof Fl32_Teq_User_Shared_Service_Route_Sign_In.Response} */
    const Response = spec['Fl32_Teq_User_Shared_Service_Route_Sign_In#Response']; // class

    /**
     * @param {Fl32_Teq_User_Shared_Service_Route_Sign_In.Request} data
     * @returns {Promise<Fl32_Teq_User_Shared_Service_Route_Sign_In.Response|TeqFw_Core_App_Front_Gate_Response_Error>}
     * @memberOf Fl32_Teq_User_Front_Gate_Sign_In
     */
    async function gate(data) {
        let result = false;
        const res = await backConnect.send(data, DEF.BACK_REALM, DEF.SERV_SIGN_IN);
        if (res) {
            result = Object.assign(new Response(), res);
        }
        return result;
    }

    // COMPOSE RESULT
    Object.defineProperty(gate, 'name', {value: 'Fl32_Teq_User_Front_Gate_Sign_In.gate'});
    return gate;
}

export default Fl32_Teq_User_Front_Gate_Sign_In;
