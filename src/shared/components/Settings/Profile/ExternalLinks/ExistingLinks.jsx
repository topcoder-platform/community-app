/**
 * Renders 'Linked Accounts' section.
 */
import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';

import { PrimaryButton, GhostButton } from 'topcoder-react-ui-kit';

import Modal from 'components/Modal';
import ExistingLink from './ExistingLink';

import Styles from './styles.scss';

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
    const {
      deleteWebLink,
      handle,
      profile,
      tokenV3,
      unlinkExternalAccount,
    } = this.props;

    const { linkToConfirmDelete } = this.state;

    if (!linkToConfirmDelete || linkToConfirmDelete.deleting) {
      return;
    }
    this.setState({ linkToConfirmDelete: null });

    if (linkToConfirmDelete.providerType === 'weblink') {
      deleteWebLink(handle, tokenV3, linkToConfirmDelete);
    } else {
      unlinkExternalAccount(
        profile,
        tokenV3,
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
          linkToConfirmDelete
          && (
            <Modal theme={{ container: Styles['deletion-confirmation-modal'] }}>
              <div styleName="deletion-confirmation-container">
                <div styleName="deletion-confirmation">
                  <div styleName="deletion-confirmation-title">
Heads Up!
                  </div>
                  <div styleName="deletion-confirmation-message">
Are you sure you want to delete the external link
                    <span styleName="deletion-confirmation-account-title">
&quot;
                      {linkToConfirmDelete.providerType === 'weblink' ? linkToConfirmDelete.URL : linkToConfirmDelete.providerType}
&quot;
                    </span>
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
            _.map(allLinks, link => (
              <ExistingLink
                key={`${link.providerType}${link.key}`}
                link={link}
                supportedAccounts={supportedAccounts}
                onConfirmDeleteLink={this.onConfirmDeleteLink}
              />
            ))
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
