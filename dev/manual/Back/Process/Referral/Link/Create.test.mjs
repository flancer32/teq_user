import assert from 'assert';
import {describe, it} from 'mocha';
import devEnv from '../../../../../../../../../dev/manual/DevEnv.mjs';

/**
 * This is environment for code development, not for testing.
 */
describe('Fl32_Teq_User_Back_Process_Referral_Link_Create', () => {

    it('performs the duties', async () => {
        /** @type {TeqFw_Di_Shared_Container} */
        const container = await devEnv();
        /** @type {Fl32_Teq_User_Back_Process_Referral_Link_Create.process} */
        const proc = await container.get('Fl32_Teq_User_Back_Process_Referral_Link_Create$');
        assert.strictEqual(proc.name, 'Fl32_Teq_User_Back_Process_Referral_Link_Create.process');

        // get database connector then execute the process
        /** @type {TeqFw_Db_Back_Api_RDb_IConnect} */
        const rdb = await container.get('TeqFw_Db_Back_Api_RDb_IConnect$');
        try {
            const trx = await rdb.startTransaction();
            const res = await proc({trx, userId: 1});
            assert(typeof res?.link === 'string');
            // finalize data handling
            await trx.commit();
        } finally {
            await rdb.disconnect();
        }

    });
});
