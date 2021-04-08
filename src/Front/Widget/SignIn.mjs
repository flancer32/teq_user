const I18N_BUNDLE = {
    password: 'Password',
    submit: 'Submit',
    user: 'User',
};

const template = `
<form class="teqUserSignIn" onsubmit="return false">
    <q-input outlined
             :label="$t('teqUserSignIn:user')"
             autocomplete="username"
             v-model="data.user"
    ></q-input>
    <q-input outlined
             :label="$t('teqUserSignIn:password')"
             :type="isPwd ? 'password' : 'text'"
             autocomplete="current-password"
             v-model="data.password"
    >
        <template v-slot:append>
            <q-icon
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isPwd = !isPwd"
            ></q-icon>
        </template>
    </q-input>
    <div class="actions">
        <q-btn v-on:click="actSubmit()" :disabled="disabled" :label="$t('teqUserSignIn:submit')"></q-btn>
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
    const Request = spec['Fl32_Teq_User_Shared_Service_Route_Sign_In#Request'];  // class
    /** @type {Fl32_Teq_User_Front_Gate_Sign_In} */
    const gate = spec['Fl32_Teq_User_Front_Gate_Sign_In$']; // function singleton
    /** @type {TeqFw_Core_App_Front_Widget_Layout_Centered} */
    const layoutCentered = spec['TeqFw_Core_App_Front_Widget_Layout_Centered$'];    // vue comp tmpl

    i18next.addResourceBundle('dev', 'teqUserSignIn', I18N_BUNDLE, true);

    return {
        name: 'UserSignIn',
        template,
        components: {layoutCentered},
        props: {
            data: Fl32_Teq_User_Front_Widget_SignIn_Props,
        },
        emits: ['onSuccess', 'onFailure'],
        data: function () {
            return {
                isPwd: true,
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
                /** @type {Fl32_Teq_User_Shared_Service_Route_Sign_In_Response} */
                const res = await gate(req);
                if (res.constructor.name === 'TeqFw_Core_App_Front_Gate_Response_Error') {
                    this.$emit('onFailure', res.message);
                } else {
                    await session.init();
                    this.$emit('onSuccess', res.sessionId);
                    this.reset();
                }
            },
            reset() {
                this.data.password = null;
            },
        }
    };
}

export default Fl32_Teq_User_Front_Widget_SignIn;
