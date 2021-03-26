/**
 * Referral link data in API.
 */
class Fl32_Teq_User_Shared_Api_Data_RefLink {
    /** @type {Date} */
    dateExpired
    /** @type {Fl32_Teq_User_Shared_Api_Data_User} */
    parent
    /**
     * Referral code.
     * @type {String}
     */
    refCode
}

// attributes names to use in queries to RDb
Fl32_Teq_User_Shared_Api_Data_RefLink.A_DATE_EXPIRED = 'dateExpired';
Fl32_Teq_User_Shared_Api_Data_RefLink.A_PARENT = 'parent';
Fl32_Teq_User_Shared_Api_Data_RefLink.A_REF_CODE = 'refCode';

export {
    Fl32_Teq_User_Shared_Api_Data_RefLink as default
};
