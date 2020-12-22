/**
 * Frontend gate to 'register' service.
 */
export default function (spec) {
    const config = spec.config;
    /** @type {typeof Fl32_Teq_User_Shared_Service_Data_User} */
    const User = spec['Fl32_Teq_User_Shared_Service_Data_User#'];
    /** @type {typeof Fl32_Teq_User_Shared_Service_Route_Register_Response} */
    const Response = spec['Fl32_Teq_User_Shared_Service_Route_Register#Response'];

    // TODO: we need to map gate to APU URI
    const URL = `https://${config.web.urlBase}/api/user/register`;

    /**
     * We should place function separately to allow JSDoc & IDEA hints & navigation.
     *
     * @param {Fl32_Teq_User_Shared_Service_Route_Register_Request} data
     * @return {Promise<Fl32_Teq_User_Shared_Service_Route_Register_Response>}
     * @exports Fl32_Teq_User_Shared_Service_Gate_Register
     */
    async function Fl32_Teq_User_Shared_Service_Gate_Register(data) {
        const res = await fetch(URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({data})
        });
        const json = await res.json();
        /** @type {Fl32_Teq_User_Shared_Service_Route_Register_Response} */
        const result = new Response();
        result.user = Object.assign(new User, json.data.user);
        return result;
    }

    return Fl32_Teq_User_Shared_Service_Gate_Register;
}
