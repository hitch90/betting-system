import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { Link } from 'react-router-dom';

import { createContainer } from 'meteor/react-meteor-data';
import AccountsUIWrapper from '../AccountsUIWrapper.jsx';

import { Events } from '../../api/events.js';
import AddEvent from './Add.jsx';

class EventsComponent extends Component {
  render() {
    return (
      <div className="teams">
        {this.props.currentUser && <AddEvent />}
        <ul className="teams__list">
          {this.props.events.map(event => (
            <li key={event._id}>
              <Link to={`/event/${event.slug}`}>{event.name}</Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

EventsComponent.PropTypes = {
  events: PropTypes.array.isRequired,
  currentUser: PropTypes.object
};

export default createContainer(params => {
  Meteor.subscribe('events.all');
  return {
    events: Events.find().fetch(),
    currentUser: Meteor.user()
  };
}, EventsComponent);
