'use strict';

var auth = require('../../auth/auth.service');
var _ = require('lodash');
var Tip = require('./tip.model');

// Get list of tips
exports.index = function(req, res) {
    // TODO: move business logic to an abstraction layer
    Tip.find(function(err, tips) {
        if (err) {
            return handleError(res, err);
        }
        return res.json(200, tips);
    });
};

// Get a single tip
exports.getById = function(req, res) {
    // TODO: move business logic to an abstraction layer
    Tip.findById(req.params.id, function(err, tip) {
        if (err) {
            return handleError(res, err);
        }
        if (!tip) {
            return res.send(404);
        }
        return res.json(tip);
    });
};

// Creates a new tip in the DB.
exports.create = function(req, res) {
    // TODO: move business logic to an abstraction layer
    req.body.originalMessage = req.body.message;
    if (req.body.anonymous) {
        req.body.submittedBy = "anonymous";
    } else {
        req.body.updatedBy = req.user._doc.name;
    }
    Tip.create(req.body, function(err, tip) {
        if (err) {
            return handleError(res, err);
        }
        return res.json(201, tip);
    });
};

// Updates an existing tip in the DB.
exports.update = function(req, res) {
    // TODO: move business logic to an abstraction layer
    if (req.body._id) {
        delete req.body._id;
    }
    if (req.body.originalMessage) {
        delete req.body.originalMessage;
    }
    if (req.body.updatedOn) {
        delete req.body.updatedOn;
    }
    Tip.findById(req.params.id, function(err, tip) {
        if (err) {
            return handleError(res, err);
        }
        if (!tip) {
            return res.send(404);
        }
        var updated = _.merge(tip, req.body);
        updated.updatedBy = req.user._doc.name;
        updated.updatedOn = new Date();
        updated.save(function(err) {
            if (err) {
                return handleError(res, err);
            }
            return res.json(200, tip);
        });
    });
};

// Deletes a thing from the DB.
exports.destroy = function(req, res) {
    Tip.findById(req.params.id, function(err, tip) {
        if (err) {
            return handleError(res, err);
        }
        if (!tip) {
            return res.send(404);
        }
        tip.remove(function(err) {
            if (err) {
                return handleError(res, err);
            }
            return res.send(204);
        });
    });
};

function handleError(res, err) {
    return res.send(500, err);
}