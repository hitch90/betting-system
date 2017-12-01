import React from "react";
import { Link } from "react-router-dom";

export const displayDate = (match, cssClass = "matchList__date") => {
  let parseDate = moment(match.startAt).format("HH:mm, DD.MM.YY");
  const nowDay = moment().format("MMDDYYYY"),
    nowTime = moment().format("HHmm"),
    matchDay = moment(match.startAt).format("MMDDYYYY"),
    matchTime = moment(match.startAt).format("HHmm");
  if (nowDay == matchDay) {
    parseDate = moment(match.startAt).fromNow();
  }
  if (nowDay >= matchDay && nowTime >= matchTime) {
    parseDate = "In progress";
  }
  if (nowDay > matchDay) {
    parseDate = "In progress";
  }
  return <span className={cssClass}>{parseDate}</span>;
};

export const displayWinner = (match, cssClass = "matchList__winner") => {
  if (match.winner) {
    let winner;
    if (match.winner == "x") {
      winner = "Draw";
    }
    if (match.winner == match.firstOpponent._id) {
      winner = match.firstOpponent.name + " wins";
    }
    if (match.winner == match.secondOpponent._id) {
      winner = match.secondOpponent.name + " wins";
    }
    return <span className={cssClass}>{winner}</span>;
  }
  return;
};

export const displayEvent = (match, cssClass = "matchList__event") => {
  if (match.event) {
    return (
      <span className={cssClass}>
        <Link to={`/event/${match.event.slug}`}>{match.event.name}</Link>
      </span>
    );
  }
  return;
};

export const displayLogo = team => {
  if (team.logo) {
    return <img src={team.logo} />;
  }
  return;
};
