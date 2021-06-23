/**
 * Frontend gate to 'signIn' service.
 *
 * @namespace Fl32_Teq_User_Front_Gate_Sign_In
 */
// MODULE'S VARS
const NS = 'Fl32_Teq_User_Front_Gate_Sign_In';

/**
 * Factory to create frontend gate.
 * @return function(Fl32_Teq_User_Shared_Service_Route_Sign_In.Request): boolean
 * @memberOf Fl32_Teq_User_Front_Gate_Sign_In
 */
function Factory(spec) {
    /** @type {Fl32_Teq_User_Defaults} */
    const DEF = spec['Fl32_Teq_User_Defaults$'];    // singleton
    /** @type {TeqFw_Http2_Front_Gate_Connect} */
    const backConnect = spec['TeqFw_Http2_Front_Gate_Connect$']; // singleton
    /** @type {Fl32_Teq_User_Shared_Service_Route_Sign_In.Factory} */
    const factRoute = spec['Fl32_Teq_User_Shared_Service_Route_Sign_In#Factory$']; // singleton

    // DEFINE INNER FUNCTIONS
    /**
     * @param {Fl32_Teq_User_Shared_Service_Route_Sign_In.Request} data
     * @returns {Promise<Fl32_Teq_User_Shared_Service_Route_Sign_In.Response|boolean>}
     * @memberOf Fl32_Teq_User_Front_Gate_Sign_In
     */
    async function gate(data) {
        let result = false;
        const res = await backConnect.send(data, DEF.BACK_REALM, DEF.SERV_SIGN_IN);
        if (res) result = factRoute.createRes(res);
        return result;
    }

    // COMPOSE RESULT
    Object.defineProperty(gate, 'name', {value: 'Fl32_Teq_User_Front_Gate_Sign_In.gate'});
    return gate;
}

// MODULE'S EXPORT
Object.defineProperty(Factory, 'name', {value: `${NS}.${Factory.name}`});
export default Factory;
