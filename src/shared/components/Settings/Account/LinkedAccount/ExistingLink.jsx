/**
 * Renders an existing link.
 */
/* global window */
/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import _ from 'lodash';

import React from 'react';
import PT from 'prop-types';
import SocialIcons from './SocialIcons';

import './styles.scss';

/**
 * Prepend http protocol to url link if not already exist.
 * @param {String} link The url link
 * @returns {String} url link with http protocol prepend
 */
function prependProtocol(link) {
  if (!link) {
    return link;
  }
  const httpProtocol = 'http://';
  const httpsProtocol = 'https://';
  if (link.startsWith(httpProtocol) || link.startsWith(httpsProtocol)) {
    return link;
  }
  return httpProtocol + link;
}

/**
 * Open user's external link (like github profile page) in new tab
 * @param {Event} e The click event
 * @param {Object} user's external link
 */
function openLink(e, link) {
  if (!link || link.status === 'pending') {
    return;
  }

  if (e.target.id === 'link-url') {
    return;
  }

  let url = null;
  if (link.data && link.data.profileURL) {
    url = link.data.profileURL;
  } else if (link.URL) {
    url = link.URL;
  }

  if (url) {
    window.open(prependProtocol(url), '_blank');
  }
}

export default function ExistingLink(props) {
  const { link, supportedAccounts, onConfirmDeleteLink } = props;

  const pending = link.status === 'pending';
  const logoClass = _.result(_.find(supportedAccounts, a => a.providerType === link.providerType), 'className') || 'fa-globe';

  return (
    <div role="link" styleName={`external-link-tile ${pending ? 'external-link-tile--pending' : ''}`} onClick={e => openLink(e, link)}>
      <div styleName="top">
        <div styleName="ext-link-tile_edit-header">
          <div role="button" onClick={e => onConfirmDeleteLink(e, link)} styleName={`ext-link-tile_edit-header_delete ${link.deleting ? 'ext-link-tile_edit-header_delete--disabled' : ''}`} prevent-event-propagation="true" />
        </div>
        <div styleName="logo">
          { link.providerType === 'weblink'
            ? <i styleName={logoClass} className={`fa ${logoClass}`} />
            : <img src={SocialIcons[link.providerType]} alt="icon" />
          }
        </div>
        <h2>
          {link.providerType}
        </h2>
      </div>
      <div styleName="bottom">
        {
          link.deleting
          && (
            <div styleName="section-loading" />
          )
        }
        {
          !link.deleting && link.providerType === 'weblink'
          && (
            <div>
              <p data-ellipsis="" className={pending ? 'hidden' : ''} styleName="link-title">
                {link.title}
              </p>
              <p className={!pending ? 'hidden' : ''} styleName="link-title">
Loading data. This will take a few minutes.
              </p>
              <a styleName="link-url" id="link-url" href={prependProtocol(link.URL)} target="_blank" rel="noopener noreferrer" prevent-event-propagation="true">
                {prependProtocol(link.URL)}
              </a>
            </div>
          )
        }
        {
          !link.deleting && link.providerType === 'linkedin'
          && (
            <div>
              <div styleName="handle">
                {link.data.handle}
              </div>
              <div styleName="title">
                {link.data.title}
              </div>
            </div>
          )
        }
        {
          !link.deleting && link.providerType !== 'weblink' && link.providerType !== 'linkedin'
          && (
            <div>
              <div styleName="handle">
                {link.data.handle}
              </div>
              <div styleName="pending" className={!pending ? 'hidden' : ''}>
                <p>
Loading data. This will take a few minutes.
                </p>
              </div>
              {
                link.providerType === 'github'
                && (
                  <ul className={pending ? 'hidden' : ''}>
                    <li>
                      <div styleName="value">
                        {link.data.followers || 0}
                      </div>
                      <div styleName="key">
followers
                      </div>
                    </li>
                    <li>
                      <div styleName="value">
                        {link.data.publicRepos || 0}
                      </div>
                      <div styleName="key">
repositories
                      </div>
                    </li>
                  </ul>
                )
              }
              {
                link.providerType === 'stackoverflow'
                && (
                  <ul className={pending ? 'hidden' : ''}>
                    <li>
                      <div styleName="value">
                        {link.data.reputation || 0}
                      </div>
                      <div styleName="key">
reputation
                      </div>
                    </li>
                    <li>
                      <div styleName="value">
                        {link.data.answers || 0}
                      </div>
                      <div styleName="key">
answers
                      </div>
                    </li>
                  </ul>
                )
              }
              {
                link.providerType === 'behance'
                && (
                  <ul className={pending ? 'hidden' : ''}>
                    <li>
                      <div styleName="value">
                        {link.data.projectViews || 0}
                      </div>
                      <div styleName="key">
views
                      </div>
                    </li>
                    <li>
                      <div styleName="value">
                        {link.data.projectAppreciations || 0}
                      </div>
                      <div styleName="key">
likes
                      </div>
                    </li>
                  </ul>
                )
              }
              {
                link.providerType === 'dribbble'
                && (
                  <ul className={pending ? 'hidden' : ''}>
                    <li>
                      <div styleName="value">
                        {link.data.followers || 0}
                      </div>
                      <div styleName="key">
followers
                      </div>
                    </li>
                    <li>
                      <div styleName="value">
                        {link.data.likes || 0}
                      </div>
                      <div styleName="key">
likes
                      </div>
                    </li>
                  </ul>
                )
              }
              {
                link.providerType === 'bitbucket'
                && (
                  <ul className={pending ? 'hidden' : ''}>
                    <li>
                      <div styleName="value">
                        {link.data.followers || 0}
                      </div>
                      <div styleName="key">
followers
                      </div>
                    </li>
                    <li>
                      <div styleName="value">
                        {link.data.repos || 0}
                      </div>
                      <div styleName="key">
repositories
                      </div>
                    </li>
                  </ul>
                )
              }
              {
                link.providerType === 'twitter'
                && (
                  <ul className={pending ? 'hidden' : ''}>
                    <li>
                      <div styleName="value">
                        {link.data.noOfTweets || 0}
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
                )
              }
            </div>
          )
        }
      </div>
    </div>
  );
}

ExistingLink.propTypes = {
  link: PT.shape().isRequired,
  supportedAccounts: PT.arrayOf(PT.shape()).isRequired,
  onConfirmDeleteLink: PT.func.isRequired,
};
