/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var Tip = require('../api/tip/tip.model');
var User = require('../api/user/user.model');

Tip.find({}).remove(function() {
  Tip.create({
    message : 'Tip1',
    originalMessage : 'Tip1',
    submittedBy : 'stuart'    
  }, {
    message : 'Tip2',
    originalMessage : 'Tip2',
    submittedBy : 'stuart'
  }, {
    message : 'Tip3',
    originalMessage : 'Tip3',
    submittedBy : 'stuart'
  }, {
    message : 'Tip4',
    originalMessage : 'Tip4',
    submittedBy : 'stuart'
  }, {
    message : 'Tip5',
    originalMessage : 'Tip5',
    submittedBy : 'stuart'
  }, {
    message : 'Tip6',
    originalMessage : 'Tip6',
    submittedBy : 'stuart'
  }, {
    message : 'Tip7',
    originalMessage : 'Tip7',
    submittedBy : 'stuart'
  }, {
    message : 'Tip8',
    originalMessage : 'Tip8',
    submittedBy : 'stuart'
  }, {
    message : 'Tip9',
    originalMessage : 'Tip9',
    submittedBy : 'stuart'
  }, {
    message : 'Tip10',
    originalMessage : 'Tip10',
    submittedBy : 'stuart'
  });
});

User.find({}).remove(function() {
  User.create({
    provider: 'local',
    name: 'Test User',
    email: 'test@test.com',
    password: 'test'
  }, {
    provider: 'local',
    name: 'Test User - 2',
    email: 'test2@test.com',
    password: 'test'
  }, {
    provider: 'local',
    role: 'admin',
    name: 'Admin',
    email: 'admin@admin.com',
    password: 'admin'
  }, function() {
      console.log('finished populating users');
    }
  );
});