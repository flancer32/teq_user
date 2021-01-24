const i18next = self.teqfw.i18next;

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

i18next.addResourceBundle('en', 'teqUser', I18N_BUNDLE, true);

const template = `
<form class="teqUserSignUp" onsubmit="return false">
    <div class="id-name">
        <div>{{ $t('teqUser:name') }}:</div>
        <div><input name="name" v-model="fldName"></div>
    </div>
    <div class="id-login">
        <div>{{ $t('teqUser:login') }}:</div>
        <div>
            <input name="login" v-model="fldLogin" autocomplete="username">
            <div class="warn" v-show="showLoginMsg">{{ msgLogin }}</div>
        </div>
    </div>
    <div class="id-email">
        <div>{{ $t('teqUser:email') }}:</div>
        <div>
            <input name="email" v-model="fldEmail">
            <div class="warn" v-show="showEmailMsg">{{ msgEmail }}</div>
        </div>
    </div>
    <div class="id-phone">
        <div>{{ $t('teqUser:phone') }}:</div>
        <div>
            <input name="phone" v-model="fldPhone" autocomplete="on">
            <div class="warn" v-show="showPhoneMsg">{{ msgPhone }}</div>
        </div>
    </div>
    <div class="id-password">
        <div>{{ $t('teqUser:password') }}:</div>
        <div><input name="password" v-model="fldPassword" type="password" autocomplete="new-password"></div>
    </div>
    <div class="id-password2">
        <div>{{ $t('teqUser:password2') }}:</div>
        <div>
            <input name="passwordAgain" v-model="fldPasswordAgain" type="password" autocomplete="new-password">
            <div class="warn" v-show="showPasswordMsg">{{ msgPassword }}</div>
        </div>
    </div>
    <div class="id-refCode">
        <div>{{ $t('teqUser:refCode') }}:</div>
        <div>
            <input name="refCode" v-model="fldRefCode">
            <div class="warn" v-show="showRefCodeMsg">{{ msgRefCode }}</div>
        </div>
    </div>
    <div class="actions">
        <button v-on:click="actSubmit()" :disabled="disabledSubmit">{{ $t('teqUser:submit') }}</button>
    </div>
</form>
`;

class Fl32_Teq_User_Front_Widget_SignUp_Props {
    refCode;
}

export {
    Fl32_Teq_User_Front_Widget_SignUp_Props as Props,
    Fl32_Teq_User_Front_Widget_SignUp as default,
};

