Conf = function (options, lang) {

    this._version = "0.1.0";

    this._language = null;

    this.isLanguageSet = false;

    this._languageDep = new Deps.Dependency();

    this.options = {

        defaultLanguage: 'en',

        serverSide: true,

        languages: ['en'],

        autoConfLanguage: true

    };

    this.init();

    this.configure(options);

    if (lang) {
        this.setLanguage(lang);
    }

    this.langChangeCbs = [];

    return this;

};

Conf.prototype.Conf = Conf;

Conf.prototype.configure = function (options) {

    this.options = _.extend(this.options, options);

};

Conf.prototype.onLanguageChange = function (cb) {
    this.langChangeCbs.push(cb);
};

Conf.prototype.setLanguage = function (lang) {

    var self = this;
    var oldLang = this._language;
    var newLang = lang;

    if (!this.isLanguageSupported(lang)) {
        console.log("Warning: refusing to set a non supported language [" + lang + "].");
        return;
    }

    if (oldLang == newLang) {
        console.log("Warning: asked to change language to [" + lang + "] but this is already the current language.");
        return;
    }

    this._language = lang;

    _.each(this.langChangeCbs, function (cb) {
        cb.call(self, oldLang, newLang);
    });

    this.isLanguageSet = true;

    if (this.options.persistLanguage) {
        this.options.persistLanguage.call(this, lang);
    }

    this._languageDep.changed();
};

Conf.prototype.getLanguage = function () {

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
        lang = this.getDefaultLanguage();
    }

    return lang;
};

Conf.prototype.getDefaultLanguage = function () {

    if (this.options.getDefaultLanguage) {
        return this.options.getDefaultLanguage.call(this);
    }

    return this.options.defaultLanguage;

};

Conf.prototype.isLanguageSupported = function (lang, exactMatch) {

    lang = this.normalizeLanguage(lang);

    var bestLang = this.getBestMatchingLanguage(lang);

    if (lang == bestLang) {
        return true;
    }

    if (!exactMatch && lang.substr(0, 2) == bestLang) {
        return true;
    }

    return false;

};

Conf.prototype.getBestMatchingLanguage = function (lang) {

    var resultLang;

    lang = this.normalizeLanguage(lang);

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
        resultLang = this.getDefaultLanguage();
    }

    return resultLang;

};

Conf.prototype.normalizeLanguage = function(lang) {

    // Normalize navlang to lc-cc
    lang = lang.toLowerCase();
    lang = lang.replace('_', '-');
    return lang;

};

Conf.prototype.init = function () {};
