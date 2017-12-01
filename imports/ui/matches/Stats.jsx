import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Link } from "react-router-dom";
import { Matches } from "../../api/matches.js";
import { createContainer } from "meteor/react-meteor-data";

import {
  displayDate,
  displayLogo,
  displayWinner,
  displayEvent
} from "../helpers/team.jsx";

class StatsComponent extends Component {
  winRate() {
    const matchesCount = this.props.matches.length;
    let win = 0;
    this.props.matches.map(match => {
      if (match.winner == this.props.teamId) {
        win = win + 1;
      }
    });
    return parseInt(win / matchesCount * 100) + "%";
  }
  render() {
    return (
      <div className="match__statWrapper">
        <div className="match__statContainer">
          <div className="match__winRate">
            <div
              className="match__statChart"
              style={{ width: this.winRate() }}
            />
            <div className="match__winRateContent">
              <strong>Win rate</strong>
              {this.winRate()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default createContainer(params => {
  Meteor.subscribe("matches.all");
  return {
    matches: Matches.find(
      {
        $or: [
          {
            "firstOpponent.id": params.teamId
          },
          { "secondOpponent.id": params.teamId }
        ],
        $and: [
          {
            complete: true
          },
          {
            "game.id": params.gameId
          }
        ]
      },
      {}
    ).fetch()
  };
}, StatsComponent);
