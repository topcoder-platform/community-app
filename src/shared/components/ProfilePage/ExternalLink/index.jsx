/**
 * ExternalLink Component.  Displays an external account/link with icon and stats.
 */
import React from 'react';
import PT from 'prop-types';
import { isWebUri } from 'valid-url';

import FallbackIcon from 'assets/images/profile/skills/id-develop.svg';
import GithubIcon from 'assets/images/profile/links/github.svg';
import LinkedinIcon from 'assets/images/profile/links/linkedin.svg';
import StackoverflowIcon from 'assets/images/profile/links/stackoverflow.png';
import TwitterIcon from 'assets/images/profile/links/twitter.svg';

import './styles.scss';

export const dataMap = [
  { provider: 'dribbble', displayName: 'Dribbble' },
  { provider: 'linkedin', displayName: 'LinkedIn' },
  { provider: 'stackoverflow', displayName: 'Stack Overflow' },
  { provider: 'behance', displayName: 'Behance' },
  { provider: 'github', displayName: 'Github' },
  { provider: 'bitbucket', displayName: 'Bitbucket' },
  { provider: 'twitter', displayName: 'Twitter' },
  { provider: 'weblink', displayName: 'Web Links' },
];

const ExternalLink = ({ data, type }) => {
  const found = dataMap.find(({ provider }) => provider === type);
  if (!found) {
    return <div />;
  }

  let url = data ? data.profileURL || data.URL : null;
  if (url && !isWebUri(url)) {
    url = `http://${url}`;
    if (!isWebUri(url)) {
      url = null;
    }
  }

  return (
    <a styleName="container" href={url || '#'} target="_blank" rel="noopener noreferrer">
      <div styleName="top">
        <div styleName="logo">
          { type === 'dribbble' && <FallbackIcon /> }
          { type === 'linkedin' && <LinkedinIcon /> }
          { type === 'stackoverflow' && <img src={StackoverflowIcon} alt="Stack Overflow Logo" /> }
          { type === 'behance' && <FallbackIcon /> }
          { type === 'github' && <GithubIcon /> }
          { type === 'bitbucket' && <FallbackIcon /> }
          { type === 'twitter' && <TwitterIcon /> }
          { type === 'weblink' && <FallbackIcon /> }
        </div>
        <h2>
          {found.displayName}
        </h2>
      </div>
      <div styleName="bottom">
        {
          type === 'github' && data !== null
          && (
          <div>
            <div styleName="handle">
              {data.handle}
            </div>
            <ul>
              <li>
                <div styleName="value">
                  {data.followers || 0}
                </div>
                <div styleName="key">
followers
                </div>
              </li>
              <li>
                <div styleName="value">
                  {data.publicRepos || 0}
                </div>
                <div styleName="key">
repositories
                </div>
              </li>
            </ul>
          </div>
          )
        }
        {
          type === 'stackoverflow' && data !== null
          && (
          <div>
            <div styleName="handle">
              {data.name}
            </div>
            <ul>
              <li>
                <div styleName="value">
                  {data.reputation || 0}
                </div>
                <div styleName="key">
reputation
                </div>
              </li>
              <li>
                <div styleName="value">
                  {data.answers || 0}
                </div>
                <div styleName="key">
answers
                </div>
              </li>
            </ul>
          </div>
          )
        }
        {
          type === 'behance' && data !== null
          && (
          <div>
            <div styleName="handle">
              {data.name}
            </div>
            <ul>
              <li>
                <div styleName="value">
                  {data.projectViews || 0}
                </div>
                <div styleName="key">
views
                </div>
              </li>
              <li>
                <div styleName="value">
                  {data.projectAppreciations || 0}
                </div>
                <div styleName="key">
likes
                </div>
              </li>
            </ul>
          </div>
          )
        }
        {
          type === 'behance' && data !== null
          && (
          <div>
            <div styleName="handle">
              {data.name}
            </div>
            <ul>
              <li>
                <div styleName="value">
                  {data.projectViews || 0}
                </div>
                <div styleName="key">
views
                </div>
              </li>
              <li>
                <div styleName="value">
                  {data.projectAppreciations || 0}
                </div>
                <div styleName="key">
likes
                </div>
              </li>
            </ul>
          </div>
          )
        }
        {
          type === 'dribbble' && data !== null
          && (
          <div>
            <div styleName="handle">
              {data.handle}
            </div>
            <ul>
              <li>
                <div styleName="value">
                  {data.followers || 0}
                </div>
                <div styleName="key">
followers
                </div>
              </li>
              <li>
                <div styleName="value">
                  {data.likes || 0}
                </div>
                <div styleName="key">
likes
                </div>
              </li>
            </ul>
          </div>
          )
        }
        {
          type === 'bitbucket' && data !== null
          && (
          <div>
            <div styleName="handle">
              {data.handle}
            </div>
            <ul>
              <li>
                <div styleName="value">
                  {data.followers || 0}
                </div>
                <div styleName="key">
followers
                </div>
              </li>
              <li>
                <div styleName="value">
                  {data.repos || 0}
                </div>
                <div styleName="key">
repositories
                </div>
              </li>
            </ul>
          </div>
          )
        }
        {
          type === 'twitter' && data !== null
          && (
          <div>
            <div styleName="handle">
              {data.handle}
            </div>
            <ul>
              <li>
                <div styleName="value">
                  {data.tweets || 0}
                </div>
                <div styleName="key">
tweets
                </div>
              </li>
              <li>
                <div styleName="value">
TBD
                </div>
                <div styleName="key">
followers
                </div>
              </li>
            </ul>
          </div>
          )
        }
        {
          type === 'linkedin' && data !== null
          && (
          <div>
            <div styleName="handle">
              {data.name}
            </div>
            <div styleName="title">
              {data.title}
            </div>
          </div>
          )
        }
        {
          type === 'weblink' && data !== null
          && (
          <div>
            <p styleName="link-title">
              {data.title}
            </p>
            <span styleName="link-url">
              {data.URL}
            </span>
          </div>
          )
        }
      </div>
    </a>
  );
};

ExternalLink.propTypes = {
  data: PT.shape().isRequired,
  type: PT.string.isRequired,
};

export default ExternalLink;
