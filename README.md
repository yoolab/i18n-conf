# i18n conf 

i18n configuration package for [meteorjs](https://www.meteor.com/). 

This package just provide basic support for i18 configuration, it is meant to be used bu other i18n package in order to 
achieve common tasks like configuring supported languages, autoconfigure language etc.

# About

Will be used in future versions of [Iron Router i18n](https://atmospherejs.com/martino/iron-router-i18n). 
See [this issue](https://github.com/yoolab/iron-router-i18n/issues/46) for the reason I'm creating this package.


## History

**Latest Version:** 0.2.0

See the [History.md](https://github.com/yoolab/i18n-conf/blob/master/History.md) file for changes (including breaking 
changes) across versions.

### Features:

* Allow to centrally store and change common i18n configuration useful for several i18n packages. 
* It can be easily integrated with any existing i18n package or functionality (or at least it aims to) through
the ```I18NConf.onLanguageChange(cb)``` and ```I18NConf.onConfigure(cb)``` methods.
* Language autoconfiguration mechanism.
* Persist language between requests
* Several tweaking and configuration options
* Provides some 18n utility methods to guess best matching language, get navigator language etc.


## Packages using i18n-conf as a configuration mechanism

* [Iron Router i18n](https://atmospherejs.com/martino/iron-router-i18n)


### TODO:

* Integrate with user accounts: give the possibility to change current language on login based on user language
with an ```I18NConf.onUserLanguage(cb)``` hook.



##  Installation

Install latest master by copying it's content into a directory called ```packages/martino:i18n-conf```
and execute:

``` sh
$ meteor add martino:i18n-conf
```

It will create ```I18NConf``` global object.


## Docs

### Basic configuration

Here below a very basic example configuring the system for three languages:

 
```javascript

    I18NConf.configure({
         
         defaultLanguage: 'en',
         
         languages: ['es', 'en'],
         
         autoConfLanguage: false
 
     });

    I18NConf.onLanguageChange(function(oldLang, newLang) {
        // Do something interesting for my app or my package each time the language change
    });
    
    I18NConf.onConfigure(function(options) {
            // Do something interesting for my app or my package each time I18NConf is configured
            // can be used to configure other i18n package from I18NConf configuration
    });

     
```


### Basic usage

Just set the language.

```javascript

I18NConf.setLanguage('es')

```

Or use other utility methods.


### Configuration options

#### languages

Array that specify the languages supported by the application

E.g.

```javascript
I18NConf.configure({

    ...

    languages: ['en', 'es', 'it']

    }
});
```

#### defaultLanguage

Set the default language for I18N Conf (defaults to `'en'`).

#### autoConfLanguage

If set to true I18N Conf will try to autodetect the best language to use for current browser/request (defaults to true).

#### serverSide

Enable (true) or disable (false) server side functionality (default: true).

#### persistLanguage(lang)

Can be used client and server side to persist the chosen language between requests. Default implementation (just client side)
uses a cookie to store the selected language. Any implementation should use ```lang``` parameter to set the language and always 
return the currently stored language whether called with or without a parameter. Just set to ```false``` if you want to disable
language persistance between requests.

#### persistCookieExpiration

The value in microseconds of the cookie expiration date set by default implementation of ```persistLanguage```. Can be an integer
value or a function returning an integer value.



### Methods


#### I18NConf.onConfigure(cb)

Main method used to integrate I18N Conf with other i18n packages. The method callbacks added through this method will be 
called whenever ```I18NConf.configure(options)``` is called ginvig the opportunity to configure other i18n packages.
The callback function is passed all the I18NConf options configured at the moment.

```javascript

// Package A integration
I18NConf.onConfigure(function(options) {
    // configure i18n package A
});

// Package B integration
I18NConf.onConfigure(function(options) {
   // configure i18n package B
});

// Whatever
I18NConf.onConfigure(function(options) {
   // do whatever
});


```

#### I18NConf.onLanguageChange(cb)

Method used to integrate I18N Conf with other i18n packages. The method callback added through this method
will be called whenever ```I18NConf.setLanguage(lang)``` is changed and the language is actually changed.
The callback function is passed two values: the old language and the new language:

```javascript

// Package A integration
I18NConf.onLanguageChange(function(oldLang, newLang) {
    // do something with package A
});

// Package B integration
I18NConf.onLanguageChange(function(oldLang, newLang) {
   // do something with package B
});

// Whatever
I18NConf.onLanguageChange(function(oldLang, newLang) {
   // do whatever
});


```


#### I18NConf.setLanguage(lang)

Programmatically change the application language.

#### I18NConf.getLanguage()

Retrieves the current language.

#### I18NConf.getDefaultLanguage()

Gets the default language for the app (see `defaultLanguage` property and `getDefaultLanguage` hook)

#### I18NConf.isLanguageSet

Is true if the language was explicitly set (i.e. if ```setLanguage```method was called at least once). Can be useful
to know whether ```getLanguage``` is just returning the default language or a language explicitly set.

#### I18NConf.isLanguageSupported(lang, exactMatch)

Returns true is the language is supported by the application, if the second argument is present and true it will search
for an exact match (e.g. with second argument set to true "es-ar" will NOT be supported if "es" is supported).

#### I18NConf.getBestMatchingLanguage(lang)

Returns the language best matching the passed language. It returns the default language if no language is matched.

#### I18NConf.normalizeLanguage(lang)

Returns a lowercase dash separated version of (useful to convert from some other formats using underscore as a separator
and/or uppercase country codes.

#### I18NConf.getNavigatorLanguage() [Just client side]

Returns the navigator language.

#### I18NConf.getNavigatorLanguages() [Just client side]

Returns all the navigator supported languages.


## License

MIT
