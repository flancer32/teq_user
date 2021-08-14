/**
 * Referral link to add new referral user.
 *
 * @namespace Fl32_Teq_User_Back_Service_RefLink_Create
 */
// MODULE'S IMPORT
import {constants as H2} from 'http2';

// MODULE'S VARS
const NS = 'Fl32_Teq_User_Back_Service_RefLink_Create';

/**
 * @implements TeqFw_Web_Back_Api_Service_IFactory
 */
export default class Fl32_Teq_User_Back_Service_RefLink_Create {

    constructor(spec) {
        /** @type {Fl32_Teq_User_Back_Defaults} */
        const DEF = spec['Fl32_Teq_User_Back_Defaults$'];
        /** @type {TeqFw_Db_Back_RDb_Connect} */
        const rdb = spec['TeqFw_Db_Back_RDb_Connect$'];
        /** @function {@type Fl32_Teq_User_Back_Process_Referral_Link_CleanUp.process} */
        const procCleanUp = spec['Fl32_Teq_User_Back_Process_Referral_Link_CleanUp$'];
        /** @function {@type Fl32_Teq_User_Back_Process_Referral_Link_Create.process} */
        const procCreate = spec['Fl32_Teq_User_Back_Process_Referral_Link_Create$'];
        /** @function {@type Fl32_Teq_User_Back_Process_User_Load.process} */
        const procLoad = spec['Fl32_Teq_User_Back_Process_User_Load$'];
        /** @type {Fl32_Teq_User_Shared_Service_Dto_RefLink.Factory} */
        const fRefLink = spec['Fl32_Teq_User_Shared_Service_Dto_RefLink#Factory$'];
        /** @type {Fl32_Teq_User_Shared_Service_Route_RefLink_Create.Factory} */
        const route = spec['Fl32_Teq_User_Shared_Service_Route_RefLink_Create#Factory$'];


        // DEFINE INSTANCE METHODS

        this.getRouteFactory = () => route;

        this.getService = function () {
            // DEFINE INNER FUNCTIONS
            /**
             * @param {TeqFw_Web_Back_Api_Service_Context} context
             * @return Promise<void>
             */
            async function service(context) {
                // DEFINE INNER FUNCTIONS

                // MAIN FUNCTIONALITY
                /** @type {Fl32_Teq_User_Shared_Service_Route_RefLink_Create.Request} */
                const req = context.getInData();
                /** @type {Fl32_Teq_User_Shared_Service_Route_RefLink_Create.Response} */
                const res = context.getOutData();
                const shared = context.getHandlersShare();
                //
                const trx = await rdb.startTransaction();
                try {
                    /** @type {Fl32_Teq_User_Shared_Service_Dto_User} */
                    const user = shared[DEF.HTTP_SHARE_CTX_USER];
                    if (user) {
                        await procCleanUp({trx});
                        const {link, dateExp} = await procCreate({trx, userId: user.id});
                        const data = fRefLink.create();
                        data.parent = await procLoad({trx, userId: user.id});
                        data.refCode = link;
                        data.dateExpired = dateExp;
                        res.link = data;
                    } else {
                        context.setOutHeader(DEF.MOD.WEB.HTTP_HEADER_STATUS, H2.HTTP_STATUS_UNAUTHORIZED);
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
