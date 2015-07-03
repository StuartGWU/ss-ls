/**
 * Socket.io configuration
 */

'use strict';

var config = require('./environment');
var redis = require('redis');

// Setup Redis pub/sub.
// NOTE: You must create two Redis clients, as 
// the one that subscribes can't also publish.
var serverPub = redis.createClient();
var serverSub = redis.createClient();
serverSub.subscribe('data:changed');

var clients = [];

// Listen for messages being published to this server.
serverSub.on('message', function(channel, msg) {
    // Broadcast the message to all connected clients on this server.
    console.info('***Redis subscriber received message on channel: ' + channel + '. Message details: ' + msg);
    console.info('**Now that we received a message on the server event bus, need to nofify local clients. Total clients: ' + clients.length);
    for (var i = 0; i < clients.length; i++) {
        var socket = clients[i];
        console.info('Sending notification to connect client (id=' + socket.id + ', address=' + socket.address + '). Message details: ' + msg);
        var eventMsg = JSON.parse(msg);
        var dataStr = JSON.stringify(eventMsg.data, null, 2);
        socket.emit(eventMsg.ev, dataStr);
    }
});

// When the user disconnects.. perform this
function onDisconnect(socket) {
    console.info('Client DISCONNECTED (id=' + socket.id + ', address=' + socket.address + ').');

    var index = clients.indexOf(socket);
    if (index !== -1) {
        clients.splice(index, 1);
        console.info('Client disconnected (id=' + socket.id + ').');
    }
}

function onConnect(socket) {
    console.info('Client CONNECTED (id=' + socket.id + ', address=' + socket.address + ').');

    // maintain list of connected clients
    clients.push(socket);

    socket.on('info', function(data) {
        console.info('Client [%s] on INFO event. Data: %s', socket.address, JSON.stringify(data, null, 2));
    });

    require('../api/tip/tip.socket').register(socket, serverPub);
}

module.exports = function(socketio) {
    // socket.io (v1.x.x) is powered by debug.
    // In order to see all the debug output, set DEBUG (in server/config/local.env.js) to including the desired scope.
    //
    // ex: DEBUG: "http*,socket.io:socket"

    // We can authenticate socket.io users and access their token through socket.handshake.decoded_token
    //
    // 1. You will need to send the token in `client/components/socket/socket.service.js`
    //
    // 2. Require authentication here:
    // socketio.use(require('socketio-jwt').authorize({
    //   secret: config.secrets.session,
    //   handshake: true
    // }));

    socketio.on('connection', function(socket) {
        socket.address = socket.handshake.address !== null ?
            socket.handshake.address.address + ':' + socket.handshake.address.port :
            process.env.DOMAIN;
        socket.connectedAt = new Date();
        socket.on('disconnect', function() {
            onDisconnect(socket);
        });
        onConnect(socket);
    });
};