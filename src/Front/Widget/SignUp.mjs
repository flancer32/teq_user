const i18next = self.teqfw.i18next;

const I18N_BUNDLE = {
    email: 'Email',
    login: 'Login',
    name: 'Name',
    password2: 'Repeat Password',
    password: 'Password',
    phone: 'Phone',
    submit: 'Submit',
};
i18next.addResourceBundle('en', 'teqUser', I18N_BUNDLE, true);

const template = `
<div class="teq-user-sign-up">
    <div>
        <div>{{$t('teqUser:name')}}:</div>
        <div><input name="name" v-model="data.name"></div>
    </div>
    <div>
        <div>{{$t('teqUser:login')}}:</div>
        <div><input name="login" v-model="data.login"></div>
    </div>
    <div>
        <div>{{$t('teqUser:email')}}:</div>
        <div><input name="email" v-model="data.email"></div>
    </div>
    <div>
        <div>{{$t('teqUser:phone')}}:</div>
        <div><input name="phone" v-model="data.phone"></div>
    </div>
    <div>
        <div>{{$t('teqUser:password')}}:</div>
        <div><input name="password" v-model="data.password"></div>
    </div>
    <div>
        <div>{{$t('teqUser:password2')}}:</div>
        <div><input name="passwordAgain" v-model="passwordAgain"></div>
    </div>
    <div>
        <button v-on:click="actSubmit()">{{$t('teqUser:submit')}}</button>
    </div>
</div>
`;

class Fl32_Teq_User_Front_Widget_SignUp_Props {
    email
    login
    name
    password
    phone
}

export {
    Fl32_Teq_User_Front_Widget_SignUp_Props as Props
};

export default function Fl32_Teq_User_Front_Widget_SignUp(spec) {
    /** @type {typeof Fl32_Teq_User_Shared_Service_Route_SignUp_Request} */
    const Request = spec['Fl32_Teq_User_Shared_Service_Route_SignUp#Request'];
    const gate = spec.Fl32_Teq_User_Shared_Service_Gate_SignUp$; // singleton, function
    return {
        name: 'UserSignUp',
        template,
        props: {
            data: Fl32_Teq_User_Front_Widget_SignUp_Props,
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
                /** @type {Fl32_Teq_User_Shared_Service_Route_SignUp_Request} */
                const req = new Request();
                req.email = this.data.email;
                req.login = this.data.login;
                req.name = this.data.name;
                req.password = this.data.password;
                req.phone = this.data.phone;
                gate(req).then((res) => {
                    if (res.constructor.name === 'TeqFw_Core_Front_Gate_Response_Error') {
                        // registration failed
                        this.$emit('onFailure', res.message);
                    } else {
                        // registration succeed
                        this.$emit('onSuccess', res.user);
                    }
                });
            }
        }
    };
}
