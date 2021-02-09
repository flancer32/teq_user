/**
 * Factory to create frontend gate to 'list' service.
 * Use as spec['Fl32_Teq_User_Front_Gate_List$'].
 * @namespace Fl32_Teq_User_Front_Gate_List
 */
export default function Fl32_Teq_User_Front_Gate_List (spec) {
    /** @type {Fl32_Teq_User_Defaults} */
    const DEF = spec['Fl32_Teq_User_Defaults$'];    // instance singleton
    /** @type {TeqFw_Core_App_Front_Data_Config} */
    const config = spec[DEF.MOD_CORE.DI_CONFIG];    // named singleton
    /** @type {typeof Fl32_Teq_User_Shared_Service_Data_User} */
    const User = spec['Fl32_Teq_User_Shared_Service_Data_User#']; // class constructor
    /** @type {typeof Fl32_Teq_User_Shared_Service_Route_List_Response} */
    const Response = spec['Fl32_Teq_User_Shared_Service_Route_List#Response']; // class constructor
    /** @type {typeof TeqFw_Core_App_Front_Gate_Response_Error} */
    const GateError = spec['TeqFw_Core_App_Front_Gate_Response_Error#'];    // class constructor

    // TODO: we need to map gate to API URI
    const URL = `https://${config.urlBase}/api/user${DEF.API_LIST}`;

    /**
     * @param {Fl32_Teq_User_Shared_Service_Route_List_Request} data
     * @return {Promise<Fl32_Teq_User_Shared_Service_Route_List_Response|TeqFw_Core_App_Front_Gate_Response_Error>}
     * @memberOf Fl32_Teq_User_Front_Gate_List
     */
    async function gate(data) {
        try {
            const res = await fetch(URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({data})
            });
            const json = await res.json();
            let result;
            if (json.data) {
                // normal result
                /** @type {Fl32_Teq_User_Shared_Service_Route_List_Response} */
                result = new Response();
                result.items = {};
                for (const one of Object.values(json.data.items)) {
                    /** @type {Fl32_Teq_User_Shared_Service_Data_User} */
                    const item = Object.assign(new User, one);
                    result.items[item.id] = item;
                }
            } else {
                // business error
                result = new GateError();
                result.message = 'Unknown business error.';
                if (json.error) {
                    result.error = Object.assign({}, json.error);
                    if (json.error.sqlMessage) result.message = json.error.sqlMessage;
                }

            }
            return result;
        } catch (e) {
            // infrastructure error
            const result = new GateError();
            result.error = Object.assign({}, e);
            if (e.message) result.message = e.message;
            return result;
        }
    }

    // COMPOSE RESULT
    Object.defineProperty(gate, 'name', {value: 'Fl32_Teq_User_Front_Gate_List.gate'});
    return gate;
}
