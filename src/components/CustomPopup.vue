<template>
    <form class="newsletter" @submit.prevent="onSubmit" v-show="formVisible">
        <slot :slotProps="slotProps">
            <div class="newsletter__wrap">
                <div class="newsletter__title">{{ slotProps.title }}</div>
                <div v-if="!sentSuccess" class="newsletter__content">{{ slotProps.content }}</div>
                <ul class="newsletter__error-box" v-if="slotProps.errors.length > 0">
                    <li v-for="msg in slotProps.errors" class="newsletter__error-msg">{{ msg }}</li>
                </ul>
                <ul class="newsletter__success-box" v-show="sentSuccess">
                    <li class="newsletter__success-msg">{{ slotProps.successMsg }}</li>
                </ul>
                <input
                        v-model="slotProps.mail"
                        class="newsletter__input"
                        type="email"
                        name="email"
                        aria-label="Email"
                        placeholder="Email"
                        required
                        autocapitalize="off"
                        autocorrect="off"
                        data-cy="email"
                        v-if="!sentSuccess"
                />
                <input
                        v-model="slotProps.hiddenData"
                        type="hidden"
                />
                <button type="submit" class="newsletter__button" data-cy="submit" v-if="!sentSuccess">
                    <font-awesome-icon :icon="spinnerIcon" v-show="slotProps.sendingData" spin/>
                    <font-awesome-icon :icon="sendIcon" v-show="!slotProps.sendingData"/>
                    {{ slotProps.submitText }}
                </button>
                <button v-if="!sentSuccess" class="btn btn-cancel" @click.prevent="formVisible = false">
                    <font-awesome-icon :icon="closeIcon"/>
                    Cancel
                </button>
                <button v-if="sentSuccess" class="btn btn-cancel" @click.prevent="formVisible = false">
                    <font-awesome-icon :icon="closeIcon"/>
                    Close
                </button>
            </div>
        </slot>
    </form>
</template>

<script>
    import VuepressCustomPopupLang from '../utils'
    import submitToEndpoint from '../customPopup';
    import BusinessEmailValidator from '../businessEmailValidator'
    import event from '../event';
    import _debug from 'debug';
    import {library} from '@fortawesome/fontawesome-svg-core';
    import {faSpinner, faEnvelope, faShareSquare, faWindowClose} from '@fortawesome/free-solid-svg-icons';
    import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome';

    library.add(faSpinner, faEnvelope, faShareSquare, faWindowClose)

    const debug = _debug('plugin-custom-popup');
    /**
     * If developers make UI customiztion and offer users an option whether to enable.
     * It won't be able to import client dynamic modules if it's disabled.
     * Use commonJs because dynamic import cannot be caught https://github.com/webpack/webpack/issues/5360
     */
    let submitText, content, title, popupEnabled;
    try {
        const options = require('@dynamic/customPopupOptions');
        submitText = options.submitText;
        content = options.content;
        title = options.title;
        popupEnabled = options.popupEnabled;
    } catch (error) {
        debug('Fail to get options', error.message);
    }
    export default {
        // name: 'CustomPopup',
        components: {
            FontAwesomeIcon
        },
        props: ['popupTitle', 'popupSubTitle', 'free', 'paid', 'count'],
        data() {
            return {
                slotProps: {
                    mail: '',
                    title: title || 'Newsletter',
                    content: content || 'Subscribe to get my lastest content. No spam.',
                    submitText: submitText || 'Send Now',
                    errors: [],
                    sendingData: false,
                    successMsg: 'We sent your requested file to your email. Thank you.',
                },
                formVisible: false,
                sentSuccess: false,
                lang: 'en',
            };
        },
        created() {
            event.$on('showPopup', this.showPopup)
        },
        computed: {
            appIcon() {
                return faEnvelope
            },
            spinnerIcon() {
                return faSpinner
            },
            sendIcon() {
                return faShareSquare
            },
            closeIcon() {
                return faWindowClose
            },
            /**
             * Get language pack
             * @return Object
             */
            language() {
                const vc = new VuepressCustomPopupLang()
                return vc.getLang(this.lang)
            }
        },
        beforeMount() {
            this.slotProps.title = this.popupTitle;
            this.slotProps.content = this.popupSubTitle;
            this.slotProps.hiddenData = this.hiddenData;
        },
        methods: {
            onSubmit() {
                this.slotProps.sendingData = true;
                this.slotProps.errors = [];

                if (!this.slotProps.mail) {
                    this.slotProps.errors.push(this.language.LB_ERROR_EMAIL)
                    this.slotProps.sendingData = false
                } else if (!this.validEmail(this.slotProps.mail)) {
                    this.slotProps.errors.push(this.language.LB_ERROR_EMAIL_VALID)
                    this.slotProps.sendingData = false
                }

                if (this.slotProps.errors.length > 0)
                {
                    this.slotProps.sendingData = false
                    return false;
                }

                let fields = {"free":this.free,
                    "full": this.paid,
                    "count":this.count}

                submitToEndpoint(this.slotProps.mail, fields, (data, err) => {
                    this.slotProps.mail = '';
                    this.sentSuccess = true;
                    this.slotProps.sendingData = false;
                });
                //     .catch(err => {
                //         // this.slotProps.mail = '';
                //         // if (popupEnabled) event.$emit('submited', {result: 'error'});
                //         // this.slotProps.errors.push(err)
                //         // console.log(err)
                //     })
                //     .then(res => {
                //         // if(res.code === 200) {
                //         this.slotProps.mail = '';
                //         // if (popupEnabled) event.$emit('submited', res);
                //         // this.formVisible = false
                //         this.sentSuccess = true;
                //         // if (res.data.code === 200) {
                //         //     this.slotProps.formVisible = false
                //         // } else {
                //         //     this.slotProps.errors.push(res.data.message)
                //         // }
                //         // }else{
                //         //     console.log(res.message)
                //         //     this.errors.push(this.language.LB_ERROR_SERVER)
                //         // }
                //     }).finally(res => {
                //     this.slotProps.sendingData = false;
                // });
            },
            validEmail: function (email) {
                const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                let validFormat = re.test(email);
                if (!validFormat) {
                    return validFormat
                }
                return BusinessEmailValidator.validate(email)
            },
            showPopup: function () {
                this.formVisible = true
            }
        },
    };
</script>

<style lang="stylus">
    .newsletter
        text-align center
        width 100%
        height 100%
        font-size 1rem
        color $textColor
        background-color grey
        opacity 0.9
        position fixed
        top 4.4rem
        left 0rem
        border solid 1px #ededed
        z-index 1

        &__error-box
            list-style none
            color red

        &__wrap
            margin 1.5rem auto
            padding 1.8rem 2.3rem
            border-radius 3px
            box-sizing border-box
            max-width 420px
            background #f8f8f8

        &__title
            font-size 1.5rem

        &__content
            margin-top 1.5rem
            margin-bottom 1.5rem
            line-height 1.7rem

        &__input
            font-size inherit
            border 1px solid $borderColor
            width 100%
            padding 0.6rem 1.2rem
            box-sizing border-box
            border-radius 3px
            margin-bottom 0.8rem
            outline none

        &__button
            font-size inherit
            border none
            cursor pointer
            background $accentColor
            color #fff
            padding 0.6rem 1.8rem
            box-sizing border-box
            border-radius 3px
            width 100%
            outline none
</style>
