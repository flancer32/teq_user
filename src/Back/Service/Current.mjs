/**
 * Get profile for currently authenticated user.
 *
 * @namespace Fl32_Teq_User_Back_Service_Current
 */
// MODULE'S VARS
const NS = 'Fl32_Teq_User_Back_Service_Current';

/**
 * @implements TeqFw_Web_Back_Api_Service_IFactory
 */
export default class Fl32_Teq_User_Back_Service_Current {

    constructor(spec) {
        /** @type {Fl32_Teq_User_Back_Defaults} */
        const DEF = spec['Fl32_Teq_User_Back_Defaults$'];
        /** @type {Fl32_Teq_User_Shared_Service_Route_Current.Factory} */
        const route = spec['Fl32_Teq_User_Shared_Service_Route_Current#Factory$'];

        // DEFINE INSTANCE METHODS
        this.getRouteFactory = () => route;

        this.getService = function () {
            // DEFINE INNER FUNCTIONS
            /**
             * @param {TeqFw_Web_Back_Api_Service_Context} context
             * @return Promise<void>
             */
            async function service(context) {
                /** @type {Fl32_Teq_User_Shared_Service_Route_Current.Response} */
                const out = context.getOutData();
                const sharedCtx = context.getHandlersShare();
                if (sharedCtx && sharedCtx[DEF.HTTP_SHARE_CTX_USER]) {
                    out.user = sharedCtx[DEF.HTTP_SHARE_CTX_USER];
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
