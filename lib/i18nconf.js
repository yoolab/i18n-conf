Conf = function (options, lang) {

    this._version = "0.1.0";

    this._language = null;

    this._isLanguageSet = false;

    this._languageDep = new Deps.Dependency();

    this.options = {

        defaultLang: 'en',

        serverSide: true,

        langs: ['en'],

        autoConfLang: true

    };

    this.init();

    this.configure(options);

    if (lang) {
        this.setLang(lang);
    }

    this.langChangeCbs = [];

    return this;

};

Conf.prototype.Conf = Conf;

Conf.prototype.configure = function (options) {

    this.options = _.extend(this.options, options);

};

Conf.prototype.onLangChange = function (cb) {
    this.langChangeCbs.push(cb);
};

Conf.prototype.setLang = function (lang) {

    var self = this;
    var oldLang = this._language;
    var newLang = lang;

    _.each(this.langChangeCbs, function (cb) {
        cb.call(self, oldLang, newLang);
    });

    this._language = lang;

    this._isLanguageSet = true;

    if (this.options.persistLang) {
        this.options.persistLang.call(this, lang);
    }

    this._languageDep.changed();
};

Conf.prototype.getLang = function () {

    this._languageDep.depend();

    var lang = null;

    if (this.options.persistLang) {
        lang = this.options.persistLang.call(this);
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

Conf.prototype.getDefaultLang = function () {

    if (this.options.getDefaultLang) {
        return this.options.getDefaultLang.call(this);
    }

    return this.options.defaultLang;

};

Conf.prototype.isLangSet = function () {
    return this._isLanguageSet;
};

Conf.prototype.isLangSupported = function (lang, exactMatch) {

    lang = this.normalizeLang(lang);

    var bestLang = this.getBestMatchingLang(lang);

    if (lang == bestLang) {
        return true;
    }

    if (!exactMatch && lang.substr(0, 2) == bestLang) {
        return true;
    }

    return false;

};

Conf.prototype.getBestMatchingLang = function (lang) {

    var resultLang;

    lang = this.normalizeLang(lang);

    if (_.contains(this.options.langs, lang)) {
        resultLang = lang;
    }

    if (!resultLang) {
        lang = lang.substr(0, 2);
        if (_.contains(this.options.langs, lang)) {
            resultLang = lang;
        }
    }

    if (!resultLang) {
        resultLang = this.getDefaultLang();
    }

    return resultLang;

};

Conf.prototype.normalizeLang = function(lang) {

    // Normalize navlang to lc-cc
    lang = lang.toLowerCase();
    lang = lang.replace('_', '-');
    return lang;

};

Conf.prototype.init = function () {};
