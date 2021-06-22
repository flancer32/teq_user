/**
 * User session model for frontend realms.
 */
export default class Fl32_Teq_User_Front_Model_Session {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {Fl32_Bwl_Defaults} */
        const DEF = spec['Fl32_Bwl_Defaults$'];
        const {reactive} = spec[DEF.MOD_VUE.DI_VUE]; // singleton destructuring
        /** @type {Fl32_Teq_User_Front_Dto_User.Factory} */
        const fUser = spec['Fl32_Teq_User_Front_Dto_User#Factory$']; // singleton
        /** @type {Function|Fl32_Teq_User_Front_Gate_Current.gate} */
        const gateCurrent = spec['Fl32_Teq_User_Front_Gate_Current$']; // singleton
        /** @type {Fl32_Teq_User_Shared_Service_Route_Current.Factory} */
        const fCurrent = spec['Fl32_Teq_User_Shared_Service_Route_Current#Factory$']; // singleton

        // DEFINE WORKING VARS
        /** @type {Fl32_Teq_User_Front_Dto_User} */
        let modelData = reactive(fUser.create());
        /** @type {String} route to redirect after authentication  */
        let routeToRedirect = null;
        /** @type {String} route to authentication form */
        let routeToSignIn = null;

        // DEFINE INSTANCE METHODS
        /**
         * Return model data as reactive DTO.
         *
         * @return {Fl32_Teq_User_Front_Dto_User}
         */
        this.getData = function () {
            return modelData;
        }

        this.getRouteToRedirect = function () {
            return routeToRedirect ?? '/';
        };

        /**
         * Request user data from the server.
         * @return {Promise<void>}
         */
        this.init = async function () {
            const req = fCurrent.createReq();
            /** @type {Fl32_Teq_User_Shared_Service_Route_Current.Response} */
            const res = await gateCurrent(req);
            this.parseDataSource(res);
        };

        /**
         * Convert service response DTO to model DTO and make it reactive.
         *
         * @param {Fl32_Teq_User_Shared_Service_Route_Current.Response} data
         */
        this.parseDataSource = function (data) {
            if (data.user) {
                modelData.id = data.user.id;
            } else {
                modelData.id = undefined;
            }
        }

        /**
         * Redirect to sign in route if user is not authenticated. Store current route before redirect.
         * @returns {Boolean} 'true' if user is authenticated.
         */
        this.checkUserAuthenticated = async function (router) {
            const result = (modelData.id > 0);
            if (!result) {
                debugger
                const routeCurrent = router?.currentRoute?.value?.path;
                this.setRouteToRedirect(routeCurrent);
                router.push(routeToSignIn);
            }
            return result;
        };

        this.setRouteToRedirect = function (route) {
            routeToRedirect = route;
        };

        this.setRouteToSignIn = function (route) {
            routeToSignIn = route;
        };

        // MAIN FUNCTIONALITY
    }
}