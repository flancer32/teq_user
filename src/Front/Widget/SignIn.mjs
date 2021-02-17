const I18N_BUNDLE = {
    password: 'Password',
    submit: 'Submit',
    user: 'User',
};

const template = `
<form class="teqUserSignIn" onsubmit="return false">
    <teq-input
            :label="$t('teqUserSignIn:user')"
            :autocomplete="'off'"
            v-model="data.user"
    ></teq-input>
    <teq-input
            :label="$t('teqUserSignIn:password')"
            :type="'password'"
            :autocomplete="'off'"
             v-model="data.password"
    ></teq-input>
<!--    <div>-->
<!--        <div>{{ $t('teqUserSignIn:user') }}:</div>-->
<!--        <div><input name="username" v-model="data.user" autocomplete="on"></div>-->
<!--    </div>-->
<!--    <div>-->
<!--        <div>{{ $t('teqUserSignIn:password') }}:</div>-->
<!--        <div><input name="password" v-model="data.password" type="password" autocomplete="current-password"></div>-->
<!--    </div>-->
    <div class="actions">
        <button v-on:click="actSubmit()" :disabled="disabled">{{ $t('teqUserSignIn:submit') }}</button>
    </div>
</form>
`;

class Fl32_Teq_User_Front_Widget_SignIn_Props {
    password
    user
}

export {
    Fl32_Teq_User_Front_Widget_SignIn_Props as Props
};

function Fl32_Teq_User_Front_Widget_SignIn(spec) {
    /** @type {Fl32_Teq_User_Defaults} */
    const DEF = spec['Fl32_Teq_User_Defaults$'];    // instance singleton
    /** @type {Fl32_Teq_User_Front_App_Session} */
    const session = spec[DEF.DI_SESSION];   // named singleton
    const i18next = spec[DEF.MOD_CORE.DI_I18N];   // named singleton
    /** @type {typeof Fl32_Teq_User_Shared_Service_Route_Sign_In_Request} */
    const Request = spec['Fl32_Teq_User_Shared_Service_Route_Sign_In#Request'];  // class constructor
    /** @type {Fl32_Teq_User_Front_Gate_Sign_In} */
    const gate = spec['Fl32_Teq_User_Front_Gate_Sign_In$']; // function singleton

    i18next.addResourceBundle('dev', 'teqUserSignIn', I18N_BUNDLE, true);

    return {
        name: 'UserSignIn',
        template,
        props: {
            data: Fl32_Teq_User_Front_Widget_SignIn_Props,
        },
        emits: ['onSuccess', 'onFailure'],
        data: function () {
            return {
                passwordAgain: null,
                pageTitle: 'title is here'
            };
        },
        computed: {
            disabled() {
                return !(this.data.user && this.data.password);
            }
        },
        methods: {
            async actSubmit() {
                /** @type {Fl32_Teq_User_Shared_Service_Route_Sign_In_Request} */
                const req = new Request();
                req.user = this.data.user;
                req.password = this.data.password;
                const res = await gate(req);
                if (res.constructor.name === 'TeqFw_Core_App_Front_Gate_Response_Error') {
                    // registration failed
                    this.$emit('onFailure', res.message);
                } else {
                    /** @type {Fl32_Teq_User_Shared_Service_Route_Sign_In_Response} */
                    const data = res; // use IDE type hints
                    await session.init();
                    // registration succeed
                    this.$emit('onSuccess', data.sessionId);
                }
            }
        }
    };
}

export default Fl32_Teq_User_Front_Widget_SignIn;
