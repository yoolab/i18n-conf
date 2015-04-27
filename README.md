# i18n conf 

i18n configuration package for [meteorjs](https://www.meteor.com/). 

This package just provide basic support for i18 configuration, it is meant to be used by other i18n package in order to achieve common tasks like configuring supported languages, autoconfigure language etc.

# About

This package was created to avoid repeating some common tasks for i18n packages, provides common i18n functionalities and a central configuration/management point for i18n (supported languages configuration, setting/getting current language etc.)

It was originally created to support [Iron Router i18n](https://atmospherejs.com/martino/iron-router-i18n). See also [this issue](https://github.com/yoolab/iron-router-i18n/issues/46).


## History

**Latest Version:** 0.3.1

See the [History.md](https://github.com/yoolab/i18n-conf/blob/master/History.md) file for changes (including breaking changes) across versions.

### Features:

* Allow to centrally store and change common i18n configuration useful for several i18n packages. 
* It can be easily integrated with any existing i18n package or functionality (or at least it aims to) through the ```I18NConf.onLanguageChange(cb)``` and ```I18NConf.onConfigure(cb)``` methods.
* Language autoconfiguration mechanism.
* Persist language between requests
* Several tweaking and configuration options
* Provides some 18n utility methods to guess best matching language, get navigator language etc.
* Automatically change html lang attribute to current lang


## Packages using i18n-conf as a configuration mechanism

* [Iron Router i18n](https://atmospherejs.com/martino/iron-router-i18n) (since version 0.5.5)


##  Installation

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
    
    ...
       
    I18NConf.onLanguageChange(function(oldLang, newLang) {
               // Do something else interesting for my app or my package each time the language change
    });
    
    ...
    
    I18NConf.onConfigure(function(options) {
            // Do something interesting for my app or my package each time I18NConf is configured
            // can be used to configure other i18n package from I18NConf configuration
    });

     
```

Most of the time you will just need to use basic features/methods, default configuration options will provide most of functionality.


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

#### persistLanguage

Whether or not to persist the language when selecting it with ```I18NConf.setLanguage(lang)```. Default true.


#### persistCookieExpiration

The value in microseconds of the cookie expiration date set by default implementation of ```persistLanguage```. Can be an integer value or a function returning an integer value.

#### persistCookieName

The name of the cookie used to persist the language (default ```'martino:i18n-conf:lang'```)

#### getPersistedLanguage

Function defining how to retrieve the persisted language (default retrieve the value of a cookie)

#### setPersistedLanguage(lang)

Function defining how to set the persisted language (default sets the value of a cookie)


#### removePersistedLanguage

Function defining how to remove the currently persisted language (default reset the value of the cookie).


### Methods


#### I18NConf.onConfigure(cb)

Main method used to integrate I18N Conf with other i18n packages. The method callbacks added through this method will be called whenever ```I18NConf.configure(options)``` is called ginvig the opportunity to configure other i18n packages.
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

Method used to integrate I18N Conf with other i18n packages. The method callback added through this method will be called whenever ```I18NConf.setLanguage(lang)``` is changed and the language is actually changed.
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

Change the current language.

#### I18NConf.getLanguage()

Retrieves the current language.

#### I18NConf.getDefaultLanguage()

Gets the default language for the app (see `defaultLanguage` property and `getDefaultLanguage` hook)

#### I18NConf.isLanguageSet()

Returns true when the language was explicitly set that is if ```setLanguage```method was called at least once or the language was previously persisted (in case language persistence is enabled). Can be useful to know whether ```getLanguage``` is just returning the default language or a language explicitly set.

#### I18NConf.getPersistedLanguage()

Return the currently persisted language (or ```null``` if no language is persisted)

#### I18NConf.setPersistedLanguage(lang)

Set the currently persisted language.

#### I18NConf.removePersistedLanguage()

Remove the currently persisted language.

#### I18NConf.reset(full)

Reset I18NConf configuration to its default configuration. By passing ```true``` as argument will also remove persisted language and onLanguageChange/onConfigure hooks (use with caution with this option as it may break other package hooks).

#### I18NConf.isLanguageSupported(lang, exactMatch)

Returns true is the language is supported by the application, if the second argument is present and true it will search for an exact match (e.g. with second argument set to true "es-ar" will NOT be supported if "es" is supported).

#### I18NConf.getBestMatchingLanguage(lang)

Returns the language best matching the passed language. It returns the default language if no language is matched.

#### I18NConf.normalizeLanguage(lang)

Returns a lowercase dash separated version of (useful to convert from some other formats using underscore as a separator and/or uppercase country codes.

#### I18NConf.getNavigatorLanguage() [Just client side]

Returns the navigator language.

#### I18NConf.getNavigatorLanguages() [Just client side]

Returns all the navigator supported languages.


### Helpers

#### currentLang

```{{currentLang}}``` will return the current language (reactive)


## License

MIT
