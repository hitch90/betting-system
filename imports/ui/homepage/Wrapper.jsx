import React, { Component } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import { Meteor } from "meteor/meteor";
import { createContainer } from "meteor/react-meteor-data";

import { Games } from "../../api/games.js";

import GamesView from "./Games.jsx";
import MatchesView from "./Matches.jsx";
class HomepageWrapper extends Component {
  constructor() {
    super();
    this.state = {
      game: null,
      showComplete: false,
      filtersState: false
    };
    this.onSelectGame = this.onSelectGame.bind(this);
  }
  onSelectGame(event) {
    event.preventDefault();
    if (event.target.dataset.id === this.state.game) {
      this.setState({
        game: null
      });
      return;
    }
    this.setState({
      game: event.target.dataset.id
    });
  }
  render() {
    return (
      <div className="homepage">
        <div className="homepage__filters">
          <a
            href="#"
            onClick={e => {
              e.preventDefault();
              this.setState({ filtersState: true });
            }}
            className="btn btn--primary btn--filtersMobile"
          >
            Filters
          </a>
          <div
            className={`homepage__filtersWrapper ${
              this.state.filtersState ? "active" : ""
            }`}
          >
            <h4 className="homepage__filtersTitle">Game</h4>
            <GamesView
              games={this.props.games}
              onSelectGame={this.onSelectGame}
              activeGame={this.state.game}
            />
            <h4 className="homepage__filtersTitle">Status</h4>
            <ul className="homepage__filtersStatus">
              <li className={!this.state.showComplete ? "active" : ""}>
                <a
                  href="#"
                  onClick={event => {
                    event.preventDefault();
                    this.setState({ showComplete: false });
                  }}
                >
                  Upcomming
                </a>
              </li>
              <li className={this.state.showComplete ? "active" : ""}>
                <a
                  href="#"
                  onClick={event => {
                    event.preventDefault();
                    this.setState({ showComplete: true });
                  }}
                >
                  Results
                </a>
              </li>
            </ul>
            <a
              href="#"
              onClick={e => {
                e.preventDefault();
                this.setState({ filtersState: false });
              }}
              className="btn btn--primary btn--filtersSubmit"
            >
              Show matches
            </a>
          </div>
        </div>
        {!this.props.currentUser && (
          <div className="homepage__registerBox">
            <h2 className="typo__h2">Register to Play Esbets</h2>
            <p>
              Lorem ipsum
            </p>
            <a href="/signup" className="btn btn--primary">
              Sign up now <i className="fa fa-arrow-right" />
            </a>
          </div>
        )}
        <div className="homepage__container">
          <MatchesView
            game={this.state.game}
            showComplete={this.state.showComplete}
          />
          <div className="homepage__sidebar">sidebar</div>
        </div>
      </div>
    );
  }
}

HomepageWrapper.PropTypes = {
  matches: PropTypes.array.isRequired,
  currentUser: PropTypes.object
};

export default createContainer(() => {
  Meteor.subscribe("games.all");
  return {
    games: Games.find().fetch(),
    currentUser: Meteor.user()
  };
}, HomepageWrapper);
