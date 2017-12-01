import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

if (Meteor.isServer) {
  Meteor.publish('users.name', function() {
    return Meteor.users.find({}, { fields: { _id: 1, username: 1 } });
  });
}
