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

export default class Subscriptions extends React.Component {
  
  render() {
    

    return (
      <div>
        <form autoComplete= "off">
          <h2>Subscriptions</h2>
          <br />
          <div style= {{backgroundColor: "#fafafb", border:"1px solid #ededf2"}}>
            <h3>Add Subscription</h3>
            <br />
            <div styleName= "col-md-12 col-sm-12 col-xs-12 col-lg-12">
              <p>Name</p>
              <input type= "text" style= {{width: "100%"}} />
            </div>
            
            <button style= {{padding: "5px", borderRadius: "4px"}}>
              Add Subscription
            </button>
          </div>
          <br />
          <div style= {{border:"1px solid #ededf2"}}>
            <h4>HBO GO</h4>
          </div>
          <div style= {{border:"1px solid #ededf2"}}>
            <h4>Netflix</h4>
          </div>
        </form>
      </div>
    );
  }
}

Subscriptions.defaultProps = {
 
};

Subscriptions.propTypes = {
 };

