# generator-mobile-app [![experimental](http://hughsk.github.io/stability-badges/dist/experimental.svg)](http://github.com/hughsk/stability-badges)

A __[Yeoman](http://yeoman.io)__ generator for mobile web apps using __[Cordova](http://cordova.apache.org/)__ supporting iOS and Android. (macosx only...)

## Requirements

* [Android SDK](http://developer.android.com/)
* [iOS SDK](http://developer.apple.com/)

## Getting Started

### Install

```
$ npm install -g yo generator-mobile-app
```

### Usage

![cli-usage](http://42loops.com/yo-mobile-app.gif)

Launch the generator (interactive mode):

```
$ yo mobile-app
```

Get the version of the mobile-app generator

```
$ yo mobile-app -gv
```

Get the available project seeds

```
$ yo mobile-app -l
```

and more details with

```
$ yo mobile-app -ll
```

Get some help

```
$ yo mobile-app -h
```

## Seeds

* __[default-seed](http://github.com/peutetre/default-seed)__ (included!)
* __[browserify-seed](http://github.com/peutetre/generator-browserify-seed)__

## Add more seeds

__generator-mobile-app__ reads a .seeds.json file if available in your $HOME.

.seeds.json example:
```
[
    {
        "name" : "generator-browserify-seed",
        "path" : "./somewhere/generators/browserify-seed"
    }
]
```

## ChangeLog

### v0.1.1 2013-12-31

* add long list option
* update generator default seed to 0.0.2

### v0.1.0 2013-12-30

* working version (ios, android)

#### v0.0.2 2013-10-30 (experimental)

* upgrade `cordova` to `3.1.0-0.2.0`

#### v0.0.1 2013-10-25 (experimental)

* minimal release

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)
