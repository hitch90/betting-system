import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

export const Teams = new Mongo.Collection('teams');

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('teams', function TeamsPublication() {
    return Teams.find();
  });
}

Meteor.methods({
  'teams.insert'(name, logo) {
    check(name, String);

    // Make sure the user is logged in before inserting a task
    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    Teams.insert({
      name,
      logo,
      createdAt: new Date()
    });
  },
  'teams.getname'(id) {
    return Teams.findOne({
      _id: id
    });
  },
  'teams.remove'(id) {
    check(id, String);
    Teams.remove(id);
  },
  'teams.update'(id, name, logo) {
    check(id, String);
    Teams.update({ _id: id }, { name, logo });
  }
});
