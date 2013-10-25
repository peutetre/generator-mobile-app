/**
 * index.js - <%= appName %> index
 */

var Q = require('q'),
    Qstart = require('qstart'),
    app = { };

app.init = function () {
    console.log('App <%= appName %> init...');
};

Qstart.then(app.init);
