import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { Meteor } from "meteor/meteor";
import { createContainer } from "meteor/react-meteor-data";
import { Matches } from "../../api/matches.js";

import {
  displayDate,
  displayLogo,
  displayWinner,
  displayEvent
} from "../helpers/team.jsx";

class MatchListComponent extends Component {
  setWinner(id, event) {
    Meteor.call("matches.setWinner", id, event.target.value);
    Meteor.call("bets.finish", id);
  }
  deleteMatch(id) {
    Meteor.call("matches.remove", id);
  }
  showAdminTools(match) {
    return (
      this.props.currentUser && (
        <div className="matchList__admin">
          <span
            onClick={() => {
              this.deleteMatch(match._id);
            }}
            className="delete"
          >
            delete match
          </span>
          {!match.winner && (
            <select
              value={match.winner}
              className="select"
              onChange={event => {
                this.setWinner(match._id, event);
              }}
            >
              <option value={null}>Select winner</option>
              <option value="x">Draw</option>
              <option value={match.firstOpponent._id}>
                {match.firstOpponent.name}
              </option>
              <option value={match.secondOpponent._id}>
                {match.secondOpponent.name}
              </option>
            </select>
          )}
        </div>
      )
    );
  }
  render() {
    return (
      <div className="matches__matchList matchList">
        {this.props.matches.map(match => (
          <div className="matchList__item" key={match._id}>
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
              {this.showAdminTools(match)}
            </div>
            {displayEvent(match)}
          </div>
        ))}
        {this.props.matches.length === 0 && (
          <div className="matchList__empty">No result found</div>
        )}
      </div>
    );
  }
}

MatchListComponent.PropTypes = {
  matches: PropTypes.array.isRequired,
  currentUser: PropTypes.object
};

export default createContainer(params => {
  Meteor.subscribe("matches.all");
  let query = {};
  if (params.options.game) {
    query = { "game._id": params.options.game._id, ...query };
  }
  if (params.options.event) {
    query = { "event._id": params.options.event._id, ...query };
  }
  if (params.options.team) {
    query = {
      $or: [
        {
          "firstOpponent._id": params.options.team._id
        },
        { "secondOpponent._id": params.options.team._id }
      ],
      ...query
    };
  }
  console.log(query);
  return {
    currentUser: Meteor.user(),
    matches: Matches.find(
      { ...query, complete: params.options.complete },
      { sort: { _id: -1 } }
    ).fetch()
  };
}, MatchListComponent);
