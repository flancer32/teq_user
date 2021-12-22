/**
 * Session object for frontend areas. Contains data for authenticated user.
 * @deprecated replaced with Fl32_Teq_User_Front_Model_Session
 */
export default class Fl32_Teq_User_Front_App_Session {
    constructor(spec) {
        /** @type {TeqFw_Web_Front_WAPI_Gate} */
        const gate = spec['TeqFw_Web_Front_WAPI_Gate$'];
        /** @type {typeof Fl32_Teq_User_Shared_Service_Dto_User} */
        const DUser = spec['Fl32_Teq_User_Shared_Service_Dto_User#'];
        /** @type {Fl32_Teq_User_Shared_Service_Route_Current.Factory} */
        const routeCurrent = spec['Fl32_Teq_User_Shared_Service_Route_Current#Factory$'];
        /** @type {Fl32_Teq_User_Shared_Service_Route_Sign_Out.Factory} */
        const routeSignOut = spec['Fl32_Teq_User_Shared_Service_Route_Sign_Out#Factory$'];

        /** @type {Fl32_Teq_User_Shared_Service_Dto_User} */
        let user = null;
        /** @type {String} route to redirect after authentication  */
        let routeToRedirect = null;
        /** @type {String} route to authentication form */
        let routeToSignIn = null;

        this.close = async function () {
            /** @type {Fl32_Teq_User_Shared_Service_Route_Sign_Out.Request} */
            const req = routeSignOut.createReq();
            // noinspection JSValidateTypes
            /** @type {Fl32_Teq_User_Shared_Service_Route_Sign_Out.Response} */
            const res = await gate.send(req, routeSignOut);
            if (res) user = null;
        };

        this.getRouteToRedirect = function () {
            return routeToRedirect ?? '/';
        };

        this.getRouteToSignIn = function () {
            return routeToSignIn ?? '/signIn';
        };

        /**
         * @returns {Fl32_Teq_User_Shared_Service_Dto_User}
         */
        this.getUser = function () {
            return user;
        };

        this.init = async function () {
            const req = routeCurrent.createReq();
            // noinspection JSValidateTypes
            /** @type {Fl32_Teq_User_Shared_Service_Route_Current.Response} */
            const res = await gate.send(req, routeCurrent);
            if (res.user) {
                user = Object.assign(new DUser(), res.user);
            }
        };

        /**
         * Redirect to sign in route in user is not authenticated. Store current route before redirect.
         * @returns {Boolean} 'true' if user is authenticated.
         */
        this.checkUserAuthenticated = async function (router) {
            const result = (user instanceof DUser);
            if (!result) {
                const routeCurrent = router.currentRoute.value.path;
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
    }

}
