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
    // EXTRACT DEPS
    /** @type {TeqFw_Web_Front_Service_Gate} */
    const serviceGate = spec['TeqFw_Web_Front_Service_Gate$'];
    /** @type {Fl32_Teq_User_Shared_Service_Route_Current.Factory} */
    const fRoute = spec['Fl32_Teq_User_Shared_Service_Route_Current#Factory$'];

    // DEFINE INNER FUNCTIONS
    /**
     * @param {Fl32_Teq_User_Shared_Service_Route_Current.Request} data
     * @returns {Promise<Fl32_Teq_User_Shared_Service_Route_Current.Response|Boolean>}
     * @memberOf Fl32_Teq_User_Front_Gate_Current
     */
    async function gate(data) {
        return await serviceGate.send(data, fRoute);
    }

    // COMPOSE RESULT
    Object.defineProperty(gate, 'name', {value: `${NS}.${gate.name}`});
    return gate;
}

// MODULE'S EXPORT
Object.defineProperty(Factory, 'name', {value: `${NS}.${Factory.constructor.name}`});
export default Factory;
