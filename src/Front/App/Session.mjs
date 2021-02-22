/**
 * Session object for frontend realms. Contains data for authenticated user.
 */
export default class Fl32_Teq_User_Front_App_Session {
    constructor(spec) {
        /** @type {Fl32_Teq_User_Front_Gate_Current.gate} */
        const gateCurrent = spec['Fl32_Teq_User_Front_Gate_Current$']; // function singleton
        /** @type {Fl32_Teq_User_Front_Gate_Sign_Out.gate} */
        const gateSignOut = spec['Fl32_Teq_User_Front_Gate_Sign_Out$']; // function singleton
        /** @type {typeof Fl32_Teq_User_Shared_Service_Route_Current_Request} */
        const CurrentRequest = spec['Fl32_Teq_User_Shared_Service_Route_Current#Request']; // class constructor
        /** @type {typeof Fl32_Teq_User_Shared_Service_Route_Sign_Out_Request} */
        const SignOutRequest = spec['Fl32_Teq_User_Shared_Service_Route_Sign_Out#Request']; // class constructor
        /** @type {typeof Fl32_Teq_User_Shared_Service_Data_User} */
        const User = spec['Fl32_Teq_User_Shared_Service_Data_User#']; // class constructor

        /** @type {Fl32_Teq_User_Shared_Service_Data_User} */
        let user = null;
        /** @type {String} route to redirect after authentication  */
        let routeToRedirect = null;
        /** @type {String} route to authentication form */
        let routeToSignIn = null;

        this.close = async function () {
            const req = new SignOutRequest();
            /** @type {Fl32_Teq_User_Shared_Service_Route_Sign_Out_Response} */
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
         * @returns {Fl32_Teq_User_Shared_Service_Data_User}
         */
        this.getUser = function () {
            return user;
        };

        this.init = async function () {
            const req = new CurrentRequest();
            /** @type {Fl32_Teq_User_Shared_Service_Route_Current_Response} */
            const res = await gateCurrent(req);
            if (res.user) {
                user = Object.assign(new User(), res.user);
            }
        };

        /**
         * Redirect to sign in route in user is not authenticated. Store current route before redirect.
         * @returns {Boolean} 'true' if user is authenticated.
         */
        this.checkUserAuthenticated = async function (router) {
            const result = (user instanceof User);
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
