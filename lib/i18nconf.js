var defaultOptions = {

    defaultLanguage: 'en',

    serverSide: true,

    languages: ['en'],

    autoConfLanguage: true,

    persistLanguage: true,

    persistCookieName: 'martino:i18n-conf:lang',

    persistCookieExpiration: 2147483647

};


Conf = function (options, lang) {

    this.version = "0.3.0";

    this.language = null;

    this._isLanguageSet = false;

    this.languageDep = new Deps.Dependency();

    this.options = _.clone(defaultOptions);

    this.init();

    this.configure(options);

    if (lang) {
        this.setLanguage(lang);
    }

    this.langChangeCbs = [];

    this.configureCbs = [];

    return this;

};

Conf.prototype.Conf = Conf;

Conf.prototype.configure = function (options) {

    var self = this;
    this.options = _.extend(this.options, options);

    _.each(this.configureCbs, function (cb) {
        cb.call(self, self.options);
    });

};

Conf.prototype.onLanguageChange = function (cb) {
    this.langChangeCbs.push(cb);
};

Conf.prototype.onConfigure = function (cb) {
    this.configureCbs.push(cb);
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

    this._isLanguageSet = true;

    if (this.options.persistLanguage && this.options.setPersistedLanguage) {
        this.options.setPersistedLanguage.call(this, lang);
    }

    this.languageDep.changed();
};

Conf.prototype.getLanguage = function () {

    this.languageDep.depend();

    var lang = null;

    if (this.options.persistLanguage && this.options.getPersistedLanguage) {
        lang = this.options.getPersistedLanguage.call(this);
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

Conf.prototype.isLanguageSet = function () {

    var persistedLang = false;

    if (this.options.persistLanguage && this.options.getPersistedLanguage) {
        persistedLang = this.options.getPersistedLanguage.call(this);
    }

    if (this._isLanguageSet || persistedLang) {
        return true;
    }

    return false;

};

Conf.prototype.getPersistedLanguage = function () {

    if (this.options.getPersistedLanguage) {
        return this.options.getPersistedLanguage.call(this);
    }
    return null;
};

Conf.prototype.setPersistedLanguage = function (lang) {

    if (this.options.setPersistedLanguage) {
        return this.options.setPersistedLanguage.call(this, lang);
    }

    return null;

};

Conf.prototype.removePersistedLanguage = function() {

    if (this.options.removePersistedLanguage) {
        this.options.removePersistedLanguage.call(this);
    }

};

Conf.prototype.reset = function () {

    this.removePersistedLanguage();

    this.options = defaultOptions;

    this.language = null;

    this._isLanguageSet = false;

    this.langChangeCbs = [];

    this.configureCbs = [];


};

Conf.prototype.normalizeLanguage = function (lang) {

    // Normalize navlang to lc-cc
    lang = lang.toLowerCase();
    lang = lang.replace('_', '-');
    return lang;

};

Conf.prototype.init = function () {
};
