'use strict';

var should = require('should'),
    request = require('supertest'),
    path = require('path'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Blue = mongoose.model('Blue'),
    express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app;
var agent;
var credentials;
var user;
var blue;

/**
 * Blue routes tests
 */
describe('Blue CRUD tests', function () {

    before(function (done) {
        // Get application
        app = express.init(mongoose);
        agent = request.agent(app);

        done();
    });

    beforeEach(function (done) {
        // Create user credentials
        credentials = {
            username: 'username',
            password: 'M3@n.jsI$Aw3$0m3'
        };

        // Create a new user
        user = new User({
            firstName: 'Full',
            lastName: 'Name',
            displayName: 'Full Name',
            email: 'test@test.com',
            username: credentials.username,
            password: credentials.password,
            provider: 'local'
        });

        // Save a user to the test db and create new Blue
        user.save(function () {
            blue = {
                name: 'Blue name'
            };

            done();
        });
    });

    it('should be able to save a Blue if logged in', function (done) {
        agent.post('/api/auth/signin')
            .send(credentials)
            .expect(200)
            .end(function (signinErr, signinRes) {
                // Handle signin error
                if (signinErr) {
                    return done(signinErr);
                }

                // Get the userId
                var userId = user.id;

                // Save a new Blue
                agent.post('/api/blues')
                    .send(blue)
                    .expect(200)
                    .end(function (blueSaveErr, blueSaveRes) {
                        // Handle Blue save error
                        if (blueSaveErr) {
                            return done(blueSaveErr);
                        }

                        // Get a list of Blues
                        agent.get('/api/blues')
                            .end(function (bluesGetErr, bluesGetRes) {
                                // Handle Blue save error
                                if (bluesGetErr) {
                                    return done(bluesGetErr);
                                }

                                // Get Blues list
                                var blues = bluesGetRes.body;

                                // Set assertions
                                (blues[0].user._id).should.equal(userId);
                                (blues[0].name).should.match('Blue name');

                                // Call the assertion callback
                                done();
                            });
                    });
            });
    });

    it('should not be able to save an Blue if not logged in', function (done) {
        agent.post('/api/blues')
            .send(blue)
            .expect(403)
            .end(function (blueSaveErr, blueSaveRes) {
                // Call the assertion callback
                done(blueSaveErr);
            });
    });

    it('should not be able to save an Blue if no name is provided', function (done) {
        // Invalidate name field
        blue.name = '';

        agent.post('/api/auth/signin')
            .send(credentials)
            .expect(200)
            .end(function (signinErr, signinRes) {
                // Handle signin error
                if (signinErr) {
                    return done(signinErr);
                }

                // Get the userId
                var userId = user.id;

                // Save a new Blue
                agent.post('/api/blues')
                    .send(blue)
                    .expect(400)
                    .end(function (blueSaveErr, blueSaveRes) {
                        // Set message assertion
                        (blueSaveRes.body.message).should.match('Please fill Blue name');

                        // Handle Blue save error
                        done(blueSaveErr);
                    });
            });
    });

    it('should be able to update an Blue if signed in', function (done) {
        agent.post('/api/auth/signin')
            .send(credentials)
            .expect(200)
            .end(function (signinErr, signinRes) {
                // Handle signin error
                if (signinErr) {
                    return done(signinErr);
                }

                // Get the userId
                var userId = user.id;

                // Save a new Blue
                agent.post('/api/blues')
                    .send(blue)
                    .expect(200)
                    .end(function (blueSaveErr, blueSaveRes) {
                        // Handle Blue save error
                        if (blueSaveErr) {
                            return done(blueSaveErr);
                        }

                        // Update Blue name
                        blue.name = 'WHY YOU GOTTA BE SO MEAN?';

                        // Update an existing Blue
                        agent.put('/api/blues/' + blueSaveRes.body._id)
                            .send(blue)
                            .expect(200)
                            .end(function (blueUpdateErr, blueUpdateRes) {
                                // Handle Blue update error
                                if (blueUpdateErr) {
                                    return done(blueUpdateErr);
                                }

                                // Set assertions
                                (blueUpdateRes.body._id).should.equal(blueSaveRes.body._id);
                                (blueUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                                // Call the assertion callback
                                done();
                            });
                    });
            });
    });

    it('should be able to get a list of Blues if not signed in', function (done) {
        // Create new Blue model instance
        var blueObj = new Blue(blue);

        // Save the blue
        blueObj.save(function () {
            // Request Blues
            request(app).get('/api/blues')
                .end(function (req, res) {
                    // Set assertion
                    res.body.should.be.instanceof(Array).and.have.lengthOf(1);

                    // Call the assertion callback
                    done();
                });

        });
    });

    it('should be able to get a single Blue if not signed in', function (done) {
        // Create new Blue model instance
        var blueObj = new Blue(blue);

        // Save the Blue
        blueObj.save(function () {
            request(app).get('/api/blues/' + blueObj._id)
                .end(function (req, res) {
                    // Set assertion
                    res.body.should.be.instanceof(Object).and.have.property('name', blue.name);

                    // Call the assertion callback
                    done();
                });
        });
    });

    it('should return proper error for single Blue with an invalid Id, if not signed in', function (done) {
        // test is not a valid mongoose Id
        request(app).get('/api/blues/test')
            .end(function (req, res) {
                // Set assertion
                res.body.should.be.instanceof(Object).and.have.property('message', 'Blue is invalid');

                // Call the assertion callback
                done();
            });
    });

    it('should return proper error for single Blue which doesnt exist, if not signed in', function (done) {
        // This is a valid mongoose Id but a non-existent Blue
        request(app).get('/api/blues/559e9cd815f80b4c256a8f41')
            .end(function (req, res) {
                // Set assertion
                res.body.should.be.instanceof(Object).and.have.property('message', 'No Blue with that identifier has been found');

                // Call the assertion callback
                done();
            });
    });

    it('should be able to delete an Blue if signed in', function (done) {
        agent.post('/api/auth/signin')
            .send(credentials)
            .expect(200)
            .end(function (signinErr, signinRes) {
                // Handle signin error
                if (signinErr) {
                    return done(signinErr);
                }

                // Get the userId
                var userId = user.id;

                // Save a new Blue
                agent.post('/api/blues')
                    .send(blue)
                    .expect(200)
                    .end(function (blueSaveErr, blueSaveRes) {
                        // Handle Blue save error
                        if (blueSaveErr) {
                            return done(blueSaveErr);
                        }

                        // Delete an existing Blue
                        agent.delete('/api/blues/' + blueSaveRes.body._id)
                            .send(blue)
                            .expect(200)
                            .end(function (blueDeleteErr, blueDeleteRes) {
                                // Handle blue error error
                                if (blueDeleteErr) {
                                    return done(blueDeleteErr);
                                }

                                // Set assertions
                                (blueDeleteRes.body._id).should.equal(blueSaveRes.body._id);

                                // Call the assertion callback
                                done();
                            });
                    });
            });
    });

    it('should not be able to delete an Blue if not signed in', function (done) {
        // Set Blue user
        blue.user = user;

        // Create new Blue model instance
        var blueObj = new Blue(blue);

        // Save the Blue
        blueObj.save(function () {
            // Try deleting Blue
            request(app).delete('/api/blues/' + blueObj._id)
                .expect(403)
                .end(function (blueDeleteErr, blueDeleteRes) {
                    // Set message assertion
                    (blueDeleteRes.body.message).should.match('User is not authorized');

                    // Handle Blue error error
                    done(blueDeleteErr);
                });

        });
    });

    it('should be able to get a single Blue that has an orphaned user reference', function (done) {
        // Create orphan user creds
        var _creds = {
            username: 'orphan',
            password: 'M3@n.jsI$Aw3$0m3'
        };

        // Create orphan user
        var _orphan = new User({
            firstName: 'Full',
            lastName: 'Name',
            displayName: 'Full Name',
            email: 'orphan@test.com',
            username: _creds.username,
            password: _creds.password,
            provider: 'local'
        });

        _orphan.save(function (err, orphan) {
            // Handle save error
            if (err) {
                return done(err);
            }

            agent.post('/api/auth/signin')
                .send(_creds)
                .expect(200)
                .end(function (signinErr, signinRes) {
                    // Handle signin error
                    if (signinErr) {
                        return done(signinErr);
                    }

                    // Get the userId
                    var orphanId = orphan._id;

                    // Save a new Blue
                    agent.post('/api/blues')
                        .send(blue)
                        .expect(200)
                        .end(function (blueSaveErr, blueSaveRes) {
                            // Handle Blue save error
                            if (blueSaveErr) {
                                return done(blueSaveErr);
                            }

                            // Set assertions on new Blue
                            (blueSaveRes.body.name).should.equal(blue.name);
                            should.exist(blueSaveRes.body.user);
                            should.equal(blueSaveRes.body.user._id, orphanId);

                            // force the Blue to have an orphaned user reference
                            orphan.remove(function () {
                                // now signin with valid user
                                agent.post('/api/auth/signin')
                                    .send(credentials)
                                    .expect(200)
                                    .end(function (err, res) {
                                        // Handle signin error
                                        if (err) {
                                            return done(err);
                                        }

                                        // Get the Blue
                                        agent.get('/api/blues/' + blueSaveRes.body._id)
                                            .expect(200)
                                            .end(function (blueInfoErr, blueInfoRes) {
                                                // Handle Blue error
                                                if (blueInfoErr) {
                                                    return done(blueInfoErr);
                                                }

                                                // Set assertions
                                                (blueInfoRes.body._id).should.equal(blueSaveRes.body._id);
                                                (blueInfoRes.body.name).should.equal(blue.name);
                                                should.equal(blueInfoRes.body.user, undefined);

                                                // Call the assertion callback
                                                done();
                                            });
                                    });
                            });
                        });
                });
        });
    });

    afterEach(function (done) {
        User.remove().exec(function () {
            Blue.remove().exec(done);
        });
    });
});
