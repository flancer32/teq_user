/**
 * Frontend gate to 'Create Referral Link' service.
 *
 * @namespace Fl32_Teq_User_Front_Gate_RefLink_Create
 */
// MODULE'S VARS
const NS = 'Fl32_Teq_User_Front_Gate_RefLink_Create';

/**
 * Factory to create frontend gate.
 */
function Factory(spec) {
    /** @type {Fl32_Teq_User_Defaults} */
    const DEF = spec['Fl32_Teq_User_Defaults$'];    // instance singleton
    /** @type {TeqFw_Core_App_Front_Gate_Connect} */
    const backConnect = spec['TeqFw_Core_App_Front_Gate_Connect$']; // instance singleton
    /** @type {typeof Fl32_Teq_User_Shared_Service_Route_RefLink_Create_Response} */
    const Response = spec['Fl32_Teq_User_Shared_Service_Route_RefLink_Create#Response']; // class

    /**
     * @param {Fl32_Teq_User_Shared_Service_Route_RefLink_Create_Request} data
     * @returns {Promise<Fl32_Teq_User_Shared_Service_Route_RefLink_Create_Response|TeqFw_Core_App_Front_Gate_Response_Error>}
     * @memberOf Fl32_Teq_User_Front_Gate_RefLink_Create
     */
    async function gate(data) {
        let result = false;
        const res = await backConnect.send(data, DEF.BACK_REALM, DEF.SERV_REF_LINK_CREATE);
        if (res) {
            result = Object.assign(new Response(), res);
        }
        return result;
    }

    // COMPOSE RESULT
    Object.defineProperty(gate, 'name', {value: `${NS}.${gate.name}`});
    return gate;
}

// MODULE'S FUNCTIONALITY
Object.defineProperty(Factory, 'name', {value: `${NS}.${Factory.name}`});

// MODULE'S EXPORT
export default Factory;
