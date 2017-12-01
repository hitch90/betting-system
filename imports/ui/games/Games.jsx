import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { Link } from 'react-router-dom';

import { createContainer } from 'meteor/react-meteor-data';
import AccountsUIWrapper from '../AccountsUIWrapper.jsx';

import { Games } from '../../api/games.js';
import AddGame from './Add.jsx';

class GamesComponent extends Component {
  deleteMatch(id) {
    Meteor.call('matches.remove', id);
  }
  displayLogo(game) {
    if (game.logo) {
      return (
        <img src={game.logo} style={{ maxWidth: '25px', marginRight: '5px' }} />
      );
    }
    return;
  }
  gameList() {
    return this.props.games.map(game => (
      <li key={game._id}>
        <Link to={`/game/${game.slug}`}>
          {this.displayLogo(game)}
          {game.name}
        </Link>
      </li>
    ));
  }
  render() {
    return (
      <div className="teams">
        {this.props.currentUser && <AddGame />}
        <ul className="teams__list">{this.gameList()}</ul>
      </div>
    );
  }
}

GamesComponent.PropTypes = {
  games: PropTypes.array.isRequired,
  currentUser: PropTypes.object
};

export default createContainer(() => {
  Meteor.subscribe('games.all');
  return {
    games: Games.find({}).fetch(),
    currentUser: Meteor.user()
  };
}, GamesComponent);
