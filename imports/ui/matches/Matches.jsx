import React, { Component } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import { Meteor } from "meteor/meteor";
import { createContainer } from "meteor/react-meteor-data";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import Select from "react-select";
import "react-select/dist/react-select.css";
import "react-tabs/style/react-tabs.css";
import { Link } from "react-router-dom";

import AddMatch from "./Add.jsx";
import MatchList from "./MatchList.jsx";

import { Teams } from "../../api/teams.js";
import { Games } from "../../api/games.js";
import { Events } from "../../api/events.js";

class MatchesComponent extends Component {
  state = {
    game: null,
    event: null,
    team: null
  };
  selectTeam(val) {
    this.setState({
      team: val
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
      <div className="matches">
        {this.props.currentUser &&
          this.props.currentUser.username === "admin" && (
            <Link to="match/add" className="btn btn--primary btn--addMatch">
              Add new match
            </Link>
          )}
        <div className="matches__filters">
          <div className="matches__filter">
            <Select
              name="form-field-name"
              value="one"
              options={this.props.teams}
              onChange={this.selectTeam.bind(this)}
              value={this.state.team}
              placeholder="Team"
            />
          </div>
          <div className="matches__filter">
            <Select
              name="form-field-name"
              value="one"
              options={this.props.games}
              onChange={this.selectGame.bind(this)}
              value={this.state.game}
              placeholder="Game"
            />
          </div>
          <div className="matches__filter">
            <Select
              name="form-field-name"
              value="one"
              options={this.props.events}
              onChange={this.selectEvent.bind(this)}
              value={this.state.event}
              placeholder="Event"
            />
          </div>
        </div>
        <Tabs>
          <TabList>
            <Tab>
              <h2 className="typo typo__h2">Open</h2>
            </Tab>
            <Tab>
              <h2 className="typo typo__h2">Finish</h2>
            </Tab>
          </TabList>
          <TabPanel>
            <MatchList
              options={{
                complete: false,
                ...this.state
              }}
              full={true}
              currentUser={this.props.currentUser}
            />
          </TabPanel>
          <TabPanel>
            <MatchList
              options={{
                complete: true,
                ...this.state
              }}
              full={true}
              currentUser={this.props.currentUser}
            />
          </TabPanel>
        </Tabs>
      </div>
    );
  }
}

MatchesComponent.PropTypes = {
  matches: PropTypes.array.isRequired,
  currentUser: PropTypes.object
};

export default createContainer(() => {
  Meteor.subscribe("matches.all");
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
}, MatchesComponent);
