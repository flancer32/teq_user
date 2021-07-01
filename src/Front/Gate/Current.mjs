/**
 * Factory to create frontend gate to 'current' service (get info about currently authenticated user).
 * Use as spec['Fl32_Teq_User_Front_Gate_Current$'].
 * @namespace Fl32_Teq_User_Front_Gate_Current
 */
// MODULE'S VARS
const NS = 'Fl32_Teq_User_Front_Gate_Current';

/**
 * Factory to create frontend gate.
 * @return function(Fl32_Teq_User_Shared_Service_Route_Current.Request): boolean
 * @memberOf Fl32_Teq_User_Front_Gate_Current
 */
function Factory(spec) {
    /** @type {Fl32_Teq_User_Back_Defaults} */
    const DEF = spec['Fl32_Teq_User_Back_Defaults$'];    // singleton
    /** @type {TeqFw_Http2_Front_Gate_Connect} */
    const backConnect = spec['TeqFw_Http2_Front_Gate_Connect$']; // singleton
    /** @type {Fl32_Teq_User_Shared_Service_Route_Current.Factory} */
    const factRoute = spec['Fl32_Teq_User_Shared_Service_Route_Current#Factory$']; // singleton

    // DEFINE INNER FUNCTIONS
    /**
     * @param {Fl32_Teq_User_Shared_Service_Route_Current.Request} data
     * @returns {Promise<Fl32_Teq_User_Shared_Service_Route_Current.Response|Boolean>}
     * @memberOf Fl32_Teq_User_Front_Gate_Current
     */
    async function gate(data) {
        let result = false;
        const res = await backConnect.send(data, DEF.BACK_REALM, DEF.SERV_CURRENT);
        if (res) result = factRoute.createRes(res);
        return result;
    }

    // COMPOSE RESULT
    Object.defineProperty(gate, 'name', {value: `${NS}.${gate.name}`});
    return gate;
}

// MODULE'S EXPORT
Object.defineProperty(Factory, 'name', {value: `${NS}.${Factory.constructor.name}`});
export default Factory;
