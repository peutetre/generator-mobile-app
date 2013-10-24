'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var GitHubApi = require('github');
var cordova = require('cordova');
var Q = require('q');

var githubOptions = {
  version: '3.0.0'
};
var github = new GitHubApi(githubOptions);

var githubUserInfo = function (name, cb) {
  github.user.getFrom({
    user: name
  }, function (err, res) {
    if (err) {
      throw err;
    }
    cb(JSON.parse(JSON.stringify(res)));
  });
};

var ModuleGenerator = module.exports = function ModuleGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  this.on('end', function () {
    this.installDependencies({
        npm: true,
        bower: false
    });
  });

  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(ModuleGenerator, yeoman.generators.Base);

ModuleGenerator.prototype.askFor = function askFor() {
  var cb = this.async();

  var prompts = [{
    type:'input',
    name:'githubUser',
    message:'What is your github username?',
    default:null
  },{
    type:'input',
    name:'appName',
    message:'What is the name of the mobile App?',
    default: path.basename(process.cwd())
  },{
    type:'input',
    name:'appId',
    message:'What is the ID of the mobile App (reverse-domain-style package name, like com.foo.myapp)?',
    validate: function (input) {
        return input.match(/(^[a-z0-9]+\.[a-z0-9]+\.[a-z0-9]+$)/g) ? true : "Need an Id like com.foo.myapp!";
    }
  },
  {
    type:'input',
    name:'appDescription',
    message:'Can you give a description of your mobile App?',
    default: ""
  },
  {
    type:'input',
    name:'dependencies',
    message:'Do you want to add dependencies? (sepatate modules with comma)',
    default: ""
  },
  {
    type:'checkbox',
    name:'targets',
    choices:[{
        name:'ios',
        value:'ios'
    },{
        name:'Android',
        value:'android'
    }],
    message:'Which targets do you want to support ?',
    validate: function (input) {
        return input instanceof Array && input.length > 0 ? true : "One minimum target is required";
    }
  }];

  this.prompt(prompts, function (props) {
    this.githubUser = props.githubUser;
    this.appName = props.appName;
    this.appId = props.appId;
    this.appDescription = props.appDescription;
    this.dependencies = props.dependencies.split(',')
        .filter(function (dep) {
            return dep.length > 0;
        });
    this.targets = props.targets;
    cb();
  }.bind(this));
};

ModuleGenerator.prototype.userInfo = function userInfo() {
  var done = this.async();

  githubUserInfo(this.githubUser, function (res) {
    this.realname = res.name;
    this.email = res.email;
    this.githubUrl = res.html_url;
    done();
  }.bind(this));
};

ModuleGenerator.prototype.cordova = function app() {
  var cb = this.async();

  cordova.create('.', this.appId, this.appName, function () {
    this.log.write().ok('Raw app created');
    cb();
  }.bind(this));
};

ModuleGenerator.prototype.target = function app() {
  var cb = this.async();

  cordova.platform('add', this.targets, function () {
    this.log.ok('Targets added: ' + this.targets.concat()).write();
    cb();
  }.bind(this));
};

ModuleGenerator.prototype.app = function app() {
  this.mkdir('app');
  this.template('app/_index.js', 'app/index.js');
  this.template('_package.json', 'package.json');
  this.template('_README.md', 'README.md');
  this.template('_LICENSE', 'LICENSE');
  this.copy('gitignore', '.gitignore');
};
