const i18next = self.teqfw.i18next;

const I18N_BUNDLE = {
    password: 'Password',
    submit: 'Submit',
    user: 'User',
};
i18next.addResourceBundle('en', 'teqUserSignIn', I18N_BUNDLE, true);

const template = `
<form class="teqUserSignIn" onsubmit="return false">
    <div>
        <div>{{$t('teqUserSignIn:user')}}:</div>
        <div><input name="username" v-model="data.user" autocomplete="on"></div>
    </div>
    <div>
        <div>{{$t('teqUserSignIn:password')}}:</div>
        <div><input name="password" v-model="data.password" type="password" autocomplete="current-password"></div>
    </div>
    <div>
        <button v-on:click="actSubmit()">{{$t('teqUserSignIn:submit')}}</button>
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
    const DEF = spec.Fl32_Teq_User_Defaults$;
    /** @type {Fl32_Teq_User_Front_App_Session} */
    const session = spec[DEF.DI_SESSION];
    /** @type {typeof Fl32_Teq_User_Shared_Service_Route_SignIn_Request} */
    const Request = spec['Fl32_Teq_User_Shared_Service_Route_SignIn#Request'];  // class constructor
    const gate = spec.Fl32_Teq_User_Front_Gate_SignIn$; // singleton, function
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
            };
        },
        computed: {},
        methods: {
            async actSubmit() {
                /** @type {Fl32_Teq_User_Shared_Service_Route_SignIn_Request} */
                const req = new Request();
                req.user = this.data.user;
                req.password = this.data.password;
                const res = await gate(req);
                if (res.constructor.name === 'TeqFw_Core_App_Front_Gate_Response_Error') {
                    // registration failed
                    this.$emit('onFailure', res.message);
                } else {
                    /** @type {Fl32_Teq_User_Shared_Service_Route_SignIn_Response} */
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
