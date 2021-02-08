/**
 * Factory to create frontend gate to 'Check Existence' service.
 * Use as "spec['Fl32_Teq_User_Front_Gate_Check_Existence$']".
 * @namespace Fl32_Teq_User_Front_Gate_Check_Existence
 */
export default function Fl32_Teq_User_Front_Gate_Check_Existence(spec) {
    /** @type {Fl32_Teq_User_Defaults} */
    const DEF = spec['Fl32_Teq_User_Defaults$'];    // instance singleton
    /** @type {TeqFw_Core_App_Front_Data_Config} */
    const config = spec[DEF.MOD_CORE.DI_CONFIG];    // named singleton
    /** @type {typeof Fl32_Teq_User_Shared_Service_Route_Check_Existence_Response} */
    const Response = spec['Fl32_Teq_User_Shared_Service_Route_Check_Existence#Response']; // class constructor
    /** @type {typeof TeqFw_Core_App_Front_Gate_Response_Error} */
    const GateError = spec['TeqFw_Core_App_Front_Gate_Response_Error#'];    // class constructor

    // TODO: we need to map gate to API URI
    const URL = `https://${config.urlBase}/api/user${DEF.API_CHECK_EXISTENCE}`;

    /**
     * @param {Fl32_Teq_User_Shared_Service_Route_Check_Existence_Request} data
     * @return {Promise<Fl32_Teq_User_Shared_Service_Route_Check_Existence_Response|TeqFw_Core_App_Front_Gate_Response_Error>}
     * @memberOf Fl32_Teq_User_Front_Gate_Check_Existence
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
                /** @type {Fl32_Teq_User_Shared_Service_Route_Check_Existence_Response} */
                result = Object.assign(new Response(), json.data);
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
    Object.defineProperty(gate, 'name', {value: 'Fl32_Teq_User_Front_Gate_Check_Existence.gate'});
    return gate;
}
