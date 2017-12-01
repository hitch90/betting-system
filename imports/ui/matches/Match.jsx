import React, { Component } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import { Meteor } from "meteor/meteor";

import { createContainer } from "meteor/react-meteor-data";

import { Matches } from "../../api/matches.js";
import { Bets } from "../../api/bets.js";
import History from "./History.jsx";
import Stats from "./Stats.jsx";
import { displayDate, displayLogo, displayWinner } from "../helpers/team.jsx";
class MatchComponent extends Component {
  state = {
    stake: null,
    choice: null
  };
  handleSubmit(id, choice) {
    if (this.state.stake > this.props.currentUser.profile.tokens) {
      alert("you dont have enougth tokens");
      return false;
    }
    Meteor.call("bets.insert", Meteor.userId(), choice, this.state.stake, id);
    this.updateTokens();
  }
  updateTokens() {
    const newTokens =
      parseInt(this.props.currentUser.profile.tokens) -
      parseInt(this.state.stake);
    Meteor.users.update(Meteor.userId(), {
      $set: { "profile.tokens": newTokens }
    });
  }
  displayUser(id) {
    const user = Meteor.users.findOne({ _id: id });
    if (user) {
      return user.username;
    }
  }
  countStake(team) {
    let summaryBet = 0;
    let countBet = 0;
    this.props.bets.map(bet => {
      if (bet.userchoice === team) {
        summaryBet = parseInt(summaryBet) + parseInt(bet.stake);
        countBet = countBet + 1;
      }
    });
    return (
      <div className="match__summaryStake">
        <strong>Pool</strong>
        {summaryBet}
        <strong>{countBet} bets</strong>
      </div>
    );
  }
  render() {
    return (
      <div className="match">
        {this.props.matchWrapper.map(match => (
          <div key={match._id}>
            <header className="match__header">
              <img
                src={match.game.image}
                alt={`${match.firstOpponent.name} vs ${
                  match.secondOpponent.name
                }`}
                className="match__headerCover"
              />
              <div className="match__headerContent">
                <span className="match__headerTeam match__headerTeam--first">
                  <span className="match__headerLogo">
                    {displayLogo(match.firstOpponent)}
                  </span>
                  {match.firstOpponent.name}
                </span>
                {match.complete && displayWinner(match, "match__matchWinner")}
                {!match.complete && displayDate(match, "match__matchDate")}
                <span className="match__headerTeam match__headerTeam--second">
                  {match.secondOpponent.name}
                  <span className="match__headerLogo">
                    {displayLogo(match.secondOpponent)}
                  </span>
                </span>
              </div>
            </header>
            {!match.complete && (
              <div>
                <h2 className="typo typo__h2 typo__h2--match">Join to game</h2>
                {this.props.currentUser && (
                  <div className="match__form">
                    <div className="match__sumStake match__sumStake--first">
                      <a
                        href="#"
                        className="btn btn--primary btn--join"
                        data-team={match.firstOpponent._id}
                        onClick={event => {
                          event.preventDefault();
                          this.handleSubmit(
                            match._id,
                            event.target.dataset.team
                          );
                        }}
                      >
                        BET
                      </a>
                      {this.countStake(match.firstOpponent._id)}
                    </div>
                    <div className="match__input">
                      <input
                        type="number"
                        placeholder="Your stake"
                        ref="stake"
                        onChange={event => {
                          this.setState({ stake: event.target.value });
                        }}
                      />
                    </div>
                    <div className="match__sumStake match__sumStake--second">
                      <a
                        href="#"
                        data-team={match.secondOpponent._id}
                        onClick={event => {
                          event.preventDefault();
                          this.handleSubmit(
                            match._id,
                            event.target.dataset.team
                          );
                        }}
                        className="btn btn--primary btn--join"
                      >
                        BET
                      </a>
                      {this.countStake(match.secondOpponent._id)}
                    </div>
                  </div>
                )}
                {!this.props.currentUser && (
                  <div className="alert alert-info alert--static" role="alert">
                    You need log in before join to bet
                  </div>
                )}
              </div>
            )}
            {match.complete && (
              <h2 className="typo typo__h2 typo__h2--match">
                This match is over
              </h2>
            )}
            <div className="match__stats">
              <div className="match__stat">
                <div className="match__statHeader">
                  {displayLogo(match.firstOpponent)}
                  <span>{match.firstOpponent.name}</span>
                  <a href="#" className="btn btn--outline">
                    Follow
                  </a>
                </div>
                <Stats
                  teamId={match.firstOpponent._id}
                  gameId={match.game._id}
                />
              </div>
              <div className="match__stat">
                <div className="match__statHeader">
                  {displayLogo(match.secondOpponent)}
                  <span>{match.secondOpponent.name}</span>
                  <a href="#" className="btn btn--outline">
                    Follow
                  </a>
                </div>
                <Stats
                  teamId={match.secondOpponent._id}
                  gameId={match.game._id}
                />
              </div>
            </div>
            <div className="match__historyFull">
              <h3 className="typo typo__h2">Recent encounters</h3>
              <History
                teamId={match.firstOpponent._id}
                secondTeamId={match.secondOpponent._id}
                gameId={match.game._id}
              />
            </div>
            <div className="match__container">
              <div className="match__historyHalf">
                <h3 className="typo typo__h2">
                  {match.firstOpponent.name} last 5 matches
                </h3>
                <History
                  teamId={match.firstOpponent._id}
                  gameId={match.game._id}
                />
              </div>
              <div className="match__historyHalf">
                <h3 className="typo typo__h2">
                  {match.secondOpponent.name} last 5 matches
                </h3>
                <History
                  teamId={match.secondOpponent._id}
                  gameId={match.game._id}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
}

MatchComponent.PropTypes = {
  currentUser: PropTypes.object,
  bets: PropTypes.array
};

export default createContainer(params => {
  Meteor.subscribe("matches.all");
  Meteor.subscribe("bets.all");
  Meteor.subscribe("users.name");
  return {
    currentUser: Meteor.user(),
    matchWrapper: Matches.find({ _id: params.match.params.id }).fetch(),
    bets: Bets.find({ matchId: params.match.params.id }).fetch()
  };
}, MatchComponent);
