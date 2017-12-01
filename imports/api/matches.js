import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Teams } from './teams';
export const Matches = new Mongo.Collection('matches');

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('matches.all', function MatchesPublication() {
    return Matches.find();
  });
  Meteor.publish('matches.one', function showMatch(id) {
    console.log(id);
    return Matches.find({ _id: id });
  });
}

Meteor.methods({
  'matches.insert'(
    firstOpponent,
    secondOpponent,
    game,
    event,
    startAt,
    winner = '',
    complete = false,
    canceled = false
  ) {
    // Make sure the user is logged in before inserting a task
    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    Matches.insert({
      firstOpponent,
      secondOpponent,
      game,
      event,
      startAt,
      createdAt: new Date(),
      winner,
      complete,
      canceled
    });
  },
  'matches.remove'(id) {
    Matches.remove(id);
  },
  'matches.setWinner'(id, winner) {
    Matches.update({ _id: id }, { $set: { winner: winner, complete: true } });
  }
  //   "teams.setChecked"(taskId, setChecked) {
  //     check(taskId, String);
  //     check(setChecked, Boolean);

  //     Teams.update(taskId, { $set: { checked: setChecked } });
  //   }
});
