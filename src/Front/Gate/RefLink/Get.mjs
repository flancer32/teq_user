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
    const DEF = spec['Fl32_Teq_User_Defaults$'];    // instance singleton
    /** @type {TeqFw_Core_App_Front_Gate_Connect} */
    const backConnect = spec['TeqFw_Core_App_Front_Gate_Connect$']; // instance singleton
    /** @type {typeof Fl32_Teq_User_Shared_Service_Route_RefLink_Get_Response} */
    const Response = spec['Fl32_Teq_User_Shared_Service_Route_RefLink_Get#Response']; // class
    /** @type {typeof Fl32_Teq_User_Shared_Api_Data_User} */
    const DUser = spec['Fl32_Teq_User_Shared_Api_Data_User#']; // class
    /** @type {typeof Fl32_Teq_User_Shared_Api_Data_RefLink} */
    const DRefLink = spec['Fl32_Teq_User_Shared_Api_Data_RefLink#']; // class
    /**
     * @param {Fl32_Teq_User_Shared_Service_Route_RefLink_Get_Request} data
     * @returns {Promise<Fl32_Teq_User_Shared_Service_Route_RefLink_Get_Response|TeqFw_Core_App_Front_Gate_Response_Error>}
     * @memberOf Fl32_Teq_User_Front_Gate_RefLink_Get
     */
    async function gate(data) {
        let result = false;
        const res = await backConnect.send(data, DEF.BACK_REALM, DEF.SERV_REF_LINK_GET);
        if (res) {
            result = Object.assign(new Response(), res);
            result.link = Object.assign(new DRefLink(), result.link);
            result.link.dateExpired = new Date(result.link.dateExpired);
            result.link.parent = Object.assign(new DUser(), result.link.parent);
            result.link.parent.dateCreated = new Date(result.link.parent.dateCreated);
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
