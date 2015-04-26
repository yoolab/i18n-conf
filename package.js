Package.describe({
    summary: 'i18n configuration package',
    git: "https://github.com/yoolab/i18n-conf.git",
    name: "martino:i18n-conf",
    version: '0.3.0'
});

Package.onUse(function (api) {

    api.versionsFrom('1.0');

    api.use('tracker@1.0.5', ['client', 'server']);
    api.use('underscore@1.0.2', ['client', 'server']);

    api.addFiles('lib/i18nconf.js', ['client', 'server']);
    api.addFiles('lib/i18nconf_client.js', ['client']);
    api.addFiles('lib/i18nconf_init.js', ['client', 'server']);

    api.export('I18NConf', ['client', 'server']);

});

Package.onTest(function (api) {

    api.use('underscore@1.0.2', ['client', 'server']);
    api.use('martino:i18n-conf@0.3.0', ['client', 'server']);

    api.use('tinytest', ['client', 'server']);
    api.use('test-helpers', ['client', 'server']);

    api.addFiles('test/common.js', ['client', 'server']);
    api.addFiles('test/i18nconf_test.js', ['client', 'server']);
    api.addFiles('test/i18nconf_test_client.js', ['client']);


});
