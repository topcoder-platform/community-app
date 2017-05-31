/* global
  fetch
*/

import config from 'utils/config';
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

    // TODO: We should use api service instead!
    const BASE_URL = props.API_URL_V3;

    const CHALLENGES_API = `${BASE_URL}/challenges/`;
    const fetchUserProfile = (handle) => {
      const url = `${BASE_URL}/users/${handle}`;
      return fetch(url).then(res => res.json());
    };
    // Fetches a sample user profile to show in User Avatar Tooltips.
    // Effective loading of all winner profiles for all challenges is
    // somewhat out of the scope of the current challenge.
    fetchUserProfile('Sky_').then(profile => this.setState({ sampleUserProfile: profile }));

    fetch(`${CHALLENGES_API}?filter=track%3Ddevelop`, { method: 'GET', mode: 'cors' })
    .then((response) => {
      response.json().then((json) => {
        that.setState({
          activeDevelopChallenges: json.result.content.filter(challenge => challenge.status === 'ACTIVE').slice(0, 15),
          pastDevelopChallenges: json.result.content.filter(challenge => challenge.status === 'COMPLETED').slice(0, 15),
        });
      });
    });
    fetch(`${CHALLENGES_API}?filter=track%3Ddesign`, { method: 'GET', mode: 'cors' })
    .then((response) => {
      response.json().then((json) => {
        that.setState({
          activeDesignChallenges: json.result.content.filter(challenge => challenge.status === 'ACTIVE').slice(0, 15),
          pastDesignChallenges: json.result.content.filter(challenge => challenge.status === 'COMPLETED').slice(0, 15),
        });
      });
    });
     // fetch marathon match
    fetch(`${BASE_URL}/marathonMatches/`, { method: 'GET', mode: 'cors' })
    .then((response) => {
      response.json().then((json) => {
        that.setState({
          activeMarathonMatchChallenges: json.result.content,
        });
      });
    });
  }

  render() {
    const ActiveDevelopChallengeCards = this.state.activeDevelopChallenges.map((challenge) => {
      const c = challenge;
      return (
        <ChallengeCard
          key={c.id}
          challenge={c}
          sampleWinnerProfile={this.state.sampleUserProfile}
        />);
    });

    const PastDevelopChallengeCards = this.state.pastDevelopChallenges.map((challenge) => {
      const c = challenge;
      return (
        <ChallengeCard
          key={c.id}
          challenge={c}
          sampleWinnerProfile={this.state.sampleUserProfile}
        />
      );
    });

    const ActiveDesignChallengeCards = this.state.activeDesignChallenges.map((challenge) => {
      const c = challenge;
      return (
        <ChallengeCard
          key={c.id}
          challenge={c}
          sampleWinnerProfile={this.state.sampleUserProfile}
        />
      );
    });

    const PastDesignChallengeCards = this.state.pastDesignChallenges.map((challenge) => {
      const c = challenge;
      return (
        <ChallengeCard
          key={c.id}
          challenge={c}
          sampleWinnerProfile={this.state.sampleUserProfile}
        />
      );
    });

    // marathon match
    const ActiveMarathonMatchChallengeCards = this.state
      .activeMarathonMatchChallenges.map((challenge) => {
        const c = challenge;
        c.challengeId = c.rounds.id;
        c.technologies = '';
        c.prize = c.prizes;
        c.submissionEndDate = c.endDate;
        c.totalPrize = 0;
        c.challengeName = c.name;
        c.numRegistrants = c.numRegistrants;
        c.numSubmissions = c.numSubmissions;
        c.registrationStartDate = c.startDate;
        c.currentPhaseEndDate = c.endDate;
        c.allPhases = [];
        return (
          <ChallengeCard
            key={c.id}
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
  API_URL_V3: PT.string,
};

ChallengeCardExamples.defaultProps = {
  API_URL_V3: config.API.V3,
};

module.exports = ChallengeCardExamples;
