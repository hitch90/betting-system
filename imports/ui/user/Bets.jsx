import React, { Component } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import { Meteor } from "meteor/meteor";
import { Link } from "react-router-dom";

import { createContainer } from "meteor/react-meteor-data";
import AccountsUIWrapper from "../AccountsUIWrapper.jsx";

import { Matches } from "../../api/matches.js";

class BetsComponent extends Component {
  render() {
    return (
      <div className="account__betDetails">
        {!this.props.matches.length && (
          <p className="delete">Match was deleted.</p>
        )}
        {this.props.matches.map(match => (
          <div
            key={match._id}
            className={`${
              match.winner === this.props.choice
                ? "account__win"
                : "account__normal"
            }`}
          >
            <Link to={`/match/${match._id}`} className="account__teams">
              {match.firstOpponent.name} vs {match.secondOpponent.name}{" "}
            </Link>
            <div className="account__choice">
              your choice:&nbsp;
              {this.props.choice === match.firstOpponent._id && (
                <span className="choice-team"> {match.firstOpponent.name}</span>
              )}
              {this.props.choice === match.secondOpponent._id && (
                <span className="choice-team">
                  {" "}
                  {match.secondOpponent.name}
                </span>
              )}
            </div>{" "}
            /
            <div className="account__winner">id: {this.props.id}</div>
            /
            {match.winner && (
              <div className="account__winner">
                winner:&nbsp;
                {match.firstOpponent._id === match.winner && (
                  <span className="winner-team">
                    {match.firstOpponent.name}
                  </span>
                )}
                {match.secondOpponent._id === match.winner && (
                  <span className="winner-team">
                    {match.secondOpponent.name}
                  </span>
                )}
                {match.winner === "x" && (
                  <span className="winner-team">Draw</span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }
}

BetsComponent.PropTypes = {
  currentUser: PropTypes.object,
  bets: PropTypes.array
};

export default createContainer(param => {
  Meteor.subscribe("matches.all");
  return {
    matches: Matches.find({ _id: param.match }).fetch()
  };
}, BetsComponent);
