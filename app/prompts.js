var path = require('path');

module.exports = function () {
    return [
        {
            type:'input',
            name:'githubUser',
            message:'What is your github username?',
            default:null
        },
        {
            type:'input',
            name:'appName',
            message:'What is the name of the mobile App?',
            default: path.basename(process.cwd())
        },
        {
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
            choices: this.seeds.map(function (seed) { return seed.name ; }),
            message:'With which project seed do you want to start with?'
        }
    ];
};
