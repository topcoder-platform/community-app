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

export default class Devices extends React.Component {
  
  render() {
    

    return (
      <div>
        <form autoComplete= "off">
          <h2>Devices</h2>
          <br />
          <div style= {{backgroundColor: "#fafafb", border:"1px solid #ededf2"}}>
            <h3>Add Device</h3>
            <br />
            <div styleName= "col-md-4 col-sm-4 col-xs-4 col-lg-4">
              <p>Device Type</p>
              <input type= "text" style= {{width: "100%"}} />
            </div>
            <div styleName= "col-md-4 col-sm-4 col-xs-4 col-lg-4">
              <p>Manufacturer</p>
              <input type= "text" style= {{width: "100%"}} />
            </div>
            <div styleName= "col-md-4 col-sm-4 col-xs-4 col-lg-4">
              <p>Model</p>
              <input type= "text" style= {{width: "100%"}} />
            </div>
            <div styleName= "col-md-4 col-sm-4 col-xs-4 col-lg-4">
            </div>
            <div styleName= "col-md-4 col-sm-4 col-xs-4 col-lg-4">
              <p>Operating System</p>
              <input type= "text" style= {{width: "100%"}} />
            </div>
            <div styleName= "col-md-4 col-sm-4 col-xs-4 col-lg-4">
              <p>OS Version</p>
              <input type= "text" style= {{width: "100%"}} />
            </div>
            <div styleName= "col-md-4 col-sm-4 col-xs-4 col-lg-4">
              <p>OS Language</p>
              <input type= "text" style= {{width: "100%"}} />
            </div>
            <button style= {{padding: "5px", borderRadius: "4px"}}>
              Add Device
            </button>
          </div>
          <br />
          <div style= {{border:"1px solid #ededf2"}}>
            <h4>LENOVO | V520-15IKL TWR | DESKTOP</h4>
            <p>Windows 10 English</p>
          </div>
          <div style= {{border:"1px solid #ededf2"}}>
            <h4>LENOVO | V520-15IKL TWR | DESKTOP</h4>
            <p>Windows 10 English</p>
          </div>
          <div style= {{border:"1px solid #ededf2"}}>
            <h4>LENOVO | V520-15IKL TWR | DESKTOP</h4>
            <p>Windows 10 English</p>
          </div>
          <div style= {{border:"1px solid #ededf2"}}>
            <h4>LENOVO | V520-15IKL TWR | DESKTOP</h4>
            <p>Windows 10 English</p>
          </div>
        </form>
      </div>
    );
  }
}

Devices.defaultProps = {
 
};

Devices.propTypes = {
 };

