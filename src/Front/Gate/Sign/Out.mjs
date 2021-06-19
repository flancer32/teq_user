/**
 * Factory to create frontend gate to 'signOut' service.
 * Use as "spec['Fl32_Teq_User_Front_Gate_Sign_Out$']".
 * @namespace Fl32_Teq_User_Front_Gate_Sign_Out
 */
// MODULE'S VARS
const NS = 'Fl32_Teq_User_Front_Gate_Sign_Out';

/**
 * Factory to create frontend gate.
 * @return function(Fl32_Ap_Shared_Service_Route_Profile_Get.Request): boolean
 * @memberOf Fl32_Teq_User_Front_Gate_Sign_Out
 */
function Factory(spec) {
    /** @type {Fl32_Teq_User_Defaults} */
    const DEF = spec['Fl32_Teq_User_Defaults$'];    // instance singleton
    /** @type {TeqFw_Core_App_Front_Gate_Connect} */
    const backConnect = spec['TeqFw_Core_App_Front_Gate_Connect$']; // instance singleton
    /** @type {Fl32_Teq_User_Shared_Service_Route_Sign_Out.Factory} */
    const factRoute = spec['Fl32_Teq_User_Shared_Service_Route_Sign_Out#Factory$']; // singleton

    // DEFINE INNER FUNCTIONS
    /**
     * @param {Fl32_Teq_User_Shared_Service_Route_Sign_Out.Request} data
     * @returns {Promise<Fl32_Teq_User_Shared_Service_Route_Sign_Out.Response|boolean>}
     * @memberOf Fl32_Teq_User_Front_Gate_Sign_Out
     */
    async function gate(data) {
        let result = false;
        const res = await backConnect.send(data, DEF.BACK_REALM, DEF.SERV_SIGN_OUT);
        if (res) result = factRoute.createRes(res);
        return result;
    }

    // COMPOSE RESULT
    Object.defineProperty(gate, 'name', {value: 'Fl32_Teq_User_Front_Gate_Sign_Out.gate'});
    return gate;
}

// MODULE'S EXPORT
Object.defineProperty(Factory, 'name', {value: `${NS}.${Factory.name}`});
export default Factory;
