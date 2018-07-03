/**
 * Child component of Settings/Profile/AboutMe renders "About Me" section of profile setting page.
 */
/* global document */
import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';

import { PrimaryButton, SecondaryButton } from 'topcoder-react-ui-kit';

import { getAllCountryObjects, getCountryObjFromAlpha3 } from 'utils/countries';

import Select from 'components/Select';
import DefaultPortrait from 'assets/images/ico-user-default.svg';

import Styles from './styles.scss';

const countries = getAllCountryObjects();

export default class Software extends React.Component {
  
  render() {
    

    return (
      <div>
        <form autoComplete= "off">
          <h2>Software</h2>
          <br />
          <div style= {{backgroundColor: "#fafafb", border:"1px solid #ededf2"}}>
            <h3>Add Software</h3>
            <br />
            <div styleName= "col-md-6 col-sm-6 col-xs-6 col-lg-6">
              <p>Software Type</p>
              <input type= "text" style= {{width: "100%"}} />
            </div>
            <div styleName= "col-md-6 col-sm-6 col-xs-6 col-lg-6">
              <p>Name</p>
              <input type= "text" style= {{width: "100%"}} />
            </div>
            <button style= {{padding: "5px", borderRadius: "4px"}}>
              Add Software
            </button>
          </div>
          <br />
          <div style= {{border:"1px solid #ededf2"}}>
            <h4>Google Chrome</h4>
            <p>Browser</p>
          </div>
          <div style= {{border:"1px solid #ededf2"}}>
            <h4>Avast Security</h4>
            <p>AntiVirus</p>
          </div>
          <div style= {{border:"1px solid #ededf2"}}>
            <h4>Spybot Home</h4>
            <p>AntiVirus</p>
          </div>
          <div style= {{border:"1px solid #ededf2"}}>
            <h4>OpenBSD</h4>
            <p>Firewall</p>
          </div>
        </form>
      </div>
    );
  }
}

Software.defaultProps = {
 
};

Software.propTypes = {
 };

