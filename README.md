# generator-mobile-app [![Build Status](https://secure.travis-ci.org/peutetre/generator-mobile-app.png?branch=master)](https://travis-ci.org/peutetre/generator-mobile-app)

A [Yeoman](http://yeoman.io) generator for mobile web apps using  __[Browserify](http://browserify.org)__ and __[Cordova](http://cordova.apache.org/)__.

## Getting Started

### Install

Install Yeoman and the generator-mobile-app

```
$ npm install -g yo generator-mobile-app
```

You need to install my cordova-cli fork (waiting for the new release)

```
$ npm install -g git+https://github.com/peutetre/cordova-cli.git#3.1.0-0.3.0
```

### Usage

Launch the generator:

```
$ yo mobile-app
```

## Generator results

Produce a Cordova app and the following additional files and folders:

```
myapp
|-- .gitignore
|-- LICENSE
|-- README.md
|-- app
|   `-- index.js
|-- fonts
|-- images
|-- package.json
|-- style
|   `-- styles.styl
`-- www
    `-- index.html
```

## ChangeLog

#### v0.0.2 2013-10-30

* upgrade `cordova` to `3.1.0-0.2.0`

#### v0.0.1 2013-10-25

* minimal release

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)
