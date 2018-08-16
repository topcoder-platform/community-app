/**
 * Renders 'Link Your Accounts' section.
 */
/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';
import SocialIcons from './SocialIcons';

import './styles.scss';

function getStyleName(account) {
  let style = 'ext-tile';
  if (account.disabled) {
    style += ' disabled';
  } else {
    style += ' enabled';
  }

  if (account.status === 'linked') {
    style += ' connected';
  } else if (account.status === 'pending') {
    style += ' connecting';
  } else if (account.status === 'unlinked' && !account.disabled) {
    style += ' connect';
  }
  return style;
}

export default class LinkAccounts extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e, account) {
    const {
      linkExternalAccount,
      profile,
      tokenV3,
      unlinkExternalAccount,
    } = this.props;
    e.preventDefault();
    if (account.status === 'linked') {
      unlinkExternalAccount(
        profile,
        tokenV3,
        account.providerType,
      );
    } else if (!account.disabled && account.status === 'unlinked') {
      linkExternalAccount(
        profile,
        tokenV3,
        account.providerType,
      );
    }
  }

  render() {
    const {
      allLinks,
      supportedAccounts,
    } = this.props;

    let accounts = _.cloneDeep(supportedAccounts);

    _.remove(accounts, al => al.order < 0);

    _.forEach(accounts, (account) => {
      const linkedAccount = _.find(allLinks, p => p.providerType === account.providerType);

      if (!linkedAccount) {
        account.status = 'unlinked'; /* eslint-disable-line no-param-reassign */
      } else {
        account.status = linkedAccount.status; /* eslint-disable-line no-param-reassign */
      }
    });
    accounts = _.sortBy(accounts, 'order');

    return (
      <div styleName="external-links">
        {
          _.map(accounts, account => (
            <div key={account.providerType} role="button" onClick={e => this.handleClick(e, account)} styleName={getStyleName(account)}>
              <div styleName={`external-account-box ${account.colorClass}`}>
                <img src={SocialIcons[account.providerType]} alt="icon" styleName={account.status === 'linked' ? '' : 'unadded'} />
              </div>
              <div styleName="status">
                { account.displayName }
              </div>
            </div>
          ))
        }
      </div>
    );
  }
}

LinkAccounts.propTypes = {
  tokenV3: PT.string.isRequired,
  profile: PT.shape().isRequired,
  allLinks: PT.arrayOf(PT.shape()).isRequired,
  supportedAccounts: PT.arrayOf(PT.shape()).isRequired,
  linkExternalAccount: PT.func.isRequired,
  unlinkExternalAccount: PT.func.isRequired,
};
