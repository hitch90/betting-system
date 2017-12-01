import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
export const Events = new Mongo.Collection('events');

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('events.all', function MatchesPublication() {
    return Events.find();
  });
}

Meteor.methods({
  'events.insert'(name, slug, logo, image) {
    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }
    Events.insert({
      name,
      slug,
      logo,
      image
    });
  },
  'events.remove'(id) {
    Events.remove(id);
  }
});
