/**
 * Renders 'Linked Accounts' section.
 */
/* global window */
/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';

import { PrimaryButton, GhostButton } from 'topcoder-react-ui-kit';

import Modal from 'components/Modal';

import Styles from './styles.scss';

function urlProtocol(link) {
  if (!link) {
    return link;
  }
  let result;
  const startingUrl = 'http://';
  const httpsStartingUrl = 'https://';
  if (link.indexOf(startingUrl) === 0 || link.indexOf(httpsStartingUrl) === 0) {
    result = link;
  } else {
    result = startingUrl + link;
  }
  return result;
}

// Open link function
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
    window.open(urlProtocol(url), '_blank');
  }
}

export default class ExistingLinks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      linkToConfirmDelete: null,
    };
    this.onConfirmDeleteLink = this.onConfirmDeleteLink.bind(this);
    this.onDeleteLink = this.onDeleteLink.bind(this);
  }

  // Confirm delete link function
  onConfirmDeleteLink(e, link) {
    e.preventDefault();
    e.stopPropagation();
    if (!link || link.deleting) {
      return;
    }
    this.setState({ linkToConfirmDelete: link });
  }

  // Delete link function
  onDeleteLink(e) {
    e.preventDefault();
    e.stopPropagation();

    const { linkToConfirmDelete } = this.state;

    if (!linkToConfirmDelete || linkToConfirmDelete.deleting) {
      return;
    }
    this.setState({ linkToConfirmDelete: null });

    if (linkToConfirmDelete.providerType === 'weblink') {
      this.props.deleteWebLink(this.props.handle, this.props.tokenV3, linkToConfirmDelete);
    } else {
      this.props.unlinkExternalAccount(
        this.props.profile,
        this.props.tokenV3,
        linkToConfirmDelete.providerType,
      );
    }
  }

  render() {
    const {
      allLinks,
      supportedAccounts,
    } = this.props;

    const { linkToConfirmDelete } = this.state;

    return (
      <div styleName="existing-links">
        {
          linkToConfirmDelete &&
          (
            <Modal theme={{ container: Styles['deletion-confirmation-modal'] }}>
              <div styleName="deletion-confirmation-container">
                <div styleName="deletion-confirmation">
                  <div styleName="deletion-confirmation-title">Heads Up!</div>
                  <div styleName="deletion-confirmation-message">Are you sure you want to delete the external link
                    <span styleName="deletion-confirmation-account-title">&quot;{linkToConfirmDelete.providerType === 'weblink' ? linkToConfirmDelete.URL : linkToConfirmDelete.providerType}&quot;</span>
                    ? This action can&apos;t be undone later.
                  </div>
                  <div styleName="deletion-confirmation-buttons">
                    <div styleName="deletion-confirmation-button-yes">
                      <GhostButton onClick={this.onDeleteLink}>
                        Yes, Delete Link
                      </GhostButton>
                    </div>
                    <div styleName="deletion-confirmation-button-no">
                      <PrimaryButton onClick={() => this.setState({ linkToConfirmDelete: null })}>
                        Cancel
                      </PrimaryButton>
                    </div>
                  </div>
                </div>
              </div>
            </Modal>
          )
        }
        <div styleName="external-link-list">
          {
            _.map(allLinks, (link) => {
              const pending = link.status === 'pending';
              const logoClass = _.result(_.find(supportedAccounts, a => a.providerType === link.providerType), 'className') || 'fa-globe';
              return (
                <div role="link" key={`${link.providerType}${link.key}`} styleName={`external-link-tile ${pending ? 'external-link-tile--pending' : ''}`} onClick={e => openLink(e, link)} >
                  <div styleName="top">
                    <div styleName="ext-link-tile_edit-header">
                      <div role="button" onClick={e => this.onConfirmDeleteLink(e, link)} styleName={`ext-link-tile_edit-header_delete ${link.deleting ? 'ext-link-tile_edit-header_delete--disabled' : ''}`} prevent-event-propagation="true" />
                    </div>
                    <div styleName="logo"><i styleName={logoClass} className={`fa ${logoClass}`} /></div>
                    <h2>{link.providerType}</h2>
                  </div>
                  <div styleName="bottom">
                    {
                      link.deleting &&
                      (
                        <div styleName="section-loading" />
                      )
                    }
                    {
                      !link.deleting && link.providerType === 'weblink' &&
                      (
                        <div>
                          <p data-ellipsis="" className={pending ? 'hidden' : ''} styleName="link-title">{link.title}</p>
                          <p className={!pending ? 'hidden' : ''} styleName="link-title">Loading data. This will take a few minutes.</p>
                          <a styleName="link-url" id="link-url" href={urlProtocol(link.URL)} target="_blank" prevent-event-propagation="true">{urlProtocol(link.URL)}</a>
                        </div>
                      )
                    }
                    {
                      !link.deleting && link.providerType === 'linkedin' &&
                      (
                        <div>
                          <div styleName="handle">{link.data.handle}</div>
                          <div styleName="title">{link.data.title}</div>
                        </div>
                      )
                    }
                    {
                      !link.deleting && link.providerType !== 'weblink' && link.providerType !== 'linkedin' &&
                      (
                        <div>
                          <div styleName="handle">{link.data.handle}</div>
                          <div styleName="pending" className={!pending ? 'hidden' : ''}>
                            <p>Loading data. This will take a few minutes.</p>
                          </div>
                          {
                            link.providerType === 'github' &&
                            (
                              <ul className={pending ? 'hidden' : ''}>
                                <li><div styleName="value">{link.data.followers || 0}</div><div styleName="key">followers</div></li>
                                <li><div styleName="value">{link.data.publicRepos || 0}</div><div styleName="key">repositories</div></li>
                              </ul>
                            )
                          }
                          {
                            link.providerType === 'stackoverflow' &&
                            (
                              <ul className={pending ? 'hidden' : ''}>
                                <li><div styleName="value">{link.data.reputation || 0}</div><div styleName="key">reputation</div></li>
                                <li><div styleName="value">{link.data.answers || 0}</div><div styleName="key">answers</div></li>
                              </ul>
                            )
                          }
                          {
                            link.providerType === 'behance' &&
                            (
                              <ul className={pending ? 'hidden' : ''}>
                                <li><div styleName="value">{link.data.projectViews || 0}</div><div styleName="key">views</div></li>
                                <li><div styleName="value">{link.data.projectAppreciations || 0}</div><div styleName="key">likes</div></li>
                              </ul>
                            )
                          }
                          {
                            link.providerType === 'dribbble' &&
                            (
                              <ul className={pending ? 'hidden' : ''}>
                                <li><div styleName="value">{link.data.followers || 0}</div><div styleName="key">followers</div></li>
                                <li><div styleName="value">{link.data.likes || 0}</div><div styleName="key">likes</div></li>
                              </ul>
                            )
                          }
                          {
                            link.providerType === 'bitbucket' &&
                            (
                              <ul className={pending ? 'hidden' : ''}>
                                <li><div styleName="value">{link.data.followers || 0}</div><div styleName="key">followers</div></li>
                                <li><div styleName="value">{link.data.repos || 0}</div><div styleName="key">repositories</div></li>
                              </ul>
                            )
                          }
                          {
                            link.providerType === 'twitter' &&
                            (
                              <ul className={pending ? 'hidden' : ''}>
                                <li><div styleName="value">{link.data.noOfTweets || 0}</div><div styleName="key">tweets</div></li>
                                <li><div styleName="value">TBD</div><div styleName="key">followers</div></li>
                              </ul>
                            )
                          }
                        </div>
                      )
                    }
                  </div>
                </div>
              );
            })
          }
        </div>
      </div>
    );
  }
}

ExistingLinks.propTypes = {
  handle: PT.string.isRequired,
  tokenV3: PT.string.isRequired,
  profile: PT.shape().isRequired,
  allLinks: PT.arrayOf(PT.shape()).isRequired,
  supportedAccounts: PT.arrayOf(PT.shape()).isRequired,
  deleteWebLink: PT.func.isRequired,
  unlinkExternalAccount: PT.func.isRequired,
};
