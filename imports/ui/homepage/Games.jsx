import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { Link } from 'react-router-dom';

export default class GamesComponent extends Component {
  gameList() {
    return this.props.games.map(game => (
      <a
        href="#"
        key={game._id}
        onClick={this.props.onSelectGame}
        data-id={game._id}
        className={this.props.activeGame === game._id ? 'active' : ''}
      >
        {game.name}
      </a>
    ));
  }
  render() {
    return <div className="homepage__filtersGame">{this.gameList()}</div>;
  }
}
