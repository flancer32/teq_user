/**
 * Cache for user data with sessionId as a keys.
 * This class is wrapper for the Map with JSDoc hints.
 * We can use simple Map instance as named singleton in this case (w/o JSDoc hints, of cause).
 */
export default class Fl32_Teq_User_App_Cache_Session {

    constructor() {
        let map = new Map();

        this.clear = function () {
            map.clear();
        };
        this.delete = function (sessId) {
            map.delete(sessId);
        };
        /**
         * @param {String} sessId
         * @return {Fl32_Teq_User_Shared_Service_Data_User|null}
         */
        this.get = function (sessId) {
            return map.get(sessId) ?? null;
        };
        /**
         * @param {String} sessId
         * @param {Fl32_Teq_User_Shared_Service_Data_User} user
         */
        this.set = function (sessId, user) {
            map.set(sessId, user);
        };
    }
}