/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var tip = require('./tip.model');
var redis = require('redis');

exports.register = function(socket, serverPub) {
    tip.schema.post('init', function(doc) {
        console.log('%s has been initialized from the db', doc._id);
    });
    tip.schema.post('validate', function(doc) {
        console.log('%s has been validated (but not saved yet)', doc._id);
    });
    tip.schema.post('save', function(doc) {
        onSave(socket, doc, serverPub);
    });
    tip.schema.post('remove', function(doc) {
        onRemove(socket, doc, serverPub);
    });
}

function onSave(socket, doc, serverPub, cb) {
    console.log("Event: tip:saved. Socket info: " + socket + " doc: " + doc)

    // push change to other clients (browser) connected to this SAME server
    socket.emit('tip:save', doc);

    // publish message to event bus (Redis) to notify OTHER servers in the fleet	
    serverPub.publish('data:changed', JSON.stringify({
        ev: 'tip:save',
        data: doc
    }, null, 2));
}

function onRemove(socket, doc, serverPub, cb) {
    // push change to other clients (browser) connected to this SAME 
    socket.emit('tip:remove', doc);

    // publish message to event bus (Redis) to notify OTHER servers in the fleet
    serverPub.publish('data:changed', JSON.stringify({
        ev: 'tip:remove',
        data: doc
    }, null, 2));
}