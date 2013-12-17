'use strict';

var util = require('util'),
    path = require('path'),
    fs = require('fs'),
    yeoman = require('yeoman-generator'),
    merge = require('recursive-merge'),
    GitHubApi = require('github'),
    cordova = require('cordova'),
    chalk = require('chalk'),
    Q = require('q');

var prompts = require('./prompts');

var MobileAppGenerator = module.exports = function MobileAppGenerator(args, options, config) {
    yeoman.generators.Base.apply(this, arguments);

    var packagePath = path.join(__dirname, '../package.json'),
        userSeedPath = path.join(process.env.HOME, '.seeds.json'),
        generatorSeedPath = path.join(__dirname, '../conf/seeds.json');

    this.seeds = [];
    this.pkg = JSON.parse(this.readFileAsString(packagePath));

    if(fs.existsSync(userSeedPath)) {
        this.seeds = JSON.parse(this.readFileAsString(userSeedPath));
        this.seeds = this.seeds.map(function (seed) {
            return {
                name : seed.name,
                path : path.resolve(process.env.HOME, seed.path)
            };
        });
    }

    var defaultSeeds = JSON.parse(this.readFileAsString(generatorSeedPath))
            .map(function (seed) {
                return {
                    name : seed.name,
                    path : path.resolve(__dirname, seed.path)
                };
            });

    this.seeds = this.seeds.concat(defaultSeeds);

    this.option('generator-version', {
        alias: 'gv',
        desc: 'Print the generator version',
        required: 'false',
        type: Boolean,
        defaults: false
    });

    this.option('list', {
        alias: 'l',
        desc: 'List available seeds',
        required: 'false',
        type: Boolean,
        defaults: false
    });

    if(options.l || options.list) {
        this.seeds.forEach(function (seed) {
            console.log(chalk.blue(seed.name) + ": " + seed.path);
        }, this);
        process.exit(0);
    }

    if(options.gv || options['generator-version']) {
        console.log(this.pkg.version);
        process.exit(0);
    }

    this.on('end', function () {
        this.installDependencies({
            npm: true,
            bower: false
        });
    });

};

util.inherits(MobileAppGenerator, yeoman.generators.Base);

var githubOptions = { version: '3.0.0' },
    github = new GitHubApi(githubOptions),
    githubUserInfo = function (name, cb) {
        github.user.getFrom({
            user: name
        }, function (err, res) {
            if (err) {
                throw err;
            }
            cb(JSON.parse(JSON.stringify(res)));
        });
    };

MobileAppGenerator.prototype.askUserFor = function askFor() {
    var done = this.async();

    this.prompt(prompts.call(this), function (props) {
        this.githubUser = props.githubUser;
        this.appName = props.appName;
        this.appId = props.appId;
        this.appDescription = props.appDescription;
        this.targets = props.targets;
        this.plugins = props.plugins;
        this.seed = this.seeds.filter(function (seed) {
            return seed.name === props.seed;
        })[0];
        try {
            require(this.seed.path);
        } catch(err) {
            console.log(err.toString());
            console.log(chalk.red('you may need to install it: npm install -g ' + this.seed));
            process.exit(1);
        }
        done();
    }.bind(this));
};

MobileAppGenerator.prototype.userInfo = function userInfo() {
    var done = this.async();

    githubUserInfo(this.githubUser, function (res, err) {
        if (err) {
            this.realname = null;
            this.email = null;
            this.githubUrl = null;
            done();
        }
        this.realname = res.name;
        this.email = res.email;
        this.githubUrl = res.html_url;
        done();
    }.bind(this));
};

MobileAppGenerator.prototype.initCordova = function initCordova() {
    var cb = this.async(),
        self = this,
        cfg = { lib : { www : {
            id : "empty",
            version : "0.0.0",
            uri : path.join(__dirname, '../conf/empty-www')
        } } };

    cordova.create('.', this.appId, this.appName, cfg, function () {
        this.log.write().ok('Raw app created');
        cb();
    }.bind(this));
};

MobileAppGenerator.prototype.target = function target() {
    var cb = this.async();

    cordova.platform('add', this.targets, function () {
        this.log.ok('Targets added: ' + this.targets.join(', ')).write();
        cb();
    }.bind(this));
};

MobileAppGenerator.prototype.cordovaplugins = function cordovaplugins() {
    var cb = this.async();

    cordova.plugins('add', this.plugins, function () {
        this.plugins.forEach(function (plugin) {
            this.log.ok('Added plugin: ' + plugin).write();
        }.bind(this));
        cb();
    }.bind(this));
};

MobileAppGenerator.prototype.execSeedGenerator = function oops() {
    var cb = this.async();
    yeoman(this.seed.name, {
        userSettings : {
            appName : this.appName,
            githubUser : this.githubUser,
            appId : this.appId,
            appDescription : this.appDescription,
            targets : this.targets,
            plugins : this.plugins
        }
    }).register(this.seed.path, this.seed.name).run(function (err) {
        if (err) this.log.error(err).write();
        cb();
    }.bind(this));
};

MobileAppGenerator.prototype.app = function app() {
    this.template('_README.md', 'README.md');
    this.copy('gitignore', '.gitignore');
};

MobileAppGenerator.prototype.cpPackage = function cpPackage() {
    var done = this.async();
    fs.exists(path.join(process.cwd(), 'package.json'), function (exists) {
        if (exists) this.template('_package.json', '_package.json');
        else this.template('_package.json', 'package.json');
        done();
    }.bind(this));
};

MobileAppGenerator.prototype.mergePackageDotJson = function mergePackageDotJson() {
    var done = this.async();
    fs.exists(path.join(process.cwd(), '_package.json'), function (exist) {
        if (exist) {
            var f1 = JSON.parse(this.readFileAsString(path.join(process.cwd(), 'package.json')));
            var f2 = JSON.parse(this.readFileAsString(path.join(process.cwd(), '_package.json')));
            var m = merge(f1, f2);
            fs.writeFile(path.join(process.cwd(), 'package.json'), JSON.stringify(m, null, 4), function () {
                fs.unlink(path.join(process.cwd(), '_package.json'));
                done();
            });
        }
        else {
            done();
        }
    }.bind(this));
};
