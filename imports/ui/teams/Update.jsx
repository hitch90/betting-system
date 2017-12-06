import React, { Component } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import { Meteor } from "meteor/meteor";

import { Teams } from "../../api/teams.js";

export default class AddTeams extends Component {
  handleSubmit(event) {
    event.preventDefault();
    const name = ReactDOM.findDOMNode(this.refs.name).value.trim();
    const logo = ReactDOM.findDOMNode(this.refs.logo).value.trim();
    Meteor.call("teams.update", this.props.id, name, logo);
  }
  render() {
    return (
      <form className="teams__form" onSubmit={this.handleSubmit.bind(this)}>
        <div className="teams__field">
          <label>Team name</label>
          <input type="text" ref="name" defaultValue={this.props.name} />
        </div>
        <div className="teams__field">
          <label>Logo url</label>
          <input type="text" ref="logo" defaultValue={this.props.logo} />
        </div>
        <button type="submit" className="btn btn--primary">
          Save
        </button>
        <button
          type="submit"
          onClick={this.props.onClose}
          className="btn btn--secondary"
        >
          Close
        </button>
      </form>
    );
  }
}
AddTeams.PropTypes = {
  currentUser: PropTypes.object
};
