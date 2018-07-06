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
import { getLanguageLevel} from 'utils/languageLevel';
import { getLanguages} from 'utils/languages';
import Styles from './styles.scss';

const languageLevels= getLanguageLevel();
const allLanguages= getLanguages();
console.log("languageLevels");
console.log(languageLevels);
export default class Data extends React.Component {
  constructor(props) {
    super(props);
// console.log("Entered basic info constructors")
    // this.onUpdateLanguages = this.onUpdateLanguages.bind(this);
    this.onSaveProfileLanguages= this.onSaveProfileLanguages.bind(this)
    this.onUpdateLanguage= this.onUpdateLanguage.bind(this);
    this.onUpdateWrittenLevel= this.onUpdateWrittenLevel.bind(this);
    this.onUpdateSpokenLevel= this.onUpdateSpokenLevel.bind(this);
    // this.onDeleteProfileLanguages= this.onDeleteProfileLanguages.bind(this)
  }
  onUpdateLanguage(language){
    this.props.onUpdateLanguage(language.name);
  }
  onUpdateWrittenLevel(writtenLevel){
    this.props.onUpdateWrittenLevel(writtenLevel.name);
  }
  onUpdateSpokenLevel(spokenLevel){
    this.props.onUpdateSpokenLevel(spokenLevel.name);
  }
  onSaveProfileLanguages(e) {
    e.preventDefault();
    const language = this.props.language;
    const spokenLevel = this.props.spokenLevel;
    const writtenLevel = this.props.writtenLevel;
    const languagesobj= {
      "language": language,
      "spokenLevel": spokenLevel,
      "writtenLevel": writtenLevel
    }    
    this.props.onUpdateLanguages(languagesobj);
    this.props.onSaveProfileLanguages(e);
  }
  onDeleteProfileLanguages(language){
    // e.preventDefault();
    console.log("Deleting language");
    console.log(language);
    this.props.onDeleteProfileLanguages(language);
  }
  displayLang(){
    return(
      this.props.languages.map((languageObj, key) => {
        return (
        <div style= {{border:"1px solid #ededf2"}}>
        <div styleName= "col-md-9 col-sm-9 col-xs-9 col-lg-9">
          <h4>{languageObj.language}</h4>
          <p>Spoken: {languageObj.spokenLevel} | Written: {languageObj.writtenLevel}</p>
        </div>
        <div styleName= "col-md-3 col-sm-3 col-xs-3 col-lg-3">
        <button style= {{padding: "5px", borderRadius: "4px"}} onClick= {(e) => (e.preventDefault(), this.onDeleteProfileLanguages(languageObj.language))}>
                Delete
              </button>
          </div>
        </div>
      )})
    );
    
}
  render() {
    const {
      languages,
      spokenLevel,
      writtenLevel,
      language
    } = this.props;
    console.log("Language data props", this.props);
    

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
              <Select
                name="language"
                options={allLanguages}
                id= "profile-language"
                value={language}
                onChange={this.onUpdateLanguage}
                placeholder="Language"
                matchPos="start"
                matchProp="name"
                labelKey="name"
                valueKey="name"
                clearable={false}
              />
            </div>
            <div styleName= "col-md-3 col-sm-3 col-xs-3 col-lg-3">
              <p>Spoken Level</p>
              <Select
                name="spokenLevel"
                options={languageLevels}
                id= "profile-spokenLevel"
                value={spokenLevel}
                onChange={this.onUpdateSpokenLevel}
                placeholder="Spoken Level"
                matchPos="start"
                matchProp="name"
                labelKey="name"
                valueKey="name"
                clearable={false}
              />
            </div>
            <div styleName= "col-md-3 col-sm-3 col-xs-3 col-lg-3">
              <p>Written Level</p>
              <Select
                name="writtenLevel"
                options={languageLevels}
                id= "profile-writtenLevel"
                value={writtenLevel}
                onChange={this.onUpdateWrittenLevel}
                placeholder="Written Level"
                matchPos="start"
                matchProp="name"
                labelKey="name"
                valueKey="name"
                clearable={false}
              />
            </div>
            <button style= {{padding: "5px", borderRadius: "4px"}} onClick={this.onSaveProfileLanguages}>
              Add Language
            </button>
          </div>
          <br />
          {this.displayLang()}
        </form>
      </div>
    );
  }
}

Data.defaultProps = {
 
};

Data.propTypes = {
 };

