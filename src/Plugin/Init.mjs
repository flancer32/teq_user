/**
 * Class to integrate plugin into TeqFW application.
 * @extends TeqFw_Core_App_Plugin_Init_Base
 */
export default class Fl32_Teq_User_Plugin_Init {

    constructor(spec) {
        /** @type {Fl32_Teq_User_Defaults} */
        const DEF = spec['Fl32_Teq_User_Defaults$'];    // instance singleton

        this.getCommands = function () {
            return [];
        };

        this.getHttpStaticMaps = function () {
            return {};
        };

        this.getServicesRealm = function () {
            return DEF.BACK_REALM;
        };

        this.getServicesList = function () {
            return [
                'Fl32_Teq_User_Back_Service_ChangePassword$',
                'Fl32_Teq_User_Back_Service_Check_Existence$',
                'Fl32_Teq_User_Back_Service_Current$',
                'Fl32_Teq_User_Back_Service_List$',
                'Fl32_Teq_User_Back_Service_RefLink_Create$',
                'Fl32_Teq_User_Back_Service_RefLink_Get$',
                'Fl32_Teq_User_Back_Service_Sign_In$',
                'Fl32_Teq_User_Back_Service_Sign_Out$',
                'Fl32_Teq_User_Back_Service_Sign_Up$',
            ];
        };
    }

}
