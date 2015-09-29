#!/usr/bin/env node

/**
 * 3w v0.0.4
 * Copyright (c) 2014 Mehran Hatami
 * Available via the MIT license.
 * license found at https://github.com/mehranhatami/3w/raw/master/LICENSE
 */
'use strict';

var defaultOptions = {
  enableHTTPS: false,
  port: 9000,
  dir: 'app'
};

function www(options) {
  var express = require('express'),
    path = require('path'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    error = require('./error'),
    app = express();

  if (typeof options.proxy === 'function') {
    options.proxy(app);
  }

  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded());
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, '../../' + options.dir)));

  error(app);

  app.set('port', options.port);

  var server = app.listen(options.port, function () {
    console.log('Express server listening on port ' + server.address().port);
  });

  if (options.enableHTTPS) {
    var enableHTTPS = function (app) {

      var https = require('https'),
        fs = require('fs'),
        agent2CertPem,
        agent2KeyPem;

      agent2KeyPem = fs.readFileSync(__dirname + '/keys/agent2-key.pem');
      agent2CertPem = fs.readFileSync(__dirname + '/keys/agent2-cert.pem');

      // Create an HTTPS service identical to the HTTP service.
      https.createServer({
          key: agent2KeyPem,
          cert: agent2CertPem
        }, app)
        .listen(443);
    };

    enableHTTPS(app);
  }

  return app;
}

if (require.main === module) {
  /*
   * Each arg has a default value and the order doesn't matter
   * node node_modules/3w/3w.js 'src' --8080 --https
   * node node_modules/3w/3w.js --3000 'src'
   * node node_modules/3w/3w.js --https
   */
  process.argv.slice(2)
    .forEach(function (val, index) {
      if (val === '--https') defaultOptions.enableHTTPS = true;
      else if (val.slice(0, 2) === '--') {
        val = val.slice(2);
        if (!isNaN(val)) defaultOptions.port = +val;
      } else defaultOptions.dir = val;
    });
  www(defaultOptions);
} else {
  module.exports = function (options) {
    if (options.enableHTTPS === undefined) {
      options.enableHTTPS = defaultOptions.enableHTTPS;
    }
    if (options.port === undefined) {
      options.port = defaultOptions.port;
    }
    if (options.dir === undefined) {
      options.dir = defaultOptions.dir;
    }

    return www(options);
  };
}