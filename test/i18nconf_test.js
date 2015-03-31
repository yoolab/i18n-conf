/*****************************************************************************/
/* Server and Client */
/*****************************************************************************/


Tinytest.add('i18n-conf - test I18NConf configuration', function (test) {

    var i18nconf = initConf();

    defaultConf(i18nconf);

    i18nconf.configure({

        defaultLang: 'es'

    });

    // Test configured options
    test.equal(i18nconf.options.defaultLang, 'es', 'Default language for client is not "es".');
    test.equal(i18nconf.options.langs[0], 'it', 'First language for client is not "it".');
    test.equal(i18nconf.options.langs[1], 'es', 'Second language for client is not "es".');
    test.equal(i18nconf.options.langs[2], 'en', 'Third language for client is not "en".');

    // Test default options
    test.isTrue(i18nconf.options.autoConfLang, 'Default value for autoCofLanguage option is not "true" .');
    test.isTrue(i18nconf.options.serverSide, 'Default value for serverSide option is not "true" .');

});


Tinytest.add('i18n-conf - test I18NConf language methods', function (test) {

    var i18nconf = initConf();

    i18nconf.configure({
        // Avoid to persist language between tests!
        persistLang: false
    });

    test.equal(i18nconf.getDefaultLang(), 'en', 'I18NConf default language is not "en".');

    i18nconf = initConf();

    i18nconf.configure({

        defaultLang: 'es',

        langs: ['it', 'es', 'en'],

        // Avoid to persist language between tests!
        persistLang: false

    });


    test.equal(i18nconf.getDefaultLang(), 'es', 'I18NConf default language after changing "defaultLang" conf option is not "es".');

    // Testing getLanguage
    test.equal(i18nconf.getLang(), 'es', 'I18NConf language is not "es" when having defaultLang "es".');

    //Testing language change
    i18nconf.setLang('it');
    test.equal(i18nconf.getLang(), 'it', 'I18NConf did not change language to "it"');


    // Testing custom getDefaultLang method
    i18nconf = initConf();

    i18nconf.configure({

        i18n: {

            getDefaultLang: function () {
                return 'en';
            },

            langs: ['it', 'es', 'en'],

            // Avoid to persist language between tests!
            persistLang: false

        }
    });

    test.equal(i18nconf.getDefaultLang(), 'en', 'I18NConf default language is not "en" after setting getDefaultLang method.')

});

Tinytest.add('i18n-conf - test getBestMatchingLang', function (test) {

    var i18nconf = initConf();

    i18nconf.configure({

        defaultLang: 'en',

        langs: ['it', 'es', 'en', 'es-ch']

    });

    test.equal(i18nconf.getBestMatchingLang('es-AR'), 'es');

    test.equal(i18nconf.getBestMatchingLang('es_AR'), 'es');

    test.equal(i18nconf.getBestMatchingLang('ES_AR'), 'es');

    test.equal(i18nconf.getBestMatchingLang('ES-CH', true), 'es-ch');

    test.equal(i18nconf.getBestMatchingLang('it'), 'it');

});

Tinytest.add('i18n-conf - test isLangSupported', function (test) {

    var i18nconf = initConf();

    i18nconf.configure({

        defaultLang: 'en',

        langs: ['it', 'es', 'en', 'es-ar']

    });

    test.isTrue(i18nconf.isLangSupported('es-AR'));
    test.isTrue(i18nconf.isLangSupported('it'));
    test.isFalse(i18nconf.isLangSupported('de'));
    test.isFalse(i18nconf.isLangSupported('es-ch', true));


});

Tinytest.add('i18n-conf - test isLangSet', function (test) {

    var i18nconf = initConf();

    i18nconf.configure({

        defaultLang: 'en',

        langs: ['it', 'es', 'en', 'es-ar']

    });

    test.isFalse(i18nconf.isLangSet());
    i18nconf.setLang('it');
    test.isTrue(i18nconf.isLangSet());



});

Tinytest.add('i18n-conf - test onLangChange', function (test) {

    var i18nconf = initConf();

    i18nconf.configure({

        defaultLang: 'en',

        langs: ['it', 'es', 'en', 'es-ar']

    });

    var oldLangVar = 'xx';
    var newLangVar = 'xx';
    var counter = 0;

    reset = function () {
        oldLangVar = null;
        newLangVar = null;
        counter = 0;
    };

    i18nconf.onLangChange(function (oldLang, newLang) {
        oldLangVar = oldLang;
        newLangVar = newLang;
    });

    i18nconf.onLangChange(function(oldLang, newLang) {
        counter++;
    });

    i18nconf.setLang('it');

    test.equal(oldLangVar, null);
    test.equal(newLangVar, 'it');
    test.equal(counter, 1);


    i18nconf.setLang('es');

    test.equal(oldLangVar, 'it');
    test.equal(newLangVar, 'es');
    test.equal(counter, 2);


});
