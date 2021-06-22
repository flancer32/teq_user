/**
 * Session object for frontend areas. Contains data for authenticated user.
 * @deprecated replaced with Fl32_Teq_User_Front_Model_Session
 */
export default class Fl32_Teq_User_Front_App_Session {
    constructor(spec) {
        /** @type {Fl32_Teq_User_Front_Gate_Current.gate} */
        const gateCurrent = spec['Fl32_Teq_User_Front_Gate_Current$']; // singleton
        /** @type {Fl32_Teq_User_Front_Gate_Sign_Out.gate} */
        const gateSignOut = spec['Fl32_Teq_User_Front_Gate_Sign_Out$']; // singleton
        /** @type {Fl32_Teq_User_Shared_Service_Route_Current.Factory} */
        const fCurrent = spec['Fl32_Teq_User_Shared_Service_Route_Current#Factory$']; // singleton
        /** @type {Fl32_Teq_User_Shared_Service_Route_Sign_Out.Factory} */
        const fSignOut = spec['Fl32_Teq_User_Shared_Service_Route_Sign_Out#Factory$']; // singleton
        /** @type {typeof Fl32_Teq_User_Shared_Service_Dto_User} */
        const DUser = spec['Fl32_Teq_User_Shared_Service_Dto_User#']; // class

        /** @type {Fl32_Teq_User_Shared_Service_Dto_User} */
        let user = null;
        /** @type {String} route to redirect after authentication  */
        let routeToRedirect = null;
        /** @type {String} route to authentication form */
        let routeToSignIn = null;

        this.close = async function () {
            const req = fSignOut.createReq();
            /** @type {Fl32_Teq_User_Shared_Service_Route_Sign_Out.Response} */
            const res = await gateSignOut(req);
            if (res) {
                user = null;
            }
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
            const req = fCurrent.createReq();
            /** @type {Fl32_Teq_User_Shared_Service_Route_Current.Response} */
            const res = await gateCurrent(req);
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
