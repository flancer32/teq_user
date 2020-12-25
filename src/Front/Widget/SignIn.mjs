const i18next = self.teqfw.i18next;

const I18N_BUNDLE = {
    password: 'Password',
    submit: 'Submit',
    user: 'User',
};
i18next.addResourceBundle('en', 'teqUserSignIn', I18N_BUNDLE, true);

const template = `
<div class="teq-user-sign-up">
    <div>
        <div>{{$t('teqUserSignIn:user')}}:</div>
        <div><input name="login" v-model="data.user"></div>
    </div>
    <div>
        <div>{{$t('teqUserSignIn:password')}}:</div>
        <div><input name="password" v-model="data.password"></div>
    </div>
    <div>
        <button v-on:click="actSubmit()">{{$t('teqUserSignIn:submit')}}</button>
    </div>
</div>
`;

class Fl32_Teq_User_Front_Widget_SignIn_Props {
    password
    user
}

export {
    Fl32_Teq_User_Front_Widget_SignIn_Props as Props
};

export default function Fl32_Teq_User_Front_Widget_SignIn(spec) {
    /** @type {typeof Fl32_Teq_User_Shared_Service_Route_SignIn_Request} */
    const Request = spec['Fl32_Teq_User_Shared_Service_Route_SignIn#Request'];
    const gate = spec.Fl32_Teq_User_Shared_Service_Gate_SignIn$; // singleton, function
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
            actSubmit() {
                /** @type {Fl32_Teq_User_Shared_Service_Route_SignIn_Request} */
                const req = new Request();
                req.user = this.data.user;
                req.password = this.data.password;
                gate(req).then((res) => {
                    if (res.constructor.name === 'TeqFw_Core_Front_Gate_Response_Error') {
                        // registration failed
                        this.$emit('onFailure', res.message);
                    } else {
                        /** @type {Fl32_Teq_User_Shared_Service_Route_SignIn_Response} */
                        const data = res; // use IDE type hints
                        // registration succeed
                        this.$emit('onSuccess', data.sessionId);
                    }
                });
            }
        }
    };
}
