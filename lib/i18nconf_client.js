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

Conf.prototype.getNavLang = function () {

    // See https://alicoding.com/detect-browser-language-preference-in-firefox-and-chrome-using-javascript/
    return navigator.languages ? navigator.languages[0] : (navigator.language || navigator.userLanguage);

};

Conf.prototype.init = function () {

    this.configure({

        persistLang: function (lang) {

            if (lang) {

                var expire = 2147483647;

                if (this.options.persistCookieExp) {

                    if (_.isFunction(this.options.persistCookieExp)) {
                        expire = this.options.persistCookieExp.call(this);
                    } else {
                        expire = this.options.persistCookieExp;
                    }

                    setCookie('martino:i18n-conf:lang', lang, expire);
                }

            }

            return getCookie('martino:i18n-conf:lang');

        },

        // Longest expiration, see http://stackoverflow.com/questions/3290424/set-a-cookie-to-never-expire
        persistCookieExp: 2147483647

    });

};


Meteor.startup(function () {

    if (I18NConf.options.autoConfLang) {

        var navLang = I18NConf.getNavLang();
        var bestLang = I18NConf.getBestMatchingLang(navLang);
        I18NConf.setLang(bestLang);

    }

});