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
      'app/index.js',
      'README.md',
      '.gitignore',
      'style/styles.styl',
      'www/index.html',
      'www/config.xml',
      'platforms'
    ];

    helpers.mockPrompt(this.app, {
      'githubUser': 'peutetre',
      'appName': 'test-app',
      'appId': 'com.loops.test',
      'appDescription': 'This is a testing app',
      'dependencies': 'q, zanimo',
      'targets': ['ios', 'android'],
      'plugins': []
    });

    this.app.run({}, function () {
      helpers.assertFiles(expected);
      done();
    });
  });
});
