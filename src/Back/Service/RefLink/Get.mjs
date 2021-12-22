/**
 * Service to get referral link data (exp. date and parent data).
 *
 * @namespace Fl32_Teq_User_Back_Service_RefLink_Get
 */
// MODULE'S IMPORT
import {constants as H2} from 'http2';
// MODULE'S VARS
const NS = 'Fl32_Teq_User_Back_Service_RefLink_Get';

/**
 * @implements TeqFw_Web_Back_Api_WAPI_IFactory
 */
export default class Fl32_Teq_User_Back_Service_RefLink_Get {

    constructor(spec) {
        // EXTRACT DEPS
        /** @type {Fl32_Teq_User_Back_Defaults} */
        const DEF = spec['Fl32_Teq_User_Back_Defaults$'];
        /** @type {TeqFw_Db_Back_RDb_IConnect} */
        const rdb = spec['TeqFw_Db_Back_RDb_IConnect$'];
        /** @type {Fl32_Teq_User_Shared_Service_Route_RefLink_Get.Factory} */
        const route = spec['Fl32_Teq_User_Shared_Service_Route_RefLink_Get#Factory$'];
        /** @function {@type Fl32_Teq_User_Back_Process_Referral_Link_CleanUp.process} */
        const procCleanUp = spec['Fl32_Teq_User_Back_Process_Referral_Link_CleanUp$'];
        /** @function {@type Fl32_Teq_User_Back_Process_Referral_Link_Get.process} */
        const procGet = spec['Fl32_Teq_User_Back_Process_Referral_Link_Get$'];
        /** @function {@type Fl32_Teq_User_Back_Process_User_Load.process} */
        const procLoad = spec['Fl32_Teq_User_Back_Process_User_Load$'];
        /** @type {Fl32_Teq_User_Shared_Service_Dto_RefLink.Factory} */
        const fRefLink = spec['Fl32_Teq_User_Shared_Service_Dto_RefLink#Factory$'];

        // DEFINE INSTANCE METHODS

        this.getRouteFactory = () => route;

        this.getService = function () {
            // DEFINE INNER FUNCTIONS
            /**
             * @param {TeqFw_Web_Back_Api_WAPI_Context} context
             * @return Promise<void>
             */
            async function service(context) {
                // DEFINE INNER FUNCTIONS

                // MAIN FUNCTIONALITY
                /** @type {Fl32_Teq_User_Shared_Service_Route_RefLink_Get.Request} */
                const req = context.getInData();
                /** @type {Fl32_Teq_User_Shared_Service_Route_RefLink_Get.Response} */
                const res = context.getOutData();
                //
                const trx = await rdb.startTransaction();
                try {
                    // clean up expired links
                    await procCleanUp({trx});
                    // load link data by code
                    const code = req.code;
                    const linkData = await procGet({trx, code});
                    if (linkData) {
                        const link = fRefLink.create();
                        link.parent = await procLoad({trx, userId: linkData.user_ref});
                        link.refCode = linkData.code;
                        link.dateExpired = new Date(linkData.date_expired);
                        res.link = link;
                    } else {
                        context.setOutHeader(DEF.MOD_WEB.HTTP_HEADER_STATUS, H2.HTTP_STATUS_NOT_FOUND);
                    }
                    await trx.commit();
                } catch (error) {
                    await trx.rollback();
                    throw error;
                }
            }

            // MAIN FUNCTIONALITY
            Object.defineProperty(service, 'name', {value: `${NS}.${service.name}`});
            return service;
        }
    }
}
