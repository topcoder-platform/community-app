/**
 * Child component of Settings/Account renders setting page for account.
 */
import React from 'react';

import Credential from './Credential';
import NameAddress from './NameAddress';
import './styles.scss';

export default function Account(props) {
  return (
    <div className="account-info-container">
      <Credential
        {...props}
      />
      <NameAddress
        {...props}
      />
    </div>
  );
}
