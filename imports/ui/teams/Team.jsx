import React, { Component } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import { Meteor } from "meteor/meteor";

import { createContainer } from "meteor/react-meteor-data";

import { Teams } from "../../api/teams.js";
import AddTeam from "./Add.jsx";
import Update from "./Update.jsx";

// Task component - represents a single todo item
class TeamComponent extends Component {
  render() {
    return <div className="team" />;
  }
}

TeamComponent.PropTypes = {
  team: PropTypes.object.isRequired,
  currentUser: PropTypes.object
};

export default createContainer(params => {
  Meteor.subscribe("teams");
  return {
    team: Teams.findOne({ _id: params.match.params.id }),
    currentUser: Meteor.user()
  };
}, TeamComponent);
