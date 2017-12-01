import React, { Component } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import { Meteor } from "meteor/meteor";
import { createContainer } from "meteor/react-meteor-data";
import Select from "react-select";
import DatePicker from "react-datepicker";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import "react-select/dist/react-select.css";

import { Matches } from "../../api/matches.js";
import { Teams } from "../../api/teams.js";
import { Games } from "../../api/games.js";
import { Events } from "../../api/events.js";

class AddMatch extends Component {
  state = {
    firstOpponent: null,
    secondOpponent: null,
    game: null,
    event: null,
    startAt: null,
    startDate: moment(),
    isSet: false
  };
  handleSubmit(event) {
    event.preventDefault();
    Meteor.call(
      "matches.insert",
      this.state.firstOpponent,
      this.state.secondOpponent,
      this.state.game,
      this.state.event,
      this.state.startAt
    );
  }
  handleChange(date) {
    this.setState({
      startDate: date,
      startAt: moment(date).format("YYYY-MM-DD HH:mm")
    });
  }
  selectFirstTeam(val) {
    this.setState({
      firstOpponent: val
    });
  }
  selectSecondTeam(val) {
    this.setState({
      secondOpponent: val
    });
  }
  selectGame(val) {
    this.setState({
      game: val
    });
  }
  selectEvent(val) {
    this.setState({
      event: val
    });
  }
  render() {
    return (
      <div className="matches matches--add">
        <h2 className="typo typo__h2">Add new match</h2>
        <form
          className="matches__form"
          onSubmit={event => this.handleSubmit(event)}
        >
          <div className="matches__field">
            <Select
              name="form-field-name"
              value="one"
              options={this.props.teams}
              onChange={this.selectFirstTeam.bind(this)}
              value={this.state.firstOpponent}
              placeholder="Home team"
            />
          </div>
          <div className="matches__field">
            <Select
              name="form-field-name"
              value="one"
              options={this.props.teams}
              onChange={this.selectSecondTeam.bind(this)}
              value={this.state.secondOpponent}
              placeholder="Away team"
            />
          </div>
          <div className="matches__field">
            <Select
              name="form-field-name"
              value="one"
              options={this.props.games}
              onChange={this.selectGame.bind(this)}
              value={this.state.game}
              placeholder="Game"
            />
          </div>
          <div className="matches__field">
            <Select
              name="form-field-name"
              value="one"
              options={this.props.events}
              onChange={this.selectEvent.bind(this)}
              value={this.state.event}
              placeholder="Tournament"
            />
          </div>
          <div className="matches__field matches__field--calendar">
            <DatePicker
              selected={this.state.startDate}
              onChange={this.handleChange.bind(this)}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="DD-MM-YYYY HH:mm"
            />
          </div>
          <button type="submit" className="btn btn--primary">
            Add
          </button>
        </form>
      </div>
    );
  }
}
AddMatch.PropTypes = {
  currentUser: PropTypes.object
};

export default createContainer(() => {
  Meteor.subscribe("teams");
  Meteor.subscribe("games.all");
  Meteor.subscribe("events.all");
  const teamsArray = [];
  const teams = Teams.find({}).fetch();
  for (let i in teams) {
    const team = teams[i];
    const teamObj = {
      ...team,
      label: team.name,
      value: team._id
    };
    teamsArray.push(teamObj);
  }

  const gamesArray = [];
  const games = Games.find({}).fetch();
  for (let i in games) {
    const game = games[i];
    const gameObj = {
      ...game,
      label: game.name,
      value: game._id
    };
    gamesArray.push(gameObj);
  }

  const eventsArray = [];
  const events = Events.find({}).fetch();
  for (let i in events) {
    const event = events[i];
    const eventObj = {
      ...event,
      label: event.name,
      value: event._id
    };
    eventsArray.push(eventObj);
  }

  return {
    teams: teamsArray,
    games: gamesArray,
    events: eventsArray,
    currentUser: Meteor.user()
  };
}, AddMatch);
