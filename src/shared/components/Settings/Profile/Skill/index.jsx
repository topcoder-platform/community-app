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

export default class Skill extends React.Component {
  
  render() {
    

    return (
      <div>
        <form autoComplete= "off">
          <h2>Skill</h2>
          <br />
          <div style= {{backgroundColor: "#fafafb", border:"1px solid #ededf2"}}>
            <h3>Add Skill</h3>
            <br />
            <div styleName= "col-md-8 col-sm-8 col-xs-8 col-lg-8">
              <p>Skill</p>
              <input type= "text" style= {{width: "100%"}} />
            </div>
            <div styleName= "col-md-4 col-sm-4 col-xs-4 col-lg-4">
              <p>Years of Experience</p>
              <input type= "text" style= {{width: "100%"}} />
            </div>
            <div styleName= "col-md-12 col-sm-12 col-xs-12 col-lg-12">
            <button style= {{padding: "5px", borderRadius: "4px"}}>
              Add Skill
            </button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

Skill.defaultProps = {
 
};

Skill.propTypes = {
 };

