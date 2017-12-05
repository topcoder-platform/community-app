import React from 'react';
import PT from 'prop-types';
import { themr } from 'react-css-super-themr';
import { Link } from 'utils/router';

import JoinCommunity from 'containers/tc-communities/JoinCommunity';

import defaultStyle from './style.scss';
import joinButtonStyle from '../../themes/joinButtonBlue.scss';

function QuickLinks({ theme, education, challenges, buttonText, title }) {
  const educationLinks = education.map(({ url, text }) => (
    <li className={theme.educationItem} key={url}>
      <Link
        className={theme.educationLink}
        to={url}
        openNewTab
        key={text}
      >{text}</Link>
    </li>
  ));

  const challengeLinks = challenges.map(({ name, id }) => (
    <li className={theme.challengeItem} key={id}>
      <Link
        className={theme.challengeLink}
        to={`challenges/${id}/`}
        key={name}
        openNewTab
      >{name}</Link>
    </li>
  ));

  return (
    <div className={theme.container}>
      <img className={theme.icon} src="/community-app-assets/themes/cognitive/home/quicklinks-icon.png" alt="" />
      <h1 className={theme.title}>{title}</h1>
      <div className={theme.linksContainer}>
        <ul className={theme.educationList}>
          <h2>Education</h2>
          {educationLinks}
        </ul>
        <ul className={theme.educationList}>
          <h2>Challenges</h2>
          {challengeLinks}
        </ul>
      </div>
      <JoinCommunity
        theme={{ link: joinButtonStyle }}
        label={buttonText}
      />
    </div>
  );
}

QuickLinks.defaultProps = {
};

QuickLinks.propTypes = {
  theme: PT.shape({
    container: PT.string.isRequired,
    icon: PT.string.isRequired,
    title: PT.string.isRequired,
    button: PT.string.isRequired,
    disabled: PT.string,
    linksContainer: PT.string.isRequired,
    educationList: PT.string.isRequired,
    educationItem: PT.string.isRequired,
    educationLink: PT.string.isRequired,
    challengeList: PT.string.isRequired,
    challengeItem: PT.string.isRequired,
    challengeLink: PT.string.isRequired,
  }).isRequired,
  education: PT.arrayOf(PT.shape({
    text: PT.string.isRequired,
    url: PT.string.isRequired,
  })).isRequired,
  challenges: PT.arrayOf(PT.shape({
    name: PT.string.isRequired,
    id: PT.number.isRequired,
  })).isRequired,
  buttonText: PT.string.isRequired,
  title: PT.string.isRequired,
};

export default themr('QuickLinks', defaultStyle)(QuickLinks);
