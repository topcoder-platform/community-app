/**
 * Renders 'Existing Links' section.
 */
/* eslint-disable no-unused-vars */
import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';

import ConsentComponent from 'components/Settings/ConsentComponent';
import { Modal, PrimaryButton, GhostButton } from 'topcoder-react-ui-kit';

import ExistingLink from './ExistingLink';

import Styles from './styles.scss';
import modal from './modal.scss';

export default class ExistingLinks extends ConsentComponent {
  constructor(props) {
    super(props);
    this.state = {
      linkToConfirmDelete: null,
    };
    this.onHandleConfirmDeleteLink = this.onHandleConfirmDeleteLink.bind(this);
    this.onConfirmDeleteLink = this.onConfirmDeleteLink.bind(this);
    this.onDeleteLink = this.onDeleteLink.bind(this);
  }

  onHandleConfirmDeleteLink(e, link) {
    e.preventDefault();
    e.stopPropagation();
    this.showConsent(this.onConfirmDeleteLink.bind(this, link));
  }

  // Confirm delete link function
  onConfirmDeleteLink(link) {
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
      <div styleName="Styles.existing-links">
        {
          this.shouldRenderConsent() && this.renderConsent()
        }
        {
          linkToConfirmDelete
          && (
            <Modal theme={modal}>
              <div styleName="modal.deletion-confirmation-container">
                <div styleName="modal.deletion-confirmation">
                  <div styleName="modal.deletion-confirmation-title">
                    DELETE CONFIRMATION
                  </div>
                  <div styleName="modal.deletion-confirmation-message">
                    Are you sure you want to delete the external link
                    <span styleName="modal.deletion-confirmation-account-title">
                      &quot;
                      {linkToConfirmDelete.providerType === 'weblink' ? linkToConfirmDelete.URL : linkToConfirmDelete.providerType}
                      &quot;
                    </span>
                    ? This action can&apos;t be undone later.
                  </div>
                  <div styleName="modal.deletion-confirmation-buttons">
                    <div styleName="modal.deletion-confirmation-button-yes">
                      <GhostButton onClick={this.onDeleteLink}>
                        Yes, Delete Link
                      </GhostButton>
                    </div>
                    <div styleName="modal.deletion-confirmation-button-no">
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
        <div styleName="Styles.external-link-list">
          {
            _.map(allLinks, link => (
              <ExistingLink
                key={`${link.providerType}${link.key}`}
                link={link}
                supportedAccounts={supportedAccounts}
                onConfirmDeleteLink={this.onHandleConfirmDeleteLink}
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
