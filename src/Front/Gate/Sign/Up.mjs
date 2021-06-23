/**
 * Factory to create frontend gate to 'signUp' service.
 * Use as "spec['Fl32_Teq_User_Front_Gate_Sign_Up$']".
 * @namespace Fl32_Teq_User_Front_Gate_Sign_Up
 */
/**
 * Factory to create frontend gate.
 * @return function(Fl32_Teq_User_Shared_Service_Route_Sign_Up.Request): boolean
 * @memberOf Fl32_Teq_User_Front_Gate_Sign_Up
 */
function Factory(spec) {
    /** @type {Fl32_Teq_User_Defaults} */
    const DEF = spec['Fl32_Teq_User_Defaults$'];    // singleton
    /** @type {TeqFw_Http2_Front_Gate_Connect} */
    const backConnect = spec['TeqFw_Http2_Front_Gate_Connect$']; // singleton
    /** @type {typeof Fl32_Teq_User_Shared_Service_Dto_User} */
    const User = spec['Fl32_Teq_User_Shared_Service_Dto_User#']; // class
    /** @type {Fl32_Teq_User_Shared_Service_Route_Sign_Up.Factory} */
    const factRoute = spec['Fl32_Teq_User_Shared_Service_Route_Sign_Up#Factory$']; // singleton

    /**
     * @param {Fl32_Teq_User_Shared_Service_Route_Sign_Up.Request} data
     * @returns {Promise<Fl32_Teq_User_Shared_Service_Route_Sign_Up.Response|boolean>}
     * @memberOf Fl32_Teq_User_Front_Gate_Sign_Up
     */
    async function gate(data) {
        let result = false;
        const res = await backConnect.send(data, DEF.BACK_REALM, DEF.SERV_SIGN_UP);
        if (res) result = factRoute.createRes(res);
        return result;
    }

    // COMPOSE RESULT
    Object.defineProperty(gate, 'name', {value: 'Fl32_Teq_User_Front_Gate_Sign_Up.gate'});
    return gate;
}

// MODULE'S EXPORT
Object.defineProperty(Factory, 'name', {value: `${NS}.${Factory.constructor.name}`});
export default Factory;
