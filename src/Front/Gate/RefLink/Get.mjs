/**
 * Frontend gate to 'Get Referral Link' service.
 *
 * @namespace Fl32_Teq_User_Front_Gate_RefLink_Get
 */
// MODULE'S VARS
const NS = 'Fl32_Teq_User_Front_Gate_RefLink_Get';

/**
 * Factory to create frontend gate.
 */
function Factory(spec) {
    /** @type {Fl32_Teq_User_Defaults} */
    const DEF = spec['Fl32_Teq_User_Defaults$'];    // singleton
    /** @type {TeqFw_Http2_Front_Gate_Connect} */
    const backConnect = spec['TeqFw_Http2_Front_Gate_Connect$']; // singleton
    /** @type {Fl32_Teq_User_Shared_Service_Route_RefLink_Get.Factory} */
    const factRoute = spec['Fl32_Teq_User_Shared_Service_Route_RefLink_Get#Factory$']; // singleton

    // DEFINE INNER FUNCTIONS
    /**
     * @param {Fl32_Teq_User_Shared_Service_Route_RefLink_Get.Request} data
     * @returns {Promise<Fl32_Teq_User_Shared_Service_Route_RefLink_Get.Response|boolean>}
     * @memberOf Fl32_Teq_User_Front_Gate_RefLink_Get
     */
    async function gate(data) {
        let result = false;
        const res = await backConnect.send(data, DEF.BACK_REALM, DEF.SERV_REF_LINK_GET);
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
