/**
 * Class to integrate plugin into TeqFW application.
 * @extends TeqFw_Core_Plugin_Init_Base
 */
export default class Fl32_Teq_User_Plugin_Init {

    constructor(spec) {
        /** @type {Fl32_Teq_User_Defaults} */
        const DEF = spec['Fl32_Teq_User_Defaults$'];    // singleton

        this.getServicesRealm = function () {
            return DEF.BACK_REALM;
        };

    }

}
