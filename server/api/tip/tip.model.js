'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TipSchema = new Schema({
    message: String,
    originalMessage: String,
    /* TOOD: move to a linked-list, and versoning of message */
    submittedBy: String,
    updatedBy: String,
    createdOn: {
        type: Date,
        default: Date.now
    },
    updatedOn: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Tip', TipSchema);