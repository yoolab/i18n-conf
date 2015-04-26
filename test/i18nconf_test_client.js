Tinytest.add('i18n-conf - test html lang attribute', function (test) {

    var i18nconf = initConf();

    defaultConf(i18nconf);

    test.equal(document.getElementsByTagName('html')[0].getAttribute('lang'), 'en');

    i18nconf.setLanguage('it');
    test.equal(document.getElementsByTagName('html')[0].getAttribute('lang'), 'it');


});


Tinytest.add('i18n-conf - test persistLanguage', function (test) {

    var i18nconf = initConf();

    defaultConf(i18nconf);

    i18nconf.configure({
        persistLanguage: true
    });

    i18nconf.setPersistedLanguage('es');
    test.equal(i18nconf.getPersistedLanguage(), 'es');
    test.isTrue(i18nconf.isLanguageSet());


    i18nconf.setLanguage('it');
    test.equal(i18nconf.getPersistedLanguage(), 'it');

    i18nconf.setLanguage('en');
    test.equal(i18nconf.getPersistedLanguage(), 'en');

    // Unsupported language
    i18nconf.setLanguage('pl');
    test.equal(i18nconf.getPersistedLanguage(), 'en');

    i18nconf.removePersistedLanguage();
    test.equal(i18nconf.getPersistedLanguage(), null);


});


Tinytest.add('i18n-conf - test currentLang', function (test) {

    I18NConf.setLanguage('en');
    defaultConf(I18NConf);

    I18NConf.setLanguage('es');

    var currentLang = Blaze._globalHelpers['currentLang'];

    // Test helper
    test.equal(currentLang(), 'es', 'Current language is not es as configured.');

    var runCount = 0;

    // Test helper reactivity
    Tracker.autorun(function () {

        var lang = currentLang();

        if (!Tracker.currentComputation.firstRun) {
            runCount++;
            test.equal(lang, 'it', 'Current language is not es as configured.');
        }
    });

    I18NConf.setLanguage('it');
    Tracker.flush();
    test.equal(runCount, 1);

});