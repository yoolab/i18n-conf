function resetCookie() {
    if (Meteor.isClient) {
        document.cookie = 'martino:i18n-conf:lang' + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }
}

resetCookie();

initConf = function () {

    resetCookie();
    return new I18NConf.Conf;

};

defaultConf = function (conf) {

    resetCookie();

    conf.configure({

        serverSide: true,

        defaultLanguage: 'de',

        languages: ['it', 'es', 'en'],

        persistLanguage: false

    });

};
