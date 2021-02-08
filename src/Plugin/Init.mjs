/**
 * Class to integrate plugin into TeqFW application.
 */
export default class Fl32_Teq_User_Plugin_Init {

    constructor(spec) {
        /** @type {Fl32_Teq_User_Defaults} */
        const DEF = spec['Fl32_Teq_User_Defaults$'];    // instance singleton

        this.getCommands = function () {
            return [];
        };

        this.getHttp2StaticMaps = function () {
            return {};
        };

        this.getHttp2BackRealm = function () {
            return DEF.BACK_REALM;
        };

        this.getHttp2Services = function () {
            return [
                'Fl32_Teq_User_Back_Service_Current$',
                'Fl32_Teq_User_Back_Service_Sign_In$',
                'Fl32_Teq_User_Back_Service_Sign_Out$',
            ];
        };
    }


}
