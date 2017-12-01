import React, { Component } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import { Meteor } from "meteor/meteor";
import { Link } from "react-router-dom";

import { createContainer } from "meteor/react-meteor-data";

import { Teams } from "../../api/teams.js";
import AddTeam from "./Add.jsx";
import Update from "./Update.jsx";

// Task component - represents a single todo item
class TeamsComponent extends Component {
  state = {
    editMode: null
  };
  delete(id) {
    Meteor.call("teams.remove", id);
  }
  edit(id) {
    this.setState({
      editMode: id
    });
  }
  displayLogo(team) {
    if (team.logo) {
      return (
        <img src={team.logo} style={{ maxWidth: "25px", marginRight: "5px" }} />
      );
    }
    return;
  }
  teamsList() {
    return this.props.teams.map(team => (
      <li key={team._id}>
        {this.displayLogo(team)}
        <Link to={`/team/${team._id}`}>{team.name}</Link>{" "}
        <span
          onClick={() => {
            this.delete(team._id);
          }}
        >
          delete
        </span>
        <span
          onClick={() => {
            this.edit(team._id);
          }}
        >
          edit&nbsp;
        </span>
        {this.state.editMode == team._id && (
          <Update id={team._id} name={team.name} logo={team.logo} />
        )}
      </li>
    ));
  }
  render() {
    return (
      <div className="teams">
        {this.props.currentUser && <AddTeam />}
        <ul className="teams__list">{this.teamsList()}</ul>
      </div>
    );
  }
}

TeamsComponent.PropTypes = {
  teams: PropTypes.array.isRequired,
  currentUser: PropTypes.object
};

export default createContainer(() => {
  Meteor.subscribe("teams");
  return {
    teams: Teams.find({}).fetch(),
    currentUser: Meteor.user()
  };
}, TeamsComponent);
