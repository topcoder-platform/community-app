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

export default class ServiceProviders extends React.Component {
  
  render() {
    

    return (
      <div>
        <form autoComplete= "off">
          <h2>ServiceProviders</h2>
          <br />
          <div style= {{backgroundColor: "#fafafb", border:"1px solid #ededf2"}}>
            <h3>Add Service Provider</h3>
            <br />
            <div styleName= "col-md-5 col-sm-5 col-xs-5 col-lg-5">
              <p>Type</p>
              <input type= "text" style= {{width: "100%"}} />
            </div>
            <div styleName= "col-md-7 col-sm-7 col-xs-7 col-lg-7">
              <p>Provider Name</p>
              <input type= "text" style= {{width: "100%"}} />
            </div>
            <button style= {{padding: "5px", borderRadius: "4px"}}>
              Add Provider
            </button>
          </div>
          <br />
          <div style= {{border:"1px solid #ededf2"}}>
            <h4>Vodafone</h4>
            <p>Mobile Carrier</p>
          </div>
          <div style= {{border:"1px solid #ededf2"}}>
            <h4>Simobil</h4>
            <p>Mobile Carrier</p>
          </div>
          <div style= {{border:"1px solid #ededf2"}}>
            <h4>UPC</h4>
            <p>Internet Service Provider</p>
          </div>
        </form>
      </div>
    );
  }
}

ServiceProviders.defaultProps = {
 
};

ServiceProviders.propTypes = {
 };

