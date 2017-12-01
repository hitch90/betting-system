import React, { Component } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import { Meteor } from "meteor/meteor";
import { Link } from "react-router-dom";

import { createContainer } from "meteor/react-meteor-data";
import { Bets } from "../../api/bets.js";

import BetsView from "./Bets.jsx";

class ProfileComponent extends Component {
  state = {
    editMode: false,
    activeTab: 2
  };
  setValue(field, value) {
    if (field === "email")
      Meteor.users.update(Meteor.userId(), {
        $set: { "profile.email": value }
      });
    if (field === "name")
      Meteor.users.update(Meteor.userId(), { $set: { "profile.name": value } });
    if (field === "address")
      Meteor.users.update(Meteor.userId(), {
        $set: { "profile.address": value }
      });
    if (field === "city")
      Meteor.users.update(Meteor.userId(), {
        $set: { "profile.city": value }
      });
  }
  setTokens() {
    if (this.props.user) {
      if (this.props.user.profile) {
        if (this.props.user.profile.tokens == 0) {
          return;
        }
        if (!this.props.user.profile.tokens) {
          this.updateTokens();
        }
      } else {
        this.updateTokens();
      }
    }
  }
  updateTokens() {
    Meteor.users.update(Meteor.userId(), {
      $set: { "profile.tokens": 10000 }
    });
  }
  displayName(user) {
    if (user) {
      return <h2 className="typo__h1 typo__h1--username">{user.username}</h2>;
    }
    return;
  }
  toggleEditMode(user) {
    if (user) {
      return (
        this.props.user._id == Meteor.userId() && (
          <li className={`${this.state.activeTab === 1 ? "active" : ""}`}>
            <a
              href="#"
              onClick={event => {
                event.preventDefault();
                this.setState({ editMode: true, activeTab: 1 });
              }}
            >
              Edit profile
            </a>
          </li>
        )
      );
    }
    return;
  }
  displayField(user, field) {
    const noFieldFound = <div>No field found</div>;
    if (user) {
      if (user.profile) {
        return (
          <span className={`account__value account__value--${field}`}>
            {user.profile[field]}
          </span>
        );
        if (user.profile.email) {
          return <span className="account__value">{user.profile[field]}</span>;
        }
        return noFieldFound;
      }
      return noFieldFound;
    }
    return noFieldFound;
  }
  render() {
    this.setTokens();
    return (
      <div className="account">
        <div className="account__userDetails">
          <div className="account__userHeader">
            <div className="account__avatar" />
            <div className="account__mainData">
              {this.displayName(this.props.user)}
              <div className="account__tokens btn btn--secondary">
                Tokens: {this.displayField(this.props.user, "tokens")}
              </div>
              <a href="/prize">
                Prize <i className="fa fa-arrow-right" />
              </a>
            </div>
          </div>
          <div className="account__fields">
            <div className="account__field">
              Email: {this.displayField(this.props.user, "email")}
            </div>
            <div className="account__field">
              Name: {this.displayField(this.props.user, "name")}
            </div>
            <div className="account__field">
              Address:
              {this.displayField(this.props.user, "city")}
              {this.displayField(this.props.user, "address")}
            </div>
          </div>
        </div>
        <div className="account__content">
          <ul className="account__tabs">
            <li className={`${this.state.activeTab === 2 ? "active" : ""}`}>
              <a
                href="#"
                onClick={event => {
                  event.preventDefault();
                  this.setState({ activeTab: 2 });
                }}
              >
                Active bets
              </a>
            </li>
            <li className={`${this.state.activeTab === 3 ? "active" : ""}`}>
              <a
                href="#"
                onClick={event => {
                  event.preventDefault();
                  this.setState({ activeTab: 3 });
                }}
              >
                Bet history
              </a>
            </li>
            {this.toggleEditMode(this.props.user)}
          </ul>
          <div
            className={`account__tabContent ${
              this.state.activeTab === 2 ? "active" : ""
            }`}
          >
            <ul className="account__bets">
              {this.props.bets.map(
                bet =>
                  !bet.complete && (
                    <li key={bet._id} className="account__bet">
                      <span className="account__pool">{bet.stake}</span>
                      <BetsView
                        id={bet._id}
                        match={bet.matchId}
                        choice={bet.userchoice}
                      />
                    </li>
                  )
              )}
            </ul>
          </div>
          <div
            className={`account__tabContent ${
              this.state.activeTab === 3 ? "active" : ""
            }`}
          >
            <ul>
              {this.props.bets.map(
                bet =>
                  bet.complete && (
                    <li key={bet._id} className="account__bet complete">
                      <span className="account__pool">{bet.stake}</span>
                      <BetsView
                        id={bet._id}
                        match={bet.matchId}
                        choice={bet.userchoice}
                      />
                    </li>
                  )
              )}
            </ul>
          </div>
          <div
            className={`account__tabContent ${
              this.state.activeTab === 1 ? "active" : ""
            }`}
          >
            <div className="account__form">
              <div className="account__formField">
                <label>Address e-mail</label>
                <input
                  type="email"
                  onChange={event => this.setValue("email", event.target.value)}
                />
              </div>
              <div className="account__formField">
                <label>Your name</label>
                <input
                  type="text"
                  onChange={event => this.setValue("name", event.target.value)}
                />
              </div>
              <div className="account__formField">
                <label>City & Postcode</label>
                <input
                  type="text"
                  onChange={event => this.setValue("city", event.target.value)}
                />
              </div>
              <div className="account__formField">
                <label>Address</label>
                <input
                  type="text"
                  onChange={event =>
                    this.setValue("address", event.target.value)
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ProfileComponent.PropTypes = {
  user: PropTypes.object
};

export default createContainer(() => {
  Meteor.subscribe("bets.all");
  return {
    user: Meteor.users.findOne(Meteor.userId()),
    bets: Bets.find({ userId: Meteor.userId() }).fetch()
  };
}, ProfileComponent);