function Fl32_Teq_User_Front_Widget_SignUp(spec) {
    const gateCheckExist = spec['Fl32_Teq_User_Front_Gate_Check_Existence$']; // singleton function
    const gateSignUp = spec['Fl32_Teq_User_Front_Gate_SignUp$']; // singleton function
    /** @type {typeof Fl32_Teq_User_Shared_Service_Route_SignUp_Request} */
    const Request = spec['Fl32_Teq_User_Shared_Service_Route_SignUp#Request'];  // class constructor
    /** @type {typeof Fl32_Teq_User_Shared_Service_Route_Check_Existence_Request} */
    const CheckExistReq = spec['Fl32_Teq_User_Shared_Service_Route_Check_Existence#Request']; // class constructor

    const TIMEOUT = 1000;

    return {
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
                msgEmail: null,
                msgLogin: null,
                msgPassword: null,
                msgPhone: null,
                msgRefCode: null,
                showEmailMsg: false,
                showLoginMsg: false,
                showPasswordMsg: false,
                showPhoneMsg: false,
                showRefCodeMsg: false,
                timerEmail: null,
                timerLogin: null,
                timerPhone: null,
                timerRefCode: null,
            };
        },
        computed: {
            disabledSubmit() {
                // DEFINE INNER FUNCTIONS
                function isEmpty(val) {
                    return (val === undefined) || (val === null) || (val === '');
                }

                // MAIN FUNCTIONALITY
                const warnValid = this.showEmailMsg ||
                    this.showLoginMsg ||
                    this.showPasswordMsg ||
                    this.showPhoneMsg ||
                    this.showRefCodeMsg;
                const warnEmpty = isEmpty(this.fldName) ||
                    isEmpty(this.fldLogin) ||
                    isEmpty(this.fldPassword) ||
                    isEmpty(this.fldRefCode);
                return warnValid || warnEmpty;
            },
        },
        methods: {
            actSubmit() {
                /** @type {Fl32_Teq_User_Shared_Service_Route_SignUp_Request} */
                const req = new Request();
                req.email = this.fldEmail;
                req.login = this.fldLogin;
                req.name = this.fldName;
                req.password = this.fldPassword;
                req.phone = this.fldPhone;
                req.referralCode = this.fldRefCode;
                gateSignUp(req).then((res) => {
                    if (res.constructor.name === 'TeqFw_Core_App_Front_Gate_Response_Error') {
                        // registration failed
                        this.$emit('onFailure', res.message);
                    } else {
                        // registration succeed
                        this.$emit('onSuccess', res.user);
                        // reset data
                        this.fldEmail = null;
                        this.fldLogin = null;
                        this.fldName = null;
                        this.fldPassword = null;
                        this.fldPasswordAgain = null;
                        this.fldRefCode = null;
                        this.showEmailMsg = false;
                        this.showLoginMsg = false;
                        this.showPasswordMsg = false;
                        this.showPhoneMsg = false;
                        this.showRefCodeMsg = false;
                    }
                });
            },
            async checkExistence(value, type) {
                this.showRefCodeMsg = false;
                if (value) {
                    const req = Object.assign(new CheckExistReq(), {value, type});
                    /** @type {Fl32_Teq_User_Shared_Service_Route_Check_Existence_Response} */
                    const res = await gateCheckExist(req);
                    if (!res.exist) {
                        this.showRefCodeMsg = true;
                        this.msgRefCode = this.$t('teqUser:errUnknownRefCode');
                    }
                }
            },
            checkPassword() {
                // DEFINE INNER FUNCTIONS
                function isEmpty(val) {
                    return (val === undefined) || (val === null) || (val === '');
                }

                // MAIN FUNCTIONALITY
                const emptyPass = isEmpty(this.fldPassword);
                const emptyRepeat = isEmpty(this.fldPasswordAgain);
                if (!emptyPass && !emptyRepeat) {
                    if (this.fldPassword !== this.fldPasswordAgain) {
                        this.showPasswordMsg = true;
                        this.msgPassword = this.$t('teqUser:errPasswordDiffs');
                    } else {
                        this.showPasswordMsg = false;
                    }
                }
            },
        },
        watch: {
            fldEmail(current) {
                const me = this;
                // create function to execute checking
                const fn = async function () {
                    me.showEmailMsg = false;
                    if (current) {
                        const req = new CheckExistReq();
                        req.type = CheckExistReq.TYPE_EMAIL;
                        req.value = current;
                        /** @type {Fl32_Teq_User_Shared_Service_Route_Check_Existence_Response} */
                        const res = await gateCheckExist(req);
                        if (res.exist === true) {
                            me.showEmailMsg = true;
                            me.msgEmail = me.$t('teqUser:errEmailExists');
                        }
                    }
                };
                // deferred execution
                clearTimeout(this.timerEmail);    // clear previous timer, if exists
                this.timerEmail = setTimeout(fn, TIMEOUT);
            },
            fldLogin(current) {
                const me = this;
                // create function to execute checking
                const fn = async function () {
                    me.showLoginMsg = false;
                    if (current) {
                        const req = new CheckExistReq();
                        req.type = CheckExistReq.TYPE_LOGIN;
                        req.value = current;
                        /** @type {Fl32_Teq_User_Shared_Service_Route_Check_Existence_Response} */
                        const res = await gateCheckExist(req);
                        if (res.exist === true) {
                            me.showLoginMsg = true;
                            me.msgLogin = me.$t('teqUser:errLoginExists');
                        }
                    }
                };
                // deferred execution
                clearTimeout(this.timerLogin);    // clear previous timer, if exists
                this.timerLogin = setTimeout(fn, TIMEOUT);
            },
            fldPassword() {
                this.checkPassword();
            },
            fldPasswordAgain() {
                this.checkPassword();
            },
            fldPhone(current) {
                const me = this;
                // create function to execute checking
                const fn = async function () {
                    me.showPhoneMsg = false;
                    if (current) {
                        const req = new CheckExistReq();
                        req.type = CheckExistReq.TYPE_PHONE;
                        req.value = current;
                        /** @type {Fl32_Teq_User_Shared_Service_Route_Check_Existence_Response} */
                        const res = await gateCheckExist(req);
                        if (res.exist === true) {
                            me.showPhoneMsg = true;
                            me.msgPhone = me.$t('teqUser:errPhoneExists');
                        }
                    }
                };
                // deferred execution
                clearTimeout(this.timerPhone);    // clear previous timer, if exists
                this.timerPhone = setTimeout(fn, TIMEOUT);
            },
            fldRefCode(current) {
                const me = this;
                // create function to execute checking
                const fn = async function () {
                    me.showRefCodeMsg = false;
                    if (current) {
                        const req = new CheckExistReq();
                        req.type = CheckExistReq.TYPE_REF_CODE;
                        req.value = current;
                        /** @type {Fl32_Teq_User_Shared_Service_Route_Check_Existence_Response} */
                        const res = await gateCheckExist(req);
                        if (res.exist !== true) {
                            me.showRefCodeMsg = true;
                            me.msgRefCode = me.$t('teqUser:errUnknownRefCode');
                        }
                    }
                };
                // deferred execution
                clearTimeout(this.timerRefCode);    // clear previous timer, if exists
                this.timerRefCode = setTimeout(fn, TIMEOUT);
            },
        },
        mounted() {
            this.fldRefCode = this.input.refCode ?? null;
        },
    };
}
