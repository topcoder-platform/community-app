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

export default class Hobby extends React.Component {
  
  render() {
    return (
      <div>
        <form autoComplete= "off">
          <h2>Hobby</h2>
          <br />
          <div style= {{backgroundColor: "#fafafb", border:"1px solid #ededf2"}}>
            <h3>Add Hobby</h3>
            <br />
            <div styleName= "col-md-5 col-sm-5 col-xs-5 col-lg-5">
              <p>Hobby</p>
              <input type= "text" style= {{width: "100%"}} />
            </div>
            <div styleName= "col-md-7 col-sm-7 col-xs-7 col-lg-7">
            </div>
            <p>Description</p>
            <textarea
                maxLength="256"
            />
            <div styleName= "col-md-12 col-sm-12 col-xs-12 col-lg-12">
            <button style= {{padding: "5px", borderRadius: "4px"}}>
              Add Hobby
            </button>
            </div>
          </div>
          <br />
          <div style= {{border:"1px solid #ededf2"}}>
            <h4>Listening to Music</h4>
            <p>Something</p>
          </div>
          <div style= {{border:"1px solid #ededf2"}}>
            <h4>Cooking</h4>
            <p>Something</p>
          </div>
          <div style= {{border:"1px solid #ededf2"}}>
            <h4>Reading</h4>
            <p>Something</p>
          </div>
        </form>
      </div>
    );
  }
}

Hobby.defaultProps = {
 
};

Hobby.propTypes = {
 };

