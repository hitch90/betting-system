import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';

import { createContainer } from 'meteor/react-meteor-data';
import AccountsUIWrapper from '../AccountsUIWrapper.jsx';

import { Matches } from '../../api/matches.js';
import { Bets } from '../../api/bets.js';

class BetsComponent extends Component {
  countStake() {
    let summaryBet = 0;
    this.props.bets.map(bet => {
      summaryBet = parseInt(summaryBet) + parseInt(bet.stake);
    });
    return summaryBet;
  }
  render() {
    return this.countStake();
  }
}

BetsComponent.PropTypes = {
  currentUser: PropTypes.object,
  bets: PropTypes.array
};

export default createContainer(param => {
  Meteor.subscribe('bets.all');
  return {
    bets: Bets.find({ matchId: param.match }).fetch()
  };
}, BetsComponent);
