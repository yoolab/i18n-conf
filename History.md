## 0.3.0

* **BREAKING CHANGE** Changed the configurable method to persist language (it was ```persistLanguage``` function, it
is now three different methods (```getPersistedLanguage```, ```setPersistedLanguage```, ```removePersistedLanguage```). 
No change has to be done if you weren't using explicitly ```persistLanguage``` configuration option.
* **BREAKING CHANGE** ```isLanguageSet``` is now "private" (```_isLanguageSet```), use ```isLanguageSet()``` method
instead.
* Improved html lang attribute automatic update
* Improved language persistence mechanism and provided method to get/set/remove explcitly the persisted language
* Added a ```reset()``` method to restart from default configuration
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


