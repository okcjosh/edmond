'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Blue = mongoose.model('Blue'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Blue
 */
exports.create = function (req, res) {
  var blue = new Blue(req.body);
  blue.user = req.user;

  blue.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(blue);
    }
  });
};

/**
 * Show the current Blue
 */
exports.read = function (req, res) {
    // convert mongoose document to JSON
  var blue = req.blue ? req.blue.toJSON() : {};

    // Add a custom field to the Article, for determining if the current User is the "owner".
    // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  blue.isCurrentUserOwner = req.user && blue.user && blue.user._id.toString() === req.user._id.toString();

  res.jsonp(blue);
};

/**
 * Update a Blue
 */
exports.update = function (req, res) {
  var blue = req.blue;

  blue = _.extend(blue, req.body);

  blue.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(blue);
    }
  });
};

/**
 * Delete an Blue
 */
exports.delete = function (req, res) {
  var blue = req.blue;

  blue.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(blue);
    }
  });
};

/**
 * List of Blues
 */
exports.list = function (req, res) {
  Blue.find().sort('-created').populate('user', 'displayName').exec(function (err, blues) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(blues);
    }
  });
};

/**
 * Blue middleware
 */
exports.blueByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Blue is invalid'
    });
  }

  Blue.findById(id).populate('user', 'displayName').exec(function (err, blue) {
    if (err) {
      return next(err);
    } else if (!blue) {
      return res.status(404).send({
        message: 'No Blue with that identifier has been found'
      });
    }
    req.blue = blue;
    next();
  });
};
