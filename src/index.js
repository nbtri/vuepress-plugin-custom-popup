const { path, logger, chalk } = require('@vuepress/shared-utils');

module.exports = options => {
    if (!options.endpoint) {
        logger.warn(
            `[vuepress-plugin-custom-popup] Failed: ${chalk.cyan(
                'endpoint is required'
            )}`
        );
        return;
    }

    const shouldInjectPopup =
        (options.popupConfig && options.popupConfig.enabled) || true;
    const popupComponent =
        (options.popupConfig && options.popupConfig.component) || 'Popup';

    return {
        name: 'customPopup',

        enhanceAppFiles: [path.resolve(__dirname, 'enhanceAppFile.js')],

        clientDynamicModules() {
            return {
                name: 'customPopupOptions.js',
                content: `
    const { endpoint, submitText, content, title, popupConfig = {} } = ${JSON.stringify(
                    options
                )}
    
    const {
    enabled: popupEnabled = true,
    component: popupComponent = "Popup",
    timeout: popupTimeout = 3000
    } = popupConfig;
    
    export { endpoint, submitText, content, title, popupEnabled, popupComponent, popupTimeout };
    
    `,
            };
        },

        globalUIComponents: shouldInjectPopup ? popupComponent : undefined,
    };
};
