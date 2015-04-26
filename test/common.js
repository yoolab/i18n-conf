initConf = function () {

    var i18nConf = new I18NConf.Conf;
    i18nConf.removePersistedLanguage();
    return i18nConf;
};

defaultConf = function (conf) {

    conf.configure({

        serverSide: true,

        defaultLanguage: 'de',

        languages: ['it', 'es', 'en'],

        persistLanguage: false

    });

};
