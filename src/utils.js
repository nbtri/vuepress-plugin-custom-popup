function VuepressCustomPopupLang() {
    const en = {
        LB_FORM_TITLE: 'Get in touch with us',
        LB_YOUR_NAME: 'Your Name (required)',
        LB_YOUR_EMAIL: 'Your E-mail (required)',
        LB_YOUR_MESSAGE: 'Your Message',
        LB_YOUR_BUTTON_SEND: 'Submit',
        LB_YOUR_BUTTON_CANCAL: 'Cancel',
        LB_ERROR_NAME: 'Name required.',
        LB_ERROR_EMAIL: 'Email required.',
        LB_ERROR_EMAIL_VALID: 'We only accept business email.',
        LB_ERROR_MESSAGE_BODY: 'Message required.',
        LB_ERROR_SERVER: 'System is busy, please try later.',
    };
    const cn = {
        LB_FORM_TITLE: '联系我们',
        LB_YOUR_NAME: '姓名(必填)',
        LB_YOUR_EMAIL: '邮件(必填)',
        LB_YOUR_MESSAGE: '说点什么',
        LB_YOUR_BUTTON_SEND: '提交',
        LB_YOUR_BUTTON_CANCAL: '取消',
        LB_ERROR_NAME: '姓名是必填项.',
        LB_ERROR_EMAIL: '邮件是必填项.',
        LB_ERROR_EMAIL_VALID: '您填写的邮件格式不对.',
        LB_ERROR_MESSAGE_BODY: '消息内容是必填项.',
        LB_ERROR_SERVER: '系统繁忙, 请稍候再试.',
    };
    const tr = {
        LB_FORM_TITLE: 'Bizimle İletişime Geçiniz',
        LB_YOUR_NAME: 'Adınız (gerekli)',
        LB_YOUR_EMAIL: 'Mail adresiniz (gerekli)',
        LB_YOUR_MESSAGE: 'Mesajınız',
        LB_YOUR_BUTTON_SEND: 'Gönder',
        LB_YOUR_BUTTON_CANCAL: 'İptal',
        LB_ERROR_NAME: 'İsim Gerekli.',
        LB_ERROR_EMAIL: 'Email Gerekli.',
        LB_ERROR_EMAIL_VALID: 'Geçerli bir email gerekli.',
        LB_ERROR_MESSAGE_BODY: 'Mesaj gerekli.',
        LB_ERROR_SERVER: 'Sistem meşgül daha sonra deneyiniz.',
    };

    this.getLang = function(key) {
        if(key.toLowerCase() === 'en'){
            return en;
        }else{
            return cn;
        }
    }
}

module.exports = VuepressCustomPopupLang;
