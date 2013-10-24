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
    var expected = [
      'package.json',
      'app/index.js',
      'README.md'
    ];

    helpers.mockPrompt(this.app, {
      'githubUser': 'peutetre',
      'appName': 'test-app',
      'appId': 'com.42loops.test',
      'appDescription': 'This is a testing app',
      'dependencies': 'q, zanimo'
    });

    this.app.run({}, function () {
      helpers.assertFiles(expected);
      done();
    });
  });
});
