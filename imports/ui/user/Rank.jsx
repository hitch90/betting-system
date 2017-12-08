import React, { Component } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import { Meteor } from "meteor/meteor";
import { createContainer } from "meteor/react-meteor-data";
import Users from "../../api/users";
class RankComponent extends Component {
  getUserPosition() {
    for (let index in this.props.users) {
      const currentUser = this.props.users[index];
      if (this.props.currentUser._id == currentUser._id) {
        return index;
      }
    }
  }
  render() {
    return <span className="account__rank">#{this.getUserPosition()}</span>;
  }
}

export default createContainer(() => {
  Meteor.subscribe("users.name");
  return {
    users: Meteor.users.find({}, { sort: { "profile.tokens": -1 } }).fetch(),
    currentUser: Meteor.user()
  };
}, RankComponent);
