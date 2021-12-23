const I18N_BUNDLE = {
    password: 'Password',
    submit: 'Submit',
    user: 'User',
};

const template = `
<form class="teqUserSignIn" onsubmit="return false">
    <q-input outlined
             :label="$t('user')"
             autocomplete="username"
             v-model="data.user"
    ></q-input>
    <q-input outlined
             :label="$t('password')"
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

function Fl32_Teq_User_Front_Widget_SignIn(spec) {
    /** @type {Fl32_Teq_User_Back_Defaults} */
    const DEF = spec['Fl32_Teq_User_Back_Defaults$'];
    /** @type {Fl32_Teq_User_Front_Model_Session} */
    const session = spec['Fl32_Teq_User_Front_Model_Session$'];
    /** @type {TeqFw_Web_Front_WAPI_Gate} */
    const gate = spec['TeqFw_Web_Front_WAPI_Gate$'];
    /** @type {Fl32_Teq_User_Shared_WAPI_Sign_In.Factory} */
    const route = spec['Fl32_Teq_User_Shared_WAPI_Sign_In#Factory$'];
    /** @type {Function|Fl32_Bwl_Front_Layout_Centered} */
    const layoutCentered = spec['Fl32_Bwl_Front_Layout_Centered$'];

    return {
        teq: {package: DEF.SHARED.NAME},
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
                /** @type {Fl32_Teq_User_Shared_WAPI_Sign_In.Request} */
                const req = route.createReq(this.data);
                // noinspection JSValidateTypes
                /** @type {Fl32_Teq_User_Shared_WAPI_Sign_In.Response} */
                const res = await gate.send(req, route);
                if (res) {
                    await session.init();
                    this.$emit('onSuccess', res.sessionId);
                    this.reset();
                } else {
                    this.$emit('onFailure', 'Sign in is failed.');
                }
            },
            reset() {
                this.data.password = null;
            },
        }
    };
}

export {
    Fl32_Teq_User_Front_Widget_SignIn as default,
    Fl32_Teq_User_Front_Widget_SignIn_Props as Props
}
