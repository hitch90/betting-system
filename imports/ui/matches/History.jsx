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
class HistoryComponent extends Component {
  countStats(teamId) {
    const matches = this.props.matches;
    const matchesCount = this.props.matches.length;
    const stats = {
      win: 0,
      lose: 0,
      matches: matchesCount
    };
    for (let i in matches) {
      const match = matches[i];
      if (match.winner == teamId) {
        stats.win = stats.win + 1;
      } else {
        stats.lose = stats.lose + 1;
      }
    }
    return stats;
  }
  countWinningPercent(isSecond) {
    let stats;
    if (isSecond && this.props.secondTeamId) {
      stats = this.countStats(this.props.secondTeamId);
    } else {
      stats = this.countStats(this.props.teamId);
    }
    return parseInt(stats.win / stats.matches * 100) + "%";
  }
  render() {
    return (
      <div className={`matches__matchList`}>
        {this.props.secondTeamId &&
          this.props.matches.length > 0 && (
            <div className="match__chance">
              <div
                className="match__chanceFirst"
                style={{ width: this.countWinningPercent() }}
              >
                {this.countWinningPercent()}
              </div>
              <div
                className="match__chanceSecond"
                style={{ width: this.countWinningPercent(true) }}
              >
                {this.countWinningPercent(true)}
              </div>
            </div>
          )}
        {this.props.matches.map(match => (
          <div
            className="homepage__matchItem homepage__matchItem--history"
            key={match._id}
          >
            <div
              className="homepage__matchGame"
              style={{ backgroundImage: `url('${match.game.logo}')` }}
            />
            <div className="homepage__matchDetails">
              <Link to={`/match/${match._id}`} className="homepage__matchLink">
                <span className="homepage__matchFirstTeam">
                  {match.firstOpponent.name} {displayLogo(match.firstOpponent)}
                </span>
                {match.complete && displayWinner(match)}
                <span className="homepage__matchSecondTeam">
                  {displayLogo(match.secondOpponent)}
                  {match.secondOpponent.name}
                </span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    );
  }
}

export default createContainer(params => {
  Meteor.subscribe("matches.all");
  if (params.secondTeamId) {
    return {
      matches: Matches.find(
        {
          $or: [
            {
              $and: [
                { "firstOpponent.id": params.teamId },
                { "secondOpponent.id": params.secondTeamId }
              ]
            },
            {
              $and: [
                { "firstOpponent.id": params.secondTeamId },
                { "secondOpponent.id": params.teamId }
              ]
            }
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
        { limit: 5 }
      ).fetch()
    };
  }
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
      { limit: 5 }
    ).fetch()
  };
}, HistoryComponent);
