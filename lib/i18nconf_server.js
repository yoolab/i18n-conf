var locale = Npm.require('locale');
var locales;
var supported;

I18NConf.prototype.getLang = function () {

    locales = new locale.Locales(context.request.headers["accept-language"]);
    var lang = locales.best(supported);
    if (!lang) {
        lang = this.getDefaultLanguage();
    }

    return lang;

};


Meteor.startup(function () {

    if (I18NConf.options.autoConfLanguage) {
        supported = new locale.Locales(I18NConf.options.languages);
        locale.Locale["default"] = new locale.Locale(I18NConf.getDefaultLanguage() || "en");
    }

});
