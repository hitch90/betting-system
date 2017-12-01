import { Mongo } from "meteor/mongo";
import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import { Matches } from "./matches.js";
export const Bets = new Mongo.Collection("bets");

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish("bets.all", function MatchesPublication() {
    return Bets.find();
  });
}

Meteor.methods({
  "bets.insert"(userId, userchoice, stake, matchId) {
    // Make sure the user is logged in before inserting a task
    if (!Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }
    check(stake, String);
    check(userchoice, String);
    check(matchId, String);
    check(userId, String);
    const userHasBetInMatch = Bets.find({
      $and: [{ userId }, { userchoice }, { matchId }]
    }).count();
    if (userHasBetInMatch == 1) {
      const userBet = Bets.findOne({
        $and: [{ userId }, { userchoice }, { matchId }]
      });
      const newStake = parseInt(userBet.stake) + parseInt(stake);
      Bets.update(
        {
          $and: [{ userId }, { userchoice }, { matchId }]
        },
        {
          $set: { stake: newStake }
        }
      );
    } else {
      Bets.insert({
        userId,
        userchoice,
        stake,
        matchId,
        complete: false
      });
    }
  },
  "bets.finish"(matchId) {
    if (!Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }
    const bets = Bets.find({ matchId }).fetch();
    const match = Matches.findOne({ _id: matchId });
    if (match.winner !== "x") {
      let stake = 0,
        percentAll = 0,
        restPercent = 0,
        perUserAdd = 0,
        restOfStake = 0;
      const winningBets = [];
      for (let i in bets) {
        const bet = bets[i];
        stake = parseInt(stake) + parseInt(bet.stake);
        Bets.update({ _id: bet._id }, { $set: { complete: true } });
        if (bet.userchoice === match.winner) {
          winningBets.push(bet);
        }
      }
      restOfStake = stake;
      for (let i in winningBets) {
        const bet = winningBets[i];
        const currentUserTokens = Meteor.users.findOne(
          { _id: bet.userId },
          { fields: { "profile.tokens": 1 } }
        );
        percent = Math.floor(parseInt(bet.stake) / stake * 100);
        bet.percent = parseInt(percent);
        bet.userTokens = currentUserTokens;
        bet.userTokens.profile.tokens =
          parseInt(bet.userTokens.profile.tokens) + parseInt(bet.stake);
        restOfStake = restOfStake - parseInt(bet.stake);
        percentAll = percentAll + percent;
      }
      restPercent = 100 - percentAll;
      perUserAdd = restPercent / winningBets.length;
      for (let i in winningBets) {
        const bet = winningBets[i];
        bet.percent = parseInt(bet.percent) + perUserAdd;
        const toAdd = restOfStake * parseInt(bet.percent) / 100;
        const tokens = parseInt(bet.userTokens.profile.tokens) + toAdd;
        Meteor.users.update(bet.userTokens._id, {
          $set: { "profile.tokens": tokens }
        });
      }
    }
  }
});
