/**
 * State for User module functionality.
 *
 * @return {Object}
 * @constructor
 */
export default function Fl32_Teq_User_Front_State() {

    return {
        namespaced: true,
        state: {
            /** @type {Fl32_Teq_User_Shared_Service_Data_User|null} */
            authenticated: null,
        },
        mutations: {
            setAuthenticated(state, data) {
                state.authenticated = data;
            },
        },
    };
}
