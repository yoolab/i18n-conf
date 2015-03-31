I18NConf = function (options, lang) {

    this._version = "0.1.0";

    this._language = null;

    this._isLanguageSet = false;

    this._languageDep = new Deps.Dependency();

    this.options = {

        defaultLanguage: 'en',

        serverSide: true,

        languages: ['en'],

        autoConfLanguage: false

    };

    this.init();

    this.configure(options);

    if (lang) {
        this.setLang(lang);
    } else {
        this._language = this.getDefaultLang();
    }

    this.langChangeCbs = [];

    return this;

};

I18NConf.prototype.configure = function (options) {

    this.options = _.extend(this.options, options);

};

I18nConf.prototype.onLangChange = function (cb) {
    this.langChangeCbs.push(cb);
};

I18NConf.prototype.setLang = function (lang) {

    var self = this;

    this._language = lang;

    this._isLanguageSet = true;

    _.each(this.langChangeCbs, function (cb) {
        cb.call(self);
    });

    if (this.options.persistLanguage) {
        this.options.persistLanguage.call(this, lang);
    }

    this._languageDep.changed();
};

I18NConf.prototype.getLang = function () {

    this._languageDep.depend();

    var lang = null;

    if (this.options.persistLanguage) {
        lang = this.options.persistLanguage.call(this);
        if (lang) {
            return lang;
        }
    }

    lang = this._language;

    if (!lang) {
        lang = this.getDefaultLang();
    }

    return lang;
};

I18NConf.prototype.getLangDep = function () {

    return this._languageDep;

};

I18NConf.prototype.getDefaultLang = function () {

    if (this.options.getDefaultLang) {
        return this.options.getDefaultLang.call(this);
    }

    return 'en';

};

I18NConf.prototype.isLangSet = function () {
    return this._isLanguageSet;
};

I18NConf.prototype.isLangSupported = function (lang, exactMatch) {

    var bestLang = this.getBestMatchingLanguage(lang);

    if (lang == bestLang) {
        return true;
    }

    if (!exactMatch && lang.substr(0, 2) == bestLang) {
        return true;
    }

    return false;

};

I18NConf.prototype.getBestMatchingLang = function (lang) {

    var resultLang;
    // Normalize navlang to lc-cc
    lang = lang.toLowerCase();
    lang = lang.replace('_', '-');

    if (_.contains(this.options.languages, lang)) {
        resultLang = lang;
    }

    if (!resultLang) {
        lang = lang.substr(0, 2);
        if (_.contains(this.options.languages, lang)) {
            resultLang = lang;
        }
    }

    if (!resultLang) {
        resultLang = Router.getDefaultLang();
    }

    return resultLang;

};

I18NConf.prototype.init = function () {
};
