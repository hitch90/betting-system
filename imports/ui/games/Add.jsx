import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import { Games } from '../../api/games.js';

class AddGames extends Component {
  handleSubmit(event) {
    event.preventDefault();
    const name = ReactDOM.findDOMNode(this.refs.name).value.trim();
    const logo = ReactDOM.findDOMNode(this.refs.logo).value.trim();
    const image = ReactDOM.findDOMNode(this.refs.image).value.trim();
    const slug = name.toLowerCase().replace(/ /g, '-');
    Meteor.call('games.insert', name, slug, logo, image);
    ReactDOM.findDOMNode(this.refs.name).value = '';
    ReactDOM.findDOMNode(this.refs.logo).value = '';
    ReactDOM.findDOMNode(this.refs.image).value = '';
  }
  render() {
    return (
      <form className="teams__form" onSubmit={this.handleSubmit.bind(this)}>
        <div className="teams__field">
          <label>Name</label>
          <input type="text" ref="name" />
        </div>
        <div className="teams__field">
          <label>Logo url</label>
          <input type="text" ref="logo" />
        </div>
        <div className="teams__field">
          <label>Image url</label>
          <input type="text" ref="image" />
        </div>
        <button type="submit" className="btn btn--primary">
          Add
        </button>
      </form>
    );
  }
}
AddGames.PropTypes = {
  currentUser: PropTypes.object
};
export default createContainer(() => {
  Meteor.subscribe('games.all');
  return {
    currentUser: Meteor.user()
  };
}, AddGames);
