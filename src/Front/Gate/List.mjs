/**
 * Factory to create frontend gate to 'list' service.
 * Use as spec['Fl32_Teq_User_Front_Gate_List$'].
 * @namespace Fl32_Teq_User_Front_Gate_List
 */
// MODULE'S VARS
const NS = 'Fl32_Teq_User_Front_Gate_List';

/**
 * Factory to create frontend gate.
 * @return function(Fl32_Teq_User_Shared_Service_Route_List.Request): boolean
 * @memberOf Fl32_Teq_User_Front_Gate_List
 */
function Factory(spec) {
    /** @type {Fl32_Teq_User_Defaults} */
    const DEF = spec['Fl32_Teq_User_Defaults$'];    // singleton
    /** @type {TeqFw_Http2_Front_Gate_Connect} */
    const backConnect = spec['TeqFw_Http2_Front_Gate_Connect$']; // singleton
    /** @type {Fl32_Teq_User_Shared_Service_Route_List.Factory} */
    const factRoute = spec['Fl32_Teq_User_Shared_Service_Route_List#Factory$']; // singleton

    /**
     * @param {Fl32_Teq_User_Shared_Service_Route_List.Request} data
     * @returns {Promise<Fl32_Teq_User_Shared_Service_Route_List.Response|TeqFw_Http2_Front_Gate_Response_Error>}
     * @memberOf Fl32_Teq_User_Front_Gate_List
     */
    async function gate(data) {
        let result = false;
        const res = await backConnect.send(data, DEF.BACK_REALM, DEF.SERV_LIST);
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
