/**
 * Child component of Settings/Profile/ExternalLinks renders
 * "External Links" section of profile setting page.
 */
import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';

import AddWebLink from './AddWebLink';
import LinkAccounts from './LinkAccounts';
import ExistingLinks from './ExistingLinks';

import './styles.scss';

const supportedAccounts =
  [
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
      providerType: 'linkedin',
      className: 'fa-linkedin',
      displayName: 'LinkedIn',
      disabled: true,
      order: 5,
      colorClass: 'el-linkedin',
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
      providerType: 'behance',
      className: 'fa-behance',
      displayName: 'Behance',
      disabled: true,
      order: 2,
      colorClass: 'el-behance',
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
      providerType: 'twitter',
      className: 'fa-twitter',
      displayName: 'Twitter',
      disabled: true,
      order: 4,
      colorClass: 'el-twitter',
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

export default function ExternalLinks(props) {
  // Construct all links
  const allLinks = [];
  const linkedAccounts = props.profileState.linkedAccounts || [];
  const externalAccountsData = props.profileState.externalAccounts || {};

  if (!linkedAccounts.length) {
    const providers = _.omit(externalAccountsData, ['userId', 'updatedAt', 'createdAt', 'createdBy', 'updatedBy', 'handle']);

    _.forEach(_.keys(providers), (p) => {
      if (providers[p]) {
        linkedAccounts.push({ providerType: p });
      }
    });
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
      props.settingsPageState.deletingLinks,
      l => l.providerType === account.providerType,
    )) {
      account.deleting = true;
    }
    allLinks.push(account);
  });

  // Append web links
  _.forEach(props.profileState.externalLinks, (el) => {
    const link = _.clone(el);
    link.providerType = 'weblink';
    link.status = link.synchronizedAt ? 'linked' : 'pending';
    if (_.find(props.settingsPageState.deletingLinks, l => l.key === link.key)) {
      link.deleting = true;
    }
    allLinks.push(link);
  });

  return (
    <div className="settings-section" styleName="links">
      <div className="section-info">
        <h2>External links</h2>
        <div className="description">Show off your work and experience outside of Topcoder. Connect accounts from popular services and networks or add a link to any site.</div>
      </div>
      <div className="section-fields">
        <div className="form-label">Add a web link</div>
        <AddWebLink
          {...props}
        />
        <div className="form-label">Link Your Accounts</div>
        <LinkAccounts
          {...props}
          allLinks={allLinks}
          supportedAccounts={supportedAccounts}
        />
        <div className="form-label">Linked Accounts</div>
        <ExistingLinks
          {...props}
          allLinks={allLinks}
          supportedAccounts={supportedAccounts}
        />
      </div>
    </div>
  );
}

ExternalLinks.propTypes = {
  profileState: PT.shape().isRequired,
  settingsPageState: PT.shape().isRequired,
};
