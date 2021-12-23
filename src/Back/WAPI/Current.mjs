/**
 * Get profile for currently authenticated user.
 *
 * @namespace Fl32_Teq_User_Back_WAPI_Current
 */
// MODULE'S VARS
const NS = 'Fl32_Teq_User_Back_WAPI_Current';

/**
 * @implements TeqFw_Web_Back_Api_WAPI_IFactory
 */
export default class Fl32_Teq_User_Back_WAPI_Current {

    constructor(spec) {
        /** @type {Fl32_Teq_User_Back_Defaults} */
        const DEF = spec['Fl32_Teq_User_Back_Defaults$'];
        /** @type {Fl32_Teq_User_Shared_WAPI_Current.Factory} */
        const route = spec['Fl32_Teq_User_Shared_WAPI_Current#Factory$'];

        // DEFINE INSTANCE METHODS
        this.getRouteFactory = () => route;

        this.getService = function () {
            // DEFINE INNER FUNCTIONS
            /**
             * @param {TeqFw_Web_Back_Handler_WAPI_Context} context
             * @return Promise<void>
             */
            async function service(context) {
                /** @type {Fl32_Teq_User_Shared_WAPI_Current.Response} */
                const out = context.getOutData();
                const share = context.getHandlersShare();
                if (share.get(DEF.SHARE_USER)) {
                    out.user = share.get(DEF.SHARE_USER);
                } else {
                    out.user = null;
                }
            }

            // MAIN FUNCTIONALITY
            Object.defineProperty(service, 'name', {value: `${NS}.${service.name}`});
            return service;
        }
    }

}
