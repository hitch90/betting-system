import React, { Component } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import { Meteor } from "meteor/meteor";
import { Router, Route, IndexRoute } from "react-router";
import createBrowserHistory from "history/createBrowserHistory";
import { createContainer } from "meteor/react-meteor-data";

import { Accounts, STATES } from "meteor/std:accounts-ui";

import Homepage from "./homepage/Wrapper.jsx";
import Teams from "./teams/Teams.jsx";
import Team from "./teams/Team.jsx";
import Matches from "./matches/Matches.jsx";
import Match from "./matches/Match.jsx";
import AddMatch from "./matches/Add.jsx";
import Games from "./games/Games.jsx";
import Game from "./games/Game.jsx";
import Events from "./events/Events.jsx";
import Event from "./events/Event.jsx";
import Navs from "./Nav.jsx";
import Profile from "./user/Profile.jsx";

const browserHistory = createBrowserHistory();
class renderRoutes extends Component {
  render() {
    return (
      <Router history={browserHistory}>
        <div>
          <Navs />
          <main className="wrapper">
            <Route exact path="/" component={Homepage} />
            <Route path="/teams" component={Teams} />
            <Route path="/team/:id" component={Team} />
            <Route path="/matches" component={Matches} />
            <Route path="/match/add" component={AddMatch} />
            <Route path="/match/:id" component={Match} />
            <Route path="/games" component={Games} />
            <Route path="/game/:slug" component={Game} />
            <Route path="/events/" component={Events} />
            <Route path="/event/:slug" component={Event} />
            <Route
              path="/signin"
              component={() => (
                <Accounts.ui.LoginForm
                  loginPath={"/signin"}
                  signUpPath={"/signup"}
                  resetPasswordPath={"/reset-password"}
                  profilePath={"/profile"}
                  onSignedInHook={() => {
                    window.location = "/profile";
                  }}
                />
              )}
            />
            <Route
              path="/signup"
              component={() => (
                <Accounts.ui.LoginForm
                  loginPath={"/signin"}
                  signUpPath={"/signup"}
                  resetPasswordPath={"/reset-password"}
                  profilePath={"/profile"}
                  onPostSignUpHook={() => {
                    window.location = "/profile";
                  }}
                  formState={STATES.SIGN_UP}
                />
              )}
            />
            <Route path="/profile" component={Profile} />
          </main>
        </div>
      </Router>
    );
  }
}

renderRoutes.PropTypes = {
  currentUser: PropTypes.object
};

export default createContainer(() => {
  return {
    currentUser: Meteor.user()
  };
}, renderRoutes);
