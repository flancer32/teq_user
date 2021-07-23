const I18N_BUNDLE = {
    email: 'Email',
    errEmailExists: 'Email exists.',
    errLoginExists: 'Login exists.',
    errPasswordDiffs: 'Passwords are different.',
    errPhoneExists: 'Phone exists.',
    errUnknownRefCode: 'Unknown referral code.',
    login: 'Login',
    name: 'Name',
    password2: 'Repeat Password',
    password: 'Password',
    phone: 'Phone',
    refCode: 'Referral Code',
    submit: 'Submit',
};

/* use existence service types for fields:
 *  - @see Fl32_Teq_User_Shared_Service_Route_Check_Existence.Request.TYPE_...
 *  - @see `this.checkExistence(...)` method
 */
const template = `
<form class="teqUserSignUp" onsubmit="return false">
    <q-input class="id-name"
        outlined
        :label="$t('teqUser:name')"
        v-model="fldName"
    ></q-input>
    <q-input class="id-login" 
        :error-message="error['login']"
        :error="invalid['login']"
        :label="$t('teqUser:login')"
        :loading="loading['login']"
        autocomplete="username"
        bottom-slots
        outlined
        v-model="fldLogin"
    ></q-input>
    <q-input class="id-email" 
        :error-message="error['email']"
        :error="invalid['email']"
        :label="$t('teqUser:email')"
        :loading="loading['email']"
        autocomplete="email"
        bottom-slots
        outlined
        v-model="fldEmail"
    ></q-input>
    <q-input class="id-phone"
        :error-message="error['phone']"
        :error="invalid['phone']"
        :label="$t('teqUser:phone')"
        :loading="loading['phone']"
        autocomplete="phone"
        bottom-slots
        outlined
        v-model="fldPhone"
    ></q-input>
    <q-input class="id-password"
        :error-message="error['password']"
        :error="invalid['password']"
        :label="$t('teqUser:password')"
        autocomplete="new-password"
        bottom-slots
        outlined
        type="password"
        v-model="fldPassword"
    ></q-input>
    <q-input class="id-password2"
        :label="$t('teqUser:password2')"
        autocomplete="new-password"
        outlined
        type="password"
        v-model="fldPasswordAgain"
    ></q-input>
    <q-input class="id-ref-code"
        :error-message="error['refCode']"
        :error="invalid['refCode']"
        :label="$t('teqUser:refCode')"
        bottom-slots
        outlined
        v-model="fldRefCode"
    ></q-input>

    <div class="actions">
        <q-btn v-on:click="actSubmit()" :disabled="disabledSubmit" :label="$t('teqUser:submit')"></q-btn>
    </div>
</form>
`;

class Fl32_Teq_User_Front_Widget_SignUp_Props {
    refCode;
}

