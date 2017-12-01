import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
export const Games = new Mongo.Collection('games');

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('games.all', function MatchesPublication() {
    return Games.find();
  });
}

Meteor.methods({
  'games.insert'(name, slug, logo, image) {
    // Make sure the user is logged in before inserting a task
    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    Games.insert({
      name,
      slug,
      logo,
      image
    });
  },
  'games.remove'(id) {
    Games.remove(id);
  }
  //   "teams.setChecked"(taskId, setChecked) {
  //     check(taskId, String);
  //     check(setChecked, Boolean);

  //     Teams.update(taskId, { $set: { checked: setChecked } });
  //   }
});
