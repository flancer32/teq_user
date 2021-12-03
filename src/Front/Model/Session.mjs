/**
 * User session model for frontend areas.
 */
export default class Fl32_Teq_User_Front_Model_Session {
    constructor(spec) {
        // EXTRACT DEPS
        const {reactive} = spec['TeqFw_Vue_Front_Lib_Vue'];
        /** @type {Fl32_Teq_User_Front_Dto_User.Factory} */
        const fUser = spec['Fl32_Teq_User_Front_Dto_User#Factory$'];
        /** @type {TeqFw_Web_Front_Service_Gate} */
        const gate = spec['TeqFw_Web_Front_Service_Gate$'];
        /** @type {Fl32_Teq_User_Shared_Service_Route_Current.Factory} */
        const routeCurrent = spec['Fl32_Teq_User_Shared_Service_Route_Current#Factory$'];

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
            /** @type {Fl32_Teq_User_Shared_Service_Route_Current.Request} */
            const req = routeCurrent.createReq();
            // noinspection JSValidateTypes
            /** @type {Fl32_Teq_User_Shared_Service_Route_Current.Response} */
            const res = await gate.send(req, routeCurrent);
            if (res) this.parseDataSource(res);
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
         *
         * Redirect to sign in route if user is not authenticated. Store current route before redirect.
         * @param router
         * @return {Promise<boolean>}
         */
        this.checkUserAuthenticated = async function (router) {
            const result = (modelData.id > 0);
            if (!result) {
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
