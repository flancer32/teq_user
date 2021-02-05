/**
 * Frontend gate to 'signIn' service.
 */
export default function (spec) {
    const config = spec.config;
    /** @type {typeof Fl32_Teq_User_Shared_Service_Route_SignIn_Response} */
    const Response = spec['Fl32_Teq_User_Shared_Service_Route_SignIn#Response']; // class constructor
    /** @type {typeof TeqFw_Core_App_Front_Gate_Response_Error} */
    const GateError = spec['TeqFw_Core_App_Front_Gate_Response_Error#'];    // class constructor

    // TODO: we need to map gate to API URI
    const URL = `https://${config.urlBase}/api/user/signIn`;

    /**
     * We should place function separately to allow JSDoc & IDEA hints & navigation.
     *
     * @param {Fl32_Teq_User_Shared_Service_Route_SignIn_Request} data
     * @return {Promise<Fl32_Teq_User_Shared_Service_Route_SignIn_Response|TeqFw_Core_App_Front_Gate_Response_Error>}
     * @exports Fl32_Teq_User_Front_Gate_SignIn
     */
    async function Fl32_Teq_User_Front_Gate_SignIn(data) {
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
                /** @type {Fl32_Teq_User_Shared_Service_Route_SignIn_Response} */
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

    return Fl32_Teq_User_Front_Gate_SignIn;
}
