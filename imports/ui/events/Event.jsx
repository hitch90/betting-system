import React, { Component } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import { Meteor } from "meteor/meteor";
import { Link } from "react-router-dom";

import { createContainer } from "meteor/react-meteor-data";
import AccountsUIWrapper from "../AccountsUIWrapper.jsx";

import { Events } from "../../api/events.js";

class EventComponent extends Component {
  render() {
    return (
      <div className="contianer">
        Event:
        {this.props.events.map(event => (
          <div key={event._id}>{event.name}</div>
        ))}
      </div>
    );
  }
}

EventComponent.PropTypes = {
  events: PropTypes.array.isRequired,
  currentUser: PropTypes.object
};

export default createContainer(params => {
  Meteor.subscribe("events.all");
  Meteor.subscribe("matches.all");
  return {
    events: Events.find({ slug: params.match.params.slug }).fetch(),
    currentUser: Meteor.user()
  };
}, EventComponent);
