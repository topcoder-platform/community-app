/**
 * Child component of Settings/Profile renders setting page for profile.
 */
import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';

import { PrimaryButton } from 'topcoder-react-ui-kit';

import { looseEqual } from 'utils/tc';

import Data from './Data';

import Styles from './styles.scss';

export default class MyAccount extends React.Component {
    constructor(props) {
        super(props);
        console.log("MyAccount props", props)
        this.state = {
          email:props.profile.email
        }
        this.onUpdateEmail = this.onUpdateEmail.bind(this);
        this.onSaveEmail = this.onSaveEmail.bind(this);
    }
    onUpdateEmail(email){
        this.setState({email});
    }
    onSaveEmail(e){
        e.preventDefault();
        const newProfile= _.clone(this.props.profile);
        newProfile.email= this.state.email;
        delete newProfile.groups;
        this.props.updateProfile(newProfile, this.props.tokenV3);
      }
      render() {
          return (
              <Data
                email= {this.state.email}
                onUpdateEmail={this.onUpdateEmail}
                onSaveEmail= {this.onSaveEmail}
              {...this.props}
              />
          );

      }

}