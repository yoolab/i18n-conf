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

    this.version = "0.3.4";

    this.language = null;

    this._isLanguageSet = false;

    this.languageDep = new Deps.Dependency();

    this.options = _.clone(defaultOptions);

    this.langChangeCbs = [];

    this.configureCbs = [];

    this.init();

    if (options) {
        this.configure(options);
    }

    if (lang) {
        this.setLanguage(lang);
    }

    return this;

};

Conf.prototype.Conf = Conf;

Conf.prototype.configure = function (options) {

    var self = this;

    var opts = options || {};

    this.options = _.extend(this.options, opts);

    // Check for inconsistent configuration options
    if (this.options.languages && this.options.languages.length < 1) {
        console.log("Warning: languages parameter empty, configuring with languages = ['en'] ");
        this.options.languages = ['en'];
    }

    if (this.options.defaultLanguage && !this.isLanguageSupported(this.options.defaultLanguage)) {
        console.log("Warning: default language not supported ");
        this.options.defaultLanguage = this.options.languages[0];
    }

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

    if (oldLang == newLang && this._isLanguageSet) {
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

    if (!lang) {
        lang = this.getLanguage();
    }

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

    return this._isLanguageSet;

};

Conf.prototype.getPersistedLanguage = function () {

    var persistedLanguage = null;

    if (this.options.getPersistedLanguage) {
        persistedLanguage = this.options.getPersistedLanguage.call(this);
    }
    return (persistedLanguage === '' || !persistedLanguage) ? null : persistedLanguage;
};

Conf.prototype.setPersistedLanguage = function (lang) {

    if (this.isLanguageSupported(lang) && this.options.setPersistedLanguage) {
        this.options.setPersistedLanguage.call(this, lang);
        return lang;
    }

    return null;

};

Conf.prototype.removePersistedLanguage = function () {

    if (this.options.removePersistedLanguage) {
        this.options.removePersistedLanguage.call(this);
    }

};

Conf.prototype.reset = function (full) {

    this.removePersistedLanguage();

    this.options = defaultOptions;

    this.language = null;

    this._isLanguageSet = false;

    if (full) {

        this.langChangeCbs = [];
        this.configureCbs = [];

    }


};

Conf.prototype.normalizeLanguage = function (lang) {

    // Normalize navlang to lc-cc
    lang = lang.toLowerCase();
    lang = lang.replace('_', '-');
    return lang;

};

Conf.prototype.init = function () {
};
