/**
 * Factory to create frontend gate to 'changePassword' service.
 * Use as spec['Fl32_Teq_User_Front_Gate_ChangePassword$'].
 * @namespace Fl32_Teq_User_Front_Gate_ChangePassword
 */
// MODULE'S VARS
const NS = 'Fl32_Teq_User_Front_Gate_ChangePassword';

/**
 * Factory to create frontend gate.
 * @return function(Fl32_Teq_User_Shared_Service_Route_ChangePassword.Request): boolean
 * @memberOf Fl32_Teq_User_Front_Gate_ChangePassword
 */
function Factory(spec) {
    /** @type {Fl32_Teq_User_Back_Defaults} */
    const DEF = spec['Fl32_Teq_User_Back_Defaults$'];    // singleton
    /** @type {TeqFw_Http2_Front_Gate_Connect} */
    const backConnect = spec['TeqFw_Http2_Front_Gate_Connect$']; // singleton
    /** @type {Fl32_Teq_User_Shared_Service_Route_ChangePassword.Factory} */
    const factRoute = spec['Fl32_Teq_User_Shared_Service_Route_ChangePassword#Factory$']; // singleton

    /**
     * @param {Fl32_Teq_User_Shared_Service_Route_ChangePassword.Request} data
     * @returns {Promise<Fl32_Teq_User_Shared_Service_Route_ChangePassword.Response|boolean>}
     * @memberOf Fl32_Teq_User_Front_Gate_ChangePassword
     */
    async function gate(data) {
        let result = false;
        const res = await backConnect.send(data, DEF.BACK_REALM, DEF.SERV_CHANGE_PASSWORD);
        if (res) result = factRoute.createRes(res);
        return result;
    }

    // COMPOSE RESULT
    Object.defineProperty(gate, 'name', {value: 'Fl32_Teq_User_Front_Gate_ChangePassword.gate'});
    return gate;
}

// MODULE'S EXPORT
Object.defineProperty(Factory, 'name', {value: `${NS}.${Factory.constructor.name}`});
export default Factory;
