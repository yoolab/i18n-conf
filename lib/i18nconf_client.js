// Thanks to http://www.w3schools.com/js/js_cookies.asp :-)
function setCookie(cname, cvalue, microsecs, path) {
    path = path || '/';
    var d = new Date();
    d.setTime(d.getTime() + microsecs);
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires + "; path=" + path;
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}

Conf.prototype.getNavigatorLanguage = function () {

    // See https://alicoding.com/detect-browser-language-preference-in-firefox-and-chrome-using-javascript/
    return navigator.languages ? navigator.languages[0] : (navigator.language || navigator.userLanguage);

};

Conf.prototype.getNavigatorLanguages = function () {

    return navigator.languages;

};

Conf.prototype.init = function () {

    this.configure({

        getPersistedLanguage: function () {

            return getCookie(this.options.persistCookieName);

        },

        setPersistedLanguage: function (lang) {

            if (lang) {

                // Longest expiration, see http://stackoverflow.com/questions/3290424/set-a-cookie-to-never-expire
                var expire = this.options.persistCookieExpiration || 2147483647;

                var persistCookieName = this.options.persistCookieName || 'martino:i18n-conf:lang';

                if (this.options.persistCookieExpiration) {

                    if (_.isFunction(expire)) {
                        expire = expire.call(this);
                    }

                }

                setCookie(persistCookieName, lang, expire);

            }

        },

        removePersistedLanguage: function () {
            setCookie(this.options.persistCookieName, '', 0);
        }

    });

    // Change html lang attribute to current lang
    this.onLanguageChange(function (oldLang, newLang) {
        if (document && document.getElementsByTagName('html')
            && document.getElementsByTagName('html').length == 1) {
            document.getElementsByTagName('html')[0].setAttribute('lang', newLang);
        }
    });

    this.onConfigure(function (options) {
        if (!this.isLanguageSet() && this.options.autoConfLanguage) {
            var navLang = this.getNavigatorLanguage();
            var bestLang = this.getBestMatchingLanguage(navLang);
            this.setLanguage(bestLang);
        }
    });

    if (document && document.getElementsByTagName('html')
        && document.getElementsByTagName('html').length == 1) {
        document.getElementsByTagName('html')[0].setAttribute('lang', this.getDefaultLanguage());
    }

};

/**
 * Reactively show the current language
 *
 * Example Use:
 *
 *  {{currentLang}}
 */
UI.registerHelper('currentLang', function (opts) {

    // Can use custom (useful for tests)
    var conf = opts && opts.i18nConf ? opts.i18nConf : I18NConf;

    conf.languageDep.depend();

    return conf.getLanguage();

});


