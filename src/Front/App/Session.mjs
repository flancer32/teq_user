/**
 * Session object for frontend realms. Contains data for authenticated user.
 */
export default class Fl32_Teq_User_Front_App_Session {
    constructor(spec) {
        const gateCurrent = spec.Fl32_Teq_User_Front_Gate_Current$;
        const gateSignOut = spec.Fl32_Teq_User_Front_Gate_SignOut$;
        /** @type {typeof Fl32_Teq_User_Shared_Service_Route_Current_Request} */
        const CurrentRequest = spec['Fl32_Teq_User_Shared_Service_Route_Current#Request'];
        const SignOutRequest = spec['Fl32_Teq_User_Shared_Service_Route_SignOut#Request'];
        /** @type {typeof Fl32_Teq_User_Shared_Service_Data_User} */
        const User = spec['Fl32_Teq_User_Shared_Service_Data_User#'];

        /** @type {Fl32_Teq_User_Shared_Service_Data_User} */
        let user = null;
        /** @type {String} route to redirect after authentication  */
        let routeToRedirect = null;
        /** @type {String} route to authentication form */
        let routeToSignIn = null;

        this.close = async function () {
            const req = new SignOutRequest();
            /** @type {Fl32_Teq_User_Shared_Service_Route_SignOut_Response} */
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
         * @return {Fl32_Teq_User_Shared_Service_Data_User}
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

        this.setRouteToRedirect = function (route) {
            routeToRedirect = route;
        };

        this.setRouteToSignIn = function (route) {
            routeToSignIn = route;
        };
    }

}
