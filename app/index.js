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
  this.seeds = JSON.parse(this.readFileAsString(path.join(__dirname, '../conf/seeds.json')));
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
    message:'What is the ID of the mobile App\n (reverse-domain-style package name, like com.foo.myapp)?',
    validate: function (input) {
        return input.match(/(^[a-z]{1}[a-z0-9]+\.[a-z]{1}[a-z0-9]+\.[a-z]{1}[a-z0-9]+$)/g) ? true : "Need an Id like com.foo.myapp!";
    }
  },
  {
    type:'input',
    name:'appDescription',
    message:'Can you give a description of your mobile App?',
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
  },
  {
    type:'checkbox',
    name:'plugins',
    choices: JSON.parse(this.readFileAsString(path.join(__dirname, '../conf/plugins.json'))),
    message:'With which Cordova official plugins to you want to start?'
  },
  {
    type:'list',
    name:'seed',
    choices: this.seeds.map(function (seed) { return seed.id ; }),
    message:'With which project seed do you want to start with?'
  }];

  this.prompt(prompts, function (props) {
    this.githubUser = props.githubUser;
    this.appName = props.appName;
    this.appId = props.appId;
    this.appDescription = props.appDescription;
    this.targets = props.targets;
    this.plugins = props.plugins;
    this.seed = props.seed;
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
  var cb = this.async(),
      self = this,
      cfg = { lib : { www : this.seeds.filter(function (seed) {
        return seed.id === self.seed;
      })[0] } };

  cordova.create('.', this.appId, this.appName, cfg, function () {
    this.log.write().ok('Raw app created');
    cb();
  }.bind(this));
};

ModuleGenerator.prototype.target = function app() {
  var cb = this.async();

  cordova.platform('add', this.targets, function () {
    this.log.ok('Targets added: ' + this.targets.join(', ')).write();
    cb();
  }.bind(this));
};

ModuleGenerator.prototype.cordovaplugins = function app() {
  var cb = this.async();

  cordova.plugins('add', this.plugins, function () {
    this.log.ok('Plugins added: ' + this.plugins.join(', ')).write();
    cb();
  }.bind(this));
};

ModuleGenerator.prototype.app = function app() {
  this.template('_package.json', 'package.json');
  this.template('_README.md', 'README.md');
  this.copy('gitignore', '.gitignore');
};
