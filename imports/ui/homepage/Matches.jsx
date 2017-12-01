import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { createContainer } from "meteor/react-meteor-data";

import { Matches } from "../../api/matches.js";
import BetStake from "./Bets.jsx";

import {
  displayDate,
  displayLogo,
  displayWinner,
  displayEvent
} from "../helpers/team.jsx";

class MatchListComponent extends Component {
  matchWrapper(match) {
    return (
      <div className="matchList__item">
        <div
          className="matchList__game"
          style={{ backgroundImage: `url('${match.game.logo}')` }}
        />
        <div className="matchList__details">
          <Link to={`/match/${match._id}`} className="matchList__link">
            <span className="matchList__homeTeam">
              {match.firstOpponent.name} {displayLogo(match.firstOpponent)}
            </span>
            {match.complete && displayWinner(match)}
            {!match.complete && displayDate(match)}
            <span className="matchList__awayTeam">
              {displayLogo(match.secondOpponent)}
              {match.secondOpponent.name}
            </span>
          </Link>
        </div>
        {displayEvent(match)}
        <div className="matchList__pool">
          <span>
            Pool: <BetStake match={match._id} />
          </span>
        </div>
      </div>
    );
  }
  matchList(showToday) {
    if (showToday) {
      const matches = this.props.matches;
      const matchesToday = [];
      const now = moment().format("MMDDYYYY");
      const nowFormat = moment().format("DD.MM.YY");
      for (let i in matches) {
        const currentMatch = matches[i];
        if (moment(currentMatch.startAt).format("MMDDYYYY") == now) {
          matchesToday.push(currentMatch);
        }
      }
      const renderedMatchList = matchesToday.map(match => (
        <div key={match._id}>{this.matchWrapper(match)}</div>
      ));
      const restMatches = matches.map(
        match =>
          moment(match.startAt).format("MMDDYYYY") > now && (
            <div key={match._id}>{this.matchWrapper(match)}</div>
          )
      );
      return (
        <div>
          {matchesToday.length > 0 && (
            <div className="homepage__todayList">
              <h2 className="typo__h2 typo__h2--matchday">
                Today - {nowFormat}:
              </h2>
              {renderedMatchList}
            </div>
          )}
          <h2 className="typo__h2 typo__h2--matchday">Soon:</h2>
          {restMatches}
        </div>
      );
    }
    return this.props.matches.map(match => (
      <div key={match._id}>{this.matchWrapper(match)}</div>
    ));
  }
  render() {
    return (
      <div className="homepage__matchList matchList">
        {!this.props.showComplete && this.matchList(true)}
        {this.props.showComplete && this.matchList()}
        {this.props.matches.length === 0 && (
          <div className="alert alert-info" role="alert">
            No result found
          </div>
        )}
      </div>
    );
  }
}

MatchListComponent.PropTypes = {
  matches: PropTypes.array.isRequired,
  currentUser: PropTypes.object
};

export default createContainer(param => {
  Meteor.subscribe("matches.all");
  if (param.game) {
    return {
      matches: Matches.find(
        { "game._id": param.game, complete: param.showComplete },
        { sort: ["startAt", "asc"] }
      ).fetch(),
      currentUser: Meteor.user()
    };
  }
  return {
    matches: Matches.find(
      { complete: param.showComplete },
      { sort: ["startAt", "asc"] }
    ).fetch(),
    currentUser: Meteor.user()
  };
}, MatchListComponent);
