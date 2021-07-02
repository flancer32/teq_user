/**
 * Plugin constants (hardcoded configuration) for shared code.
 */
export default class Fl32_Teq_User_Shared_Defaults {
    NAME = '@flancer32/teq_user';

    SRV = {
        CHANGE_PASSWORD: '/changePassword',
        CHECK: {EXISTENCE: '/check/existence'},
        CURRENT: '/current',
        LIST: '/list',
        REF_LINK: {
            CREATE: '/refLink/create',
            GET: '/refLink/get'
        },
        SIGN: {
            IN: '/sign/in',
            OUT: '/sign/out',
            UP: '/sign/up'
        }
    };

    constructor() {
        Object.freeze(this);
    }
}
