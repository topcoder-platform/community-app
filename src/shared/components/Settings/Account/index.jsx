/**
 * Child component of Settings/Account renders setting page for account.
 */
import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';

import { PrimaryButton } from 'topcoder-react-ui-kit';

import { looseEqual } from 'utils/tc';

import Credential from './Credential';
import NameAddress from './NameAddress';

import Navbar from './Navbar';
// import LinkedAccount from './LinkedAccount';
import MyAccount from './MyAccount';

import Styles from './styles.scss';
import { ACCOUNTTABS } from 'actions/page/accountSettings';

export default class Account extends React.Component {
  constructor(props) {
    super(props);
    console.log("Account props", props);
    this.state = {
    };
  }

  
  render() {
    const {
      subTab
    } = this.props;
    return (
      <div styleName="edit-profile-container" style= {{padding: "60px 50px 55px"}}>
        <div className="settings-section" style= {{margin: "0"}}>
          <form autoComplete="off" style= {{width: "100%"}}>
            <input autoComplete="false" name="hidden" type="text" className="hidden" />
            <div style= {{width: "23.49%", marginRight: "6.6%", float: "left"}}>
              <div>
              <Navbar
                  subTab= {subTab}
                  {...this.props}
                  />
              </div>
            </div>
            <div style= {{width: "69.9%", float: "left"}}>
              {
                subTab === ACCOUNTTABS.MYACCOUNT &&
                <MyAccount
                {...this.props}
                />
              }
              {/* {
                subTab === ACCOUNTTABS.LINKEDACCOUNT &&
                <LinkedAccount
                {...this.props}
                />
              } */}
            </div>
          </form>
        </div>
      </div>
    );
  }
}

Account.propTypes = {
  subTab: PT.string.isRequired,
  selectSubtab: PT.func.isRequired,
  selectTab: PT.func.isRequired
};