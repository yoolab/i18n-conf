## 0.3.4

* Improved language persistence mechanism
* Do not emit warning for changing language to current language if current language was not explicitly set 

## 0.3.3

* Reverted 0.3.2 change: browser language autoconfiguration should happen before rendering but after any possible 
language change listener is set!
* Execute configure on initialization just if we pass options in the constructor (that is don't call "configure" until
 we really configure).


## 0.3.2

* Anticipated language autoconfiguration to the initial configuration step (was in a startup clause).

## 0.3.1

* **NEW FEATURE** added ```{{currentLang}}``` reactive helper
```reset``` method don't reset hooks by default (but allows to do so by passing ```true``` as argument) 
* added consistency checks on language configuration
* added tests for helper and reactivity

## 0.3.0

* **BREAKING CHANGE** Changed the configurable method to persist language (it was ```persistLanguage``` function, it
is now three different methods (```getPersistedLanguage```, ```setPersistedLanguage```, ```removePersistedLanguage```). 
No change has to be done if you weren't using explicitly ```persistLanguage``` configuration option.
* **BREAKING CHANGE** ```isLanguageSet``` is now "private" (```_isLanguageSet```), use ```isLanguageSet()``` method
instead.
* **NEW FEATURE** Added a ```reset()``` method to restart from default configuration
* Improved html lang attribute automatic update
* Improved language persistence mechanism and provided method to get/set/remove explcitly the persisted language
* Fixed minor bugs and added tests for language persistence and html lang attribute update.

## v0.2.2

* **NEW FEATURE** Automatically set html lang attribute to current language (#8)
* Made "public" previously "private" properties (```_languageDep``` and ```_version```, ```language```)
* Minor improvements to automatic testing

## v0.2.1

* Bug fixed: persist language cookie being set on paths other than "/" (#6)
* Bug fixed: language autoconfiguration should not happen when language is already persisted (#7) 

## v0.2.0

* **NEW FEATURE** Added ```I18NConf.onConfigure(options)``` method to integrate with other packages configuration mechanisms.

## v0.1.0

* Initial release


