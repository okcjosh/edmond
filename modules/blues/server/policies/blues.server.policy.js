'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Blues Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/blues',
      permissions: '*'
    }, {
      resources: '/api/blues/:blueId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/blues',
      permissions: ['get', 'post']
    }, {
      resources: '/api/blues/:blueId',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/blues',
      permissions: ['get']
    }, {
      resources: '/api/blues/:blueId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Blues Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

    // If an Blue is being processed and the current user created it then allow any manipulation
  if (req.blue && req.user && req.blue.user && req.blue.user.id === req.user.id) {
    return next();
  }

    // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
            // An authorization error occurred
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
                // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};
