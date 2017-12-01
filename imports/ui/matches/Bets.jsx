import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import { Bets } from '../../api/matches.js';

class AddMatch extends Component {
  state = {
    stake: null,
    choice: null
  };
  handleSubmit(event) {
    event.preventDefault();
    if (this.state.stake > this.props.currentUser.profile.tokens) {
      alert('you dont have enougth tokens');
      return false;
    }
    if (!this.state.choice) {
      alert('You have to choice team');
      return false;
    }
    Meteor.call(
      'bets.insert',
      Meteor.userId(),
      this.state.choice,
      this.state.stake,
      this.props.match._id
    );
    this.updateTokens();
  }
  updateTokens() {
    const newTokens =
      parseInt(this.props.currentUser.profile.tokens) -
      parseInt(this.state.stake);
    console.log(newTokens);
    Meteor.users.update(Meteor.userId(), {
      $set: { 'profile.tokens': newTokens }
    });
  }
  render() {
    return (
      <div>
        <form
          className="new-match"
          onSubmit={event => this.handleSubmit(event)}
        >
          {this.props.currentUser && (
            <div>
              <label>
                stake
                <input
                  type="text"
                  onChange={event => {
                    this.setState({ stake: event.target.value });
                  }}
                />
              </label>
              <label>
                choice
                <select
                  onChange={event => {
                    this.setState({
                      choice: event.target.value
                    });
                  }}
                  required
                >
                  <option value={null}>Select team</option>
                  <option value={this.props.match.firstOpponent.id}>
                    {this.props.match.firstOpponent.name}
                  </option>
                  <option value={this.props.match.secondOpponent.id}>
                    {this.props.match.secondOpponent.name}
                  </option>
                </select>
              </label>
              <input type="submit" value="Send" />
            </div>
          )}
        </form>
      </div>
    );
  }
}
AddMatch.PropTypes = {
  currentUser: PropTypes.object
};

export default createContainer(() => {
  return {
    currentUser: Meteor.user()
  };
}, AddMatch);
