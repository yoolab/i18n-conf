// Thanks to http://www.w3schools.com/js/js_cookies.asp :-)
function setCookie(cname, cvalue, microsecs) {
    var d = new Date();
    d.setTime(d.getTime() + microsecs);
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
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

I18NConf.prototype.getNavLang = function () {

    // See https://alicoding.com/detect-browser-language-preference-in-firefox-and-chrome-using-javascript/
    return navigator.languages ? navigator.languages[0] : (navigator.language || navigator.userLanguage);

};

I18NConf.prototype.init = function () {

    I18NConf.configure({

        persistLanguage: function (lang) {

            if (lang) {

                var expire = 2147483647;

                if (this.options.persistCookieExpiration) {

                    if (_.isFunction(this.options.persistCookieExpiration)) {
                        expire = this.options.persistCookieExpiration.call(this);
                    } else {
                        expire = this.options.persistCookieExpiration;
                    }

                    setCookie('martino:i18n-conf:lang', lang, expire);
                }

            }

            return getCookie('martino:i18n-conf:lang');

        },

        // Longest expiration, see http://stackoverflow.com/questions/3290424/set-a-cookie-to-never-expire
        persistCookieExpiration: 2147483647

    });

};


Meteor.startup(function () {

    if (I18NConf.options.autoConfLanguage) {

        var navLang = I18NConf.getNavLang();
        var bestLang = I18NConf.getBestMatchingLang(navLang);
        I18NConf.setLang(bestLang);

    }

});