/**
 * Child component of Settings/Profile/AboutMe renders "About Me" section of profile setting page.
 */
/* global document */
import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';

import { PrimaryButton, SecondaryButton } from 'topcoder-react-ui-kit';

// import { getDeviceTypes } from 'utils/deviceTypes';
// import { getOperatingSystems } from 'utils/operatingSystems';

import Select from 'components/Select';
import DefaultPortrait from 'assets/images/ico-user-default.svg';

import Styles from './styles.scss';

// const deviceTypes = getDeviceTypes();
// const operatingSystems = getOperatingSystems();

export default class Data extends React.Component {
  constructor(props) {
    super(props);
    // console.log("Super props devices Data", props);
    this.onSaveEmail= this.onSaveEmail.bind(this);
    this.onUpdateEmail= this.onUpdateEmail.bind(this);
  }
  onUpdateEmail(email){
    const emailVal= document.querySelector('#account-email').value;
    this.props.onUpdateEmail(emailVal);
  }

  onSaveEmail(e){
    e.preventDefault();
    this.props.onSaveEmail(e);
  }
  render() {
    const {
      email,
      profile
    }= this.props;

    return (
      <div style= {{padding: "0", float: "left"}}>
          <p styleName= 'titleP'>{profile.handle}</p>
           <div style= {{width: "35%", paddingLeft: "0", paddingRight: "5px", float: "left"}}>
              <p styleName= 'headingsP'>Email</p>
              <input type= "text" style= {{height: "40px", marginBottom: "20px", borderRadius: "4px", color: "#262628"}} value={email} onChange={this.onUpdateEmail} id= "account-email" />
            </div>
            <div style= {{width: "65%", paddingLeft: "5px", paddingRight: "0", float: "left", marginTop: "15px", marginBottom: "15px"}}>
              <PrimaryButton
                onClick={this.onSaveEmail}
                theme={{ button: Styles['save-button'] }}
              >
                Change Email
              </PrimaryButton>
            </div>
            <div style= {{width: "35%", paddingLeft: "0", paddingRight: "5px", float: "left"}}>
              <p styleName= 'headingsP'>Current Password</p>
              <input type= "password" style= {{height: "40px", marginBottom: "20px", borderRadius: "4px", color: "#262628"}} id= "account-password" />
            </div>
            <div style= {{width: "35%", paddingLeft: "5px", paddingRight: "5px", float: "left"}}>
              <p styleName= 'headingsP'>New Password</p>
              <input type= "password" style= {{height: "40px", marginBottom: "20px", borderRadius: "4px", color: "#262628"}} id= "account-password" />
            </div>
            <div style= {{width: "30%", paddingLeft: "5px", paddingRight: "0", float: "left", marginTop: "15px", marginBottom: "15px"}}>
            <PrimaryButton
                theme={{ button: Styles['save-button'] }}
              >
                Change Password
              </PrimaryButton>
            </div>
      </div>
    );
  }
}

Data.defaultProps = {
 
};

Data.propTypes = {
 };

