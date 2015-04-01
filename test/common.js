initConf = function () {

    return new I18NConf.Conf;

};

defaultConf = function (conf) {

    conf.configure({

        serverSide: true,

        defaultLanguage: 'de',

        languages: ['it', 'es', 'en'],

        persistLanguage: false

    });

};
