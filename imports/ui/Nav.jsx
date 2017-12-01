import React, { Component } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import { Meteor } from "meteor/meteor";
import { Link } from "react-router-dom";

import { createContainer } from "meteor/react-meteor-data";

class NavComponent extends Component {
  state = {
    open: false
  };
  closeMenu() {
    this.setState({ open: false });
  }
  render() {
    return (
      <nav className="nav">
        <div className="nav__wrapper">
          <div className="nav__logo">
            <h1 className="nav__logoH">
              <Link
                to="/"
                className="nav__link"
                onClick={this.closeMenu.bind(this)}
              >
                .
              </Link>
            </h1>
          </div>
          <a
            className={`hamburger-icon ${this.state.open ? "active" : ""}`}
            onClick={e => {
              e.preventDefault();
              const status = this.state.open ? false : true;
              this.setState({ open: status });
            }}
            href="#"
          >
            <span className="line line-1" />
            <span className="line line-2" />
            <span className="line line-3" />
          </a>
          <ul className={`nav__list ${this.state.open ? "active" : ""}`}>
            {this.props.currentUser &&
              this.props.currentUser.username === "admin" && (
                <li className="nav__item">
                  <Link
                    to="/matches"
                    className="nav__link"
                    onClick={this.closeMenu.bind(this)}
                  >
                    Matches
                  </Link>
                </li>
              )}
            {this.props.currentUser &&
              this.props.currentUser.username === "admin" && (
                <li className="nav__item">
                  <Link
                    to="/teams"
                    className="nav__link"
                    onClick={this.closeMenu.bind(this)}
                  >
                    Teams
                  </Link>
                </li>
              )}
            {this.props.currentUser &&
              this.props.currentUser.username === "admin" && (
                <li className="nav__item">
                  <Link
                    to="/games"
                    className="nav__link"
                    onClick={this.closeMenu.bind(this)}
                  >
                    Games
                  </Link>
                </li>
              )}
            {this.props.currentUser &&
              this.props.currentUser.username === "admin" && (
                <li className="nav__item">
                  <Link
                    to="/events"
                    className="nav__link"
                    onClick={this.closeMenu.bind(this)}
                  >
                    Events
                  </Link>
                </li>
              )}
            {!this.props.currentUser && (
              <li className="nav__item">
                <Link
                  to="/signin"
                  className="nav__link"
                  onClick={this.closeMenu.bind(this)}
                >
                  Sign in
                </Link>
              </li>
            )}
            {!this.props.currentUser && (
              <li className="nav__item">
                <Link
                  to="/signup"
                  className="nav__link nav__link--btn btn btn--primary"
                >
                  Register
                </Link>
              </li>
            )}
            {this.props.currentUser && (
              <li className="nav__item">
                <Link
                  to="/profile"
                  className="nav__link"
                  onClick={this.closeMenu.bind(this)}
                >
                  Profile
                </Link>
              </li>
            )}
            {this.props.currentUser && (
              <li className="nav__item">
                <a
                  href="#"
                  className="nav__link"
                  onClick={event => {
                    event.preventDefault();
                    Meteor.logout();
                    window.location = "/";
                  }}
                >
                  Logout
                </a>
              </li>
            )}
          </ul>
        </div>
      </nav>
    );
  }
}

NavComponent.PropTypes = {
  currentUser: PropTypes.object
};

export default createContainer(() => {
  return {
    currentUser: Meteor.user()
  };
}, NavComponent);
