/* global
  fetch
*/

import React from 'react';
import PT from 'prop-types';
import ChallengeCard from './ChallengeCard';
import './ChallengeCardExamples.scss';


class ChallengeCardExamples extends React.Component {
  constructor(props) {
    super();
    this.state = {
      activeDevelopChallenges: [],
      pastDevelopChallenges: [],
      activeDesignChallenges: [],
      pastDesignChallenges: [],
      activeMarathonMatchChallenges: [],
    };
    const that = this;
    const BASE_URL = props.API_URL_V2;
    const CHALLENGES_API = `${BASE_URL}/challenges/`;
    const fetchUserProfile = (handle) => {
      const url = `${BASE_URL}/users/${handle}`;
      return fetch(url).then(res => res.json());
    };
    // Fetches a sample user profile to show in User Avatar Tooltips.
    // Effective loading of all winner profiles for all challenges is
    // somewhat out of the scope of the current challenge.
    fetchUserProfile('Sky_').then(profile => this.setState({ sampleUserProfile: profile }));

    fetch(`${CHALLENGES_API}active?type=develop`, { method: 'GET', mode: 'cors' })
    .then((response) => {
      response.json().then((json) => {
        that.setState({
          activeDevelopChallenges: json.data.slice(0, 15),
        });
      });
    });
    fetch(`${CHALLENGES_API}past?type=develop`, { method: 'GET', mode: 'cors' })
    .then((response) => {
      response.json().then((json) => {
        that.setState({
          pastDevelopChallenges: json.data.slice(0, 15),
        });
      });
    });
    fetch(`${CHALLENGES_API}active?type=design`, { method: 'GET', mode: 'cors' })
    .then((response) => {
      response.json().then((json) => {
        that.setState({
          activeDesignChallenges: json.data.slice(0, 15),
        });
      });
    });
    fetch(`${CHALLENGES_API}past?type=design`, { method: 'GET', mode: 'cors' })
    .then((response) => {
      response.json().then((json) => {
        that.setState({
          pastDesignChallenges: json.data.slice(0, 15),
        });
      });
    });
     // fetch marathon match
    fetch(`${BASE_URL}/data/marathon/challenges/?listType=active`, { method: 'GET', mode: 'cors' })
    .then((response) => {
      response.json().then((json) => {
        that.setState({
          activeMarathonMatchChallenges: json.data,
        });
      });
    });
  }

  render() {
    const ActiveDevelopChallengeCards = this.state.activeDevelopChallenges.map((challenge) => {
      const c = challenge;

      c.subTrack = c.challengeType.toUpperCase().split(' ').join('_');
      c.track = 'DEVELOP';
      return (
        <ChallengeCard
          key={c.challengeId}
          challenge={c}
          sampleWinnerProfile={this.state.sampleUserProfile}
        />);
    });

    const PastDevelopChallengeCards = this.state.pastDevelopChallenges.map((challenge) => {
      const c = challenge;

      c.subTrack = c.challengeType.toUpperCase().split(' ').join('_');
      c.track = 'DEVELOP';
      return (
        <ChallengeCard
          key={c.challengeId}
          challenge={c}
          sampleWinnerProfile={this.state.sampleUserProfile}
        />
      );
    });

    const ActiveDesignChallengeCards = this.state.activeDesignChallenges.map((challenge) => {
      const c = challenge;

      c.subTrack = c.challengeType.toUpperCase().split(' ').join('_');
      c.track = 'DESIGN';
      return (
        <ChallengeCard
          key={c.challengeId}
          challenge={c}
          sampleWinnerProfile={this.state.sampleUserProfile}
        />
      );
    });

    const PastDesignChallengeCards = this.state.pastDesignChallenges.map((challenge) => {
      const c = challenge;

      c.subTrack = c.challengeType.toUpperCase().split(' ').join('_');
      c.track = 'DESIGN';
      return (
        <ChallengeCard
          key={c.challengeId}
          challenge={c}
          sampleWinnerProfile={this.state.sampleUserProfile}
        />
      );
    });

    // marathon match
    const ActiveMarathonMatchChallengeCards = this.state
      .activeMarathonMatchChallenges.map((challenge) => {
        const c = challenge;

        c.subTrack = 'MARATHON_MATCH';
        c.track = 'DATA_SCIENCE';
        c.challengeId = c.roundId;
        c.technologies = [];
        c.prize = c.prizes;
        c.submissionEndDate = c.endDate;
        c.totalPrize = 0;
        c.challengeName = c.fullName;
        c.numRegistrants = c.numberOfRegistrants;
        c.numSubmissions = c.numberOfSubmissions;
        c.registrationStartDate = c.startDate;
        c.currentPhaseEndDate = c.endDate;
        return (
          <ChallengeCard
            key={c.roundId}
            challenge={c}
            sampleWinnerProfile={this.state.sampleUserProfile}
          />
        );
      });

    return (
      <div className="ChallengeCardExamples wrapper">
        <div className="cards-container">
          <div className="title">Active Develop Challenges</div>
          {ActiveDevelopChallengeCards}
        </div>
        <div className="cards-container">
          <div className="title">Past Develop Challenges</div>
          {PastDevelopChallengeCards}
        </div>
        <div className="cards-container">
          <div className="title">Active Design Challenges</div>
          {ActiveDesignChallengeCards}
        </div>
        <div className="cards-container">
          <div className="title">Past Design Challenges</div>
          {PastDesignChallengeCards}
        </div>
        <div className="cards-container">
          <div className="title">Active Marathon Match Challenges</div>
          {ActiveMarathonMatchChallengeCards}
          <br /><br /><br />
        </div>
      </div>
    );
  }
}

ChallengeCardExamples.propTypes = {
  API_URL_V2: PT.string,
};

ChallengeCardExamples.defaultProps = {
  API_URL_V2: process.env.API_URL_V2,
};

module.exports = ChallengeCardExamples;
