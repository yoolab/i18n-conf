/*****************************************************************************/
/* Server and Client */
/*****************************************************************************/


Tinytest.add('i18n-conf - test I18NConf configuration', function (test) {

    var i18nconf = initConf();

    defaultConf(i18nconf);

    i18nconf.configure({

        defaultLanguage: 'es'

    });

    // Test configured options
    test.equal(i18nconf.options.defaultLanguage, 'es', 'Default language for client is not "es".');
    test.equal(i18nconf.options.languages[0], 'it', 'First language for client is not "it".');
    test.equal(i18nconf.options.languages[1], 'es', 'Second language for client is not "es".');
    test.equal(i18nconf.options.languages[2], 'en', 'Third language for client is not "en".');

    // Test default options
    test.isTrue(i18nconf.options.serverSide, 'Default value for serverSide option is not "true" .');

});


Tinytest.add('i18n-conf - test I18NConf language methods', function (test) {

    var i18nconf = initConf();

    test.equal(i18nconf.getDefaultLanguage(), 'en', 'I18NConf default language is not "en".');

    i18nconf = initConf();

    i18nconf.configure({

        defaultLanguage: 'es',

        languages: ['it', 'es', 'en'],

        autoConfLanguage: false,

        persistLanguage: false

    });


    test.equal(i18nconf.getDefaultLanguage(), 'es', 'I18NConf default language after changing "defaultLang" conf option is not "es".');

    // Testing getLanguage
    test.equal(i18nconf.getLanguage(), 'es', 'I18NConf language is not "es" when having defaultLang "es".');

    //Testing language change
    i18nconf.setLanguage('it');
    test.equal(i18nconf.getLanguage(), 'it', 'I18NConf did not change language to "it"');


    // Testing custom getDefaultLang method
    i18nconf = initConf();

    i18nconf.configure({

        i18n: {

            getDefaultLanguage: function () {
                return 'en';
            },

            languages: ['it', 'es', 'en'],

            // Avoid to persist language between tests!
            persistLanguage: false,

            autoConfLanguage: false


        }
    });

    test.equal(i18nconf.getDefaultLanguage(), 'en', 'I18NConf default language is not "en" after setting getDefaultLang method.')

});

Tinytest.add('i18n-conf - test getBestMatchingLang', function (test) {

    var i18nconf = initConf();

    i18nconf.configure({

        defaultLanguage: 'en',

        languages: ['it', 'es', 'en', 'es-ch']

    });

    test.equal(i18nconf.getBestMatchingLanguage('es-AR'), 'es');

    test.equal(i18nconf.getBestMatchingLanguage('es_AR'), 'es');

    test.equal(i18nconf.getBestMatchingLanguage('ES_AR'), 'es');

    test.equal(i18nconf.getBestMatchingLanguage('ES-CH'), 'es-ch');

    test.equal(i18nconf.getBestMatchingLanguage('it'), 'it');

});

Tinytest.add('i18n-conf - test isLangSupported', function (test) {

    var i18nconf = initConf();

    i18nconf.configure({

        defaultLanguage: 'en',

        languages: ['it', 'es', 'en', 'es-ar']

    });

    test.isTrue(i18nconf.isLanguageSupported('es-AR'));
    test.isTrue(i18nconf.isLanguageSupported('it'));
    test.isFalse(i18nconf.isLanguageSupported('de'));
    test.isFalse(i18nconf.isLanguageSupported('es-ch', true));


});

Tinytest.add('i18n-conf - test isLangSet', function (test) {

    var i18nconf = initConf();

    i18nconf.configure({

        defaultLanguage: 'en',

        languages: ['it', 'es', 'en', 'es-ar'],

        autoConfLanguage: false

    });

    test.isFalse(i18nconf.isLanguageSet());
    i18nconf.setLanguage('it');
    test.isTrue(i18nconf.isLanguageSet());



});

Tinytest.add('i18n-conf - test onLangChange', function (test) {

    var i18nconf = initConf();

    i18nconf.configure({

        defaultLanguage: 'en',

        languages: ['it', 'es', 'en', 'es-ar'],

        autoConfLanguage: false

    });

    var oldLangVar = 'xx';
    var newLangVar = 'xx';
    var counter = 0;

    reset = function () {
        oldLangVar = null;
        newLangVar = null;
        counter = 0;
    };

    i18nconf.onLanguageChange(function (oldLang, newLang) {
        oldLangVar = oldLang;
        newLangVar = newLang;
    });

    i18nconf.onLanguageChange(function(oldLang, newLang) {
        counter++;
    });

    i18nconf.setLanguage('it');

    test.equal(oldLangVar, undefined);
    test.equal(newLangVar, 'it');
    test.equal(counter, 1);


    i18nconf.setLanguage('es');

    test.equal(oldLangVar, 'it');
    test.equal(newLangVar, 'es');
    test.equal(counter, 2);


});

Tinytest.add('i18n-conf - test languageDepend', function (test) {

    var i18nconf = initConf();
    defaultConf(i18nconf);

    var reactive = false;

    Tracker.autorun(function () {
        I18NConf.languageDep.depend();
        reactive = true;
    });

    I18NConf.setLanguage('it');
    Tracker.flush();
    test.isTrue(reactive, true);

});

Tinytest.add('i18n-conf - test getLanguage reactivity', function (test) {

    var i18nconf = initConf();
    defaultConf(i18nconf);


    // Test helper
    test.equal(i18nconf.getLanguage(), 'en', 'Current language is not en as configured.');

    var runCount = 0;

    // Test helper reactivity
    Tracker.autorun(function () {

        var lang = i18nconf.getLanguage();

        if (!Tracker.currentComputation.firstRun) {
            runCount++;
            test.equal(lang, 'it', 'Current language is not it as configured.');
        }
    });

    i18nconf.setLanguage('it');
    Tracker.flush();
    test.equal(runCount, 1);

});

