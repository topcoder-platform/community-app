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

export default class Language extends React.Component {
  
  render() {
    

    return (
      <div>
        <form autoComplete= "off">
          <h2>Language</h2>
          <br />
          <div style= {{backgroundColor: "#fafafb", border:"1px solid #ededf2"}}>
            <h3>Add Language</h3>
            <br />
            <div styleName= "col-md-6 col-sm-6 col-xs-6 col-lg-6">
              <p>Language</p>
              <input type= "text" style= {{width: "100%"}} />
            </div>
            <div styleName= "col-md-3 col-sm-3 col-xs-3 col-lg-3">
              <p>Spoken Level</p>
              <input type= "text" style= {{width: "100%"}} />
            </div>
            <div styleName= "col-md-3 col-sm-3 col-xs-3 col-lg-3">
              <p>Written Level</p>
              <input type= "text" style= {{width: "100%"}} />
            </div>
            <button style= {{padding: "5px", borderRadius: "4px"}}>
              Add Language
            </button>
          </div>
          <br />
          <div style= {{border:"1px solid #ededf2"}}>
            <h4>Hungarian</h4>
            <p>Spoken: NATIVE | Written: NATIVE</p>
          </div>
          <div style= {{border:"1px solid #ededf2"}}>
            <h4>German</h4>
            <p>Spoken: BASIC | Written: BASIC</p>
          </div>
          <div style= {{border:"1px solid #ededf2"}}>
            <h4>Hungarian</h4>
            <p>Spoken: BASIC | Written: BASIC</p>
          </div>
        </form>
      </div>
    );
  }
}

Language.defaultProps = {
 
};

Language.propTypes = {
 };

