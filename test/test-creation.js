/*global describe, beforeEach, it*/
'use strict';

var path    = require('path');
var helpers = require('yeoman-generator').test;


describe('mobile-app generator', function () {
  beforeEach(function (done) {
    helpers.testDirectory(path.join(__dirname, 'temp'), function (err) {
      if (err) {
        return done(err);
      }

      this.app = helpers.createGenerator('mobile-app:app', [
        '../../app'
      ]);
      done();
    }.bind(this));
  });

  it('creates expected files', function (done) {
    this.timeout(60000);
    var expected = [
      'package.json',
      'README.md',
      '.gitignore',
      'www/config.xml',
      'platforms',
      'plugins',
      'merges'
    ];

    helpers.mockPrompt(this.app, {
      'appName': 'test-app',
      'appId': 'com.loops.test',
      'appDescription': 'This is a testing app',
      'targets': ['ios', 'android'],
      'plugins': ['org.apache.cordova.battery-status', 'org.apache.cordova.splashscreen'],
      'repoOnGithub': false,
      'seed': 'generator-default-seed'
    });

    this.app.run({}, function () {
      helpers.assertFiles(expected);
      done();
    });
  });
});
