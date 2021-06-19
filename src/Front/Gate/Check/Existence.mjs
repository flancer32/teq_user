/**
 * Factory to create frontend gate to 'Check Existence' service.
 * Use as "spec['Fl32_Teq_User_Front_Gate_Check_Existence$']".
 * @namespace Fl32_Teq_User_Front_Gate_Check_Existence
 */
function Fl32_Teq_User_Front_Gate_Check_Existence(spec) {
    /** @type {Fl32_Teq_User_Defaults} */
    const DEF = spec['Fl32_Teq_User_Defaults$'];    // instance singleton
    /** @type {TeqFw_Core_App_Front_Gate_Connect} */
    const backConnect = spec['TeqFw_Core_App_Front_Gate_Connect$']; // instance singleton
    /** @type {Fl32_Teq_User_Shared_Service_Route_Check_Existence.Factory} */
    const factRoute = spec['Fl32_Teq_User_Shared_Service_Route_Check_Existence#Factory$']; // singleton


    /**
     * @param {Fl32_Teq_User_Shared_Service_Route_Check_Existence.Request} data
     * @returns {Promise<Fl32_Teq_User_Shared_Service_Route_Check_Existence.Response|boolean>}
     * @memberOf Fl32_Teq_User_Front_Gate_Check_Existence
     */
    async function gate(data) {
        let result = false;
        const res = await backConnect.send(data, DEF.BACK_REALM, DEF.SERV_CHECK_EXISTENCE);
        if (res) result = factRoute.createRes(res);
        return result;
    }

    // COMPOSE RESULT
    Object.defineProperty(gate, 'name', {value: 'Fl32_Teq_User_Front_Gate_Check_Existence.gate'});
    return gate;
}

// We should place function separately to allow JSDoc & IDEA hints & navigation.
export default Fl32_Teq_User_Front_Gate_Check_Existence;
