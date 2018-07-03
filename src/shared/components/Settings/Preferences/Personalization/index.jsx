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

export default class Personalization extends React.Component {
  
  render() {
    

    return (
      <div>
        <form autoComplete= "off">
          <h2>Personalization</h2>
          <br />
          <div style= {{border:"1px solid #ededf2"}}>
            <h4>User COntent</h4>
            <p>I allow Topcoder...</p>
          </div>
          
        </form>
      </div>
    );
  }
}

Personalization.defaultProps = {
 
};

Personalization.propTypes = {
 };

