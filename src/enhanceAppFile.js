import { popupEnabled } from '@dynamic/customPopupOptions';

export default ({ Vue }) => {
    Vue.component('CustomPopup', () =>
        import('./components/CustomPopup.vue')
    );
    if (popupEnabled) {
        Vue.component('Popup', () => import('./components/Popup.vue'));
    }
};
