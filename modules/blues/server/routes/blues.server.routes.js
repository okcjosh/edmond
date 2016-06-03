'use strict';

/**
 * Module dependencies
 */
var bluesPolicy = require('../policies/blues.server.policy'),
  blues = require('../controllers/blues.server.controller');

module.exports = function (app) {
    // Blues Routes
  app.route('/api/blues').all(bluesPolicy.isAllowed)
        .get(blues.list)
        .post(blues.create);

  app.route('/api/blues/:blueId').all(bluesPolicy.isAllowed)
        .get(blues.read)
        .put(blues.update)
        .delete(blues.delete);

    // Finish by binding the Blue middleware
  app.param('blueId', blues.blueByID);
};
