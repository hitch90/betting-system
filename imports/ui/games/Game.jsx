import React, { Component } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import { Meteor } from "meteor/meteor";
import { Link } from "react-router-dom";

import { createContainer } from "meteor/react-meteor-data";
import AccountsUIWrapper from "../AccountsUIWrapper.jsx";

import { Games } from "../../api/games.js";

class GamesComponent extends Component {
  render() {
    return (
      <div className="contianer">
        Game:
        {this.props.game.map(game => <div key={game._id}>{game.name}</div>)}
      </div>
    );
  }
}

GamesComponent.PropTypes = {
  games: PropTypes.array.isRequired,
  currentUser: PropTypes.object
};

export default createContainer(params => {
  Meteor.subscribe("games.all");
  return {
    game: Games.find({ slug: params.match.params.slug }).fetch(),
    currentUser: Meteor.user()
  };
}, GamesComponent);
