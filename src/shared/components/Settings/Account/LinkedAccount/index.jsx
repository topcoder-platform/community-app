/**
 * Child component of Settings/Account/LinkedAccount renders
 * "Linked Account" section of account setting page.
 */
/* eslint-disable no-undef */
import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';

import AddWebLink from './AddWebLink';
import LinkAccounts from './LinkAccounts';
import ExistingLinks from './ExistingLinks';

import './styles.scss';

const supportedAccounts = [
  {
    providerType: 'dribbble',
    className: 'fa-dribbble',
    displayName: 'Dribbble',
    disabled: false,
    order: 6,
    colorClass: 'el-dribble',
    featured: true,
  },
  {
    providerType: 'stackoverflow',
    className: 'fa-stack-overflow',
    displayName: 'Stack Overflow',
    disabled: false,
    order: 3,
    colorClass: 'el-stackoverflow',
  },
  {
    providerType: 'github',
    className: 'fa-github',
    displayName: 'Github',
    disabled: false,
    order: 1,
    colorClass: 'el-github',
    featured: true,
  },
  {
    providerType: 'bitbucket',
    className: 'fa-bitbucket',
    displayName: 'Bitbucket',
    disabled: false,
    order: 7,
    colorClass: 'el-bitbucket',
  },
  {
    providerType: 'weblink',
    className: 'fa-globe',
    displayName: 'Web Links',
    disabled: true,
    order: -1,
    colorClass: 'el-weblinks',
  },
];

export default class LinkedAccount extends React.Component {
  constructor(props) {
    super(props);
    this.updatePredicate = this.updatePredicate.bind(this);

    this.state = {
      isMobileView: false,
      screenSM: 767,
    };
  }

  /* Add this to resolve checkbox checked issue when switch mobile to other device */
  componentDidMount() {
    this.updatePredicate();
    window.addEventListener('resize', this.updatePredicate);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updatePredicate);
  }

  updatePredicate() {
    const { screenSM } = this.state;
    this.setState({ isMobileView: window.innerWidth <= screenSM });
  }

  render() {
    const {
      profileState,
      settingsPageState,
      settingsUI,
    } = this.props;

    const { isMobileView } = this.state;

    const tabs = settingsUI.TABS.ACCOUNT;
    const currentTab = settingsUI.currentAccountTab;
    const containerStyle = currentTab === tabs.LINKEDACCOUNT ? '' : 'hide';

    // Construct all links
    const allLinks = [];
    const linkedAccounts = profileState.linkedAccounts || [];
    const externalAccountsData = profileState.externalAccounts || {};

    if (!linkedAccounts.length) {
      const providers = _.omit(externalAccountsData, ['userId', 'updatedAt', 'createdAt', 'createdBy', 'updatedBy']);

      if (_.keys(_.omitBy(providers, _.isNil)).length > 1) {
        _.forEach(_.keys(providers), (p) => {
          if (providers[p]) {
            linkedAccounts.push({ providerType: p });
          }
        });
      }
    }
    _.forEach(linkedAccounts, (linkedAccount) => {
      const providerType = linkedAccount.providerType || linkedAccount.provider;

      let account;
      if (externalAccountsData[providerType]) {
        // add external account data
        account = {
          providerType,
          data: externalAccountsData[providerType],
          status: 'linked',
        };
      } else {
        // account data not available yet, add pending card
        account = {
          providerType,
          data: { handle: linkedAccount.name },
          status: 'pending',
        };
      }
      if (_.find(
        settingsPageState.deletingLinks,
        l => l.providerType === account.providerType,
      )) {
        account.deleting = true;
      }
      allLinks.push(account);
    });

    // Append web links
    _.forEach(profileState.externalLinks, (el) => {
      const link = _.clone(el);
      link.providerType = 'weblink';
      link.status = link.synchronizedAt ? 'linked' : 'pending';
      if (_.find(settingsPageState.deletingLinks, l => l.key === link.key)) {
        link.deleting = true;
      }
      allLinks.push(link);
    });

    return (
      <div styleName={containerStyle}>
        <div styleName="linked-account-container">
          <h1>
            Linked Accounts
          </h1>
          <div styleName="sub-title">
            Your linked accounts
          </div>
          {
            isMobileView && (
              <AddWebLink {...this.props} allLinks={allLinks} />
            )
          }
          <LinkAccounts
            {...this.props}
            allLinks={allLinks}
            supportedAccounts={supportedAccounts}
          />
          <ExistingLinks
            {...this.props}
            allLinks={allLinks}
            supportedAccounts={supportedAccounts}
          />
          {
            !isMobileView && (
              <AddWebLink {...this.props} allLinks={allLinks} />
            )
          }
        </div>
      </div>
    );
  }
}

LinkedAccount.propTypes = {
  profileState: PT.shape().isRequired,
  settingsPageState: PT.shape().isRequired,
  settingsUI: PT.shape().isRequired,
};