function Fl32_Teq_User_Front_Widget_SignUp(spec) {
    /** @type {Fl32_Teq_User_Back_Defaults} */
    const DEF = spec['Fl32_Teq_User_Back_Defaults$'];
    /** @type {Fl32_Teq_User_Front_Model_Session} */
    const session = spec['Fl32_Teq_User_Front_Model_Session$'];
    // const i18next = spec[DEF.MOD_I18N.DI.I18N];
    const {isEmpty} = spec['TeqFw_Core_Shared_Util'];
    /** @type {TeqFw_Web_Front_Service_Gate} */
    const gate = spec['TeqFw_Web_Front_Service_Gate$'];
    /** @type {Fl32_Teq_User_Shared_Service_Route_Check_Existence.Factory} */
    const routeExist = spec['Fl32_Teq_User_Shared_Service_Route_Check_Existence#Factory$'];
    /** @type {Fl32_Teq_User_Shared_Service_Route_Sign_Up.Factory} */
    const routeSignUp = spec['Fl32_Teq_User_Shared_Service_Route_Sign_Up#Factory$'];

    const TIMEOUT = 1000;
    // i18next.addResourceBundle('dev', 'teqUser', I18N_BUNDLE, true);

    return {
        teq: {package: DEF.SHARED.NAME},
        name: 'UserSignUp',
        template,
        props: {
            input: Fl32_Teq_User_Front_Widget_SignUp_Props,
        },
        emits: ['onSuccess', 'onFailure'],
        data: function () {
            return {
                fldEmail: null,
                fldLogin: null,
                fldName: null,
                fldPassword: null,
                fldPasswordAgain: null,
                fldPhone: null,
                fldRefCode: null,
                error: {email: '', login: '', password: '', phone: '', refCode: '', repeat: ''},
                invalid: {email: false, login: false, password: false, phone: false, refCode: false, repeat: false},
                loading: {email: false, login: false, password: false, phone: false, refCode: false, repeat: false},
                timer: {},
            };
        },
        computed: {
            disabledSubmit() {
                // MAIN FUNCTIONALITY
                let warnValid = false;
                for (const one of Object.keys(this.invalid)) {
                    if (this.invalid[one]) {
                        warnValid = true;
                        break;
                    }
                }
                const warnEmpty = isEmpty(this.fldName) ||
                    isEmpty(this.fldLogin) ||
                    isEmpty(this.fldPassword) ||
                    isEmpty(this.fldRefCode);
                return warnValid || warnEmpty;
            },
        },
        methods: {
            async actSubmit() {
                const req = this.createSignUpRequest();
                const res = await gate.send(req, routeSignUp);
                if (res && res.user) {
                    // registration succeed, init new session
                    await session.init();
                    this.$emit('onSuccess', res.user);
                    // reset data
                    this.fldEmail = null;
                    this.fldLogin = null;
                    this.fldName = null;
                    this.fldPassword = null;
                    this.fldPasswordAgain = null;
                    this.fldRefCode = null;
                    for (const one of Object.keys(this.invalid)) this.invalid[one] = false;
                } else {
                    // registration failed
                    this.$emit('onFailure', 'User sign up is failed.');
                }
            },
            /**
             * Send request to server to check data existence.
             *
             * @param {String} value
             * @param {String} type @see Fl32_Teq_User_Shared_Service_Route_Check_Existence.Request.TYPE_...
             * @param {Boolean} fireError 'true' - error on exist (for `email`), 'false' - otherwise (for `refCode`)
             * @param {String} msg i18n-key for error message
             * @returns {Promise<void>}
             */
            async checkExistence(value, type, fireError, msg) {
                const me = this;
                me.invalid[type] = false;
                // create function to execute checking
                const fn = async function () {
                    if (value) {
                        me.loading[type] = true;
                        /** @type {Fl32_Teq_User_Shared_Service_Route_Check_Existence.Request} */
                        const req = routeExist.createReq();
                        req.type = type;
                        req.value = value;
                        // noinspection JSValidateTypes
                        /** @type {Fl32_Teq_User_Shared_Service_Route_Check_Existence.Response} */
                        const res = await gate.send(req, routeExist);
                        me.loading[type] = false;
                        if (res.exist === fireError) {
                            me.invalid[type] = true;
                            me.error[type] = me.$t(`teqUser:${msg}`);
                        }
                    }
                };
                // deferred execution
                clearTimeout(this.timer[type]);    // clear previous timer, if exists
                this.timer[type] = setTimeout(fn, TIMEOUT);
            },
            checkPassword() {
                // MAIN FUNCTIONALITY
                const emptyPass = isEmpty(this.fldPassword);
                const emptyRepeat = isEmpty(this.fldPasswordAgain);
                if (!emptyPass && !emptyRepeat) {
                    if (this.fldPassword !== this.fldPasswordAgain) {
                        this.invalid.password = true;
                        this.error.password = this.$t('teqUser:errPasswordDiffs');
                    } else {
                        this.invalid.password = false;
                    }
                }
            },
            /**
             * Create service request. This method can be overwrote in parent components.
             * @returns {Fl32_Teq_User_Shared_Service_Route_Sign_Up.Request}
             */
            createSignUpRequest() {
                /** @type {Fl32_Teq_User_Shared_Service_Route_Sign_Up.Request} */
                const res = routeSignUp.createReq();
                res.email = this.fldEmail;
                res.login = this.fldLogin;
                res.name = this.fldName;
                res.password = this.fldPassword;
                res.phone = this.fldPhone;
                res.referralCode = this.fldRefCode;
                return res;
            },
        },
        watch: {
            fldEmail(current) {
                this.checkExistence(current, routeExist.TYPE_EMAIL, true, 'errEmailExists');
            },
            fldLogin(current) {
                this.checkExistence(current, routeExist.TYPE_LOGIN, true, 'errLoginExists');
            },
            fldPassword() {
                this.checkPassword();
            },
            fldPasswordAgain() {
                this.checkPassword();
            },
            fldPhone(current) {
                this.checkExistence(current, routeExist.TYPE_PHONE, true, 'errPhoneExists');
            },
            fldRefCode(current) {
                this.checkExistence(current, routeExist.TYPE_REF_CODE, false, 'errUnknownRefCode');
            },
            input(current) {
                this.fldRefCode = current.refCode;
                this.invalid[routeExist.TYPE_REF_CODE] = false;
            },
        },
        mounted() {
            this.fldRefCode = this.input.refCode ?? null;
        },
    };
}

export {
    Fl32_Teq_User_Front_Widget_SignUp_Props as Props,
    Fl32_Teq_User_Front_Widget_SignUp as default,
};
