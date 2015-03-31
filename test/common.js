initConf = function () {

    return new I18NConf.Conf;

};

defaultConf = function (conf) {

    conf.configure({

        serverSide: true,

        defaultLang: 'de',

        langs: ['it', 'es', 'en'],

        persistLang: false

    });

};
