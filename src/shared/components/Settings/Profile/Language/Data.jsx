/**
 * Child component of Settings/Profile/AboutMe renders "About Me" section of profile setting page.
 */
/* global document */
import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';

import { PrimaryButton, SecondaryButton } from 'topcoder-react-ui-kit';

import { getAllCountryObjects, getCountryObjFromAlpha3 } from 'utils/countries';
// import LanguageList from '../../../../../assets/images/languagelist.svg';
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
        <div style= {{border:"1px solid #ededf2", padding: "20px 20px", overflow: "hidden"}}>
        <div style= {{width: "6.7%", padding: "0", float: "left"}}>
        {/* <LanguageList /> */}
        </div>
        <div style= {{width: "79.83%", marginLeft: "2.4%", float: "left"}}>
          <p style= {{fontFamily: "Roboto", marginBottom: "5px", fontSize: "16px", fontWeight: "550", lineHeight: "1.33", color: "#262628"}}>{languageObj.language}</p>

          <p style= {{fontFamily: "Roboto", fontSize: "16px", color: "#888894", lineHeight: "1.33"}}>Spoken: <span style= {{textTransform: "uppercase"}}>{languageObj.spokenLevel}</span> | Written: <span style= {{textTransform: "uppercase"}}>{languageObj.writtenLevel}</span></p>
        </div>
        <div style= {{width: "8.367%", float: "left"}}>
        <a style= {{padding: "5px", borderRadius: "4px"}} onClick= {(e) => (e.preventDefault(), this.onDeleteProfileLanguages(languageObj.language))}>
                {/* <img src= "images/flag.jpg" style= {{height: "15px", width: "15px"}}/> */}
                <p style= {{fontSize: "16px", marginTop: "10px", fontFamily: "Roboto", textAlign: "center", lineHeight: "1.36", fontWeight: "550", cursor: "pointer"}}>Delete</p>
              </a>
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
      <div style= {{padding: "0", float: "left"}}>
          <p styleName= 'titleP'>Language</p>
          <div style= {{backgroundColor: "#fafafb", border:"1px solid #ededf2", padding: "20px"}}>
            <p style= {{fontSize: "20px", color: "#262628", lineHeight: "1.5", marginBottom: "20px"}}>Add Language</p>
            <br />
            <div styleName= "col-md-6 col-sm-6 col-xs-6 col-lg-6" style= {{paddingLeft: "0", paddingRight: "5px"}}>
              <p styleName= "headingsP">Add Language</p>
              <Select
                name="language"
                options={allLanguages}
                id= "profile-language"
                value={language}
                onChange={this.onUpdateLanguage}
                placeholder="Language"
                matchPos="start"
                matchProp="name"
                style= {{height: "36px", marginBottom: "20px", borderRadius: "4px", color: "#262628"}}
                labelKey="name"
                valueKey="name"
                clearable={false}
              />
            </div>
            <div styleName= "col-md-3 col-sm-3 col-xs-3 col-lg-3" style= {{paddingLeft: "5px", paddingRight: "5px"}}>
              <p styleName= "headingsP">Spoken Level</p>
              <Select
                name="spokenLevel"
                options={languageLevels}
                id= "profile-spokenLevel"
                value={spokenLevel}
                onChange={this.onUpdateSpokenLevel}
                placeholder="Spoken Level"
                matchPos="start"
                matchProp="name"
                style= {{height: "36px", marginBottom: "20px", borderRadius: "4px", color: "#262628"}}
                labelKey="name"
                valueKey="name"
                clearable={false}
              />
            </div>
            <div styleName= "col-md-3 col-sm-3 col-xs-3 col-lg-3" style= {{paddingLeft: "5px", paddingRight: "0"}}>
              <p styleName= "headingsP">Written Level</p>
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
                style= {{height: "36px", marginBottom: "20px", borderRadius: "4px", color: "#262628"}}
                valueKey="name"
                clearable={false}
              />
            </div>
            <div style={{textAlign: "center"}}>
            <PrimaryButton
              onClick={this.onSaveProfileLanguages}
              theme={{ button: Styles['save-button'] }}
            >
              Add Language
            </PrimaryButton>
            </div>
          </div>
          <div style={{backgroundColor: "white", marginTop: "20px"}}> 
          {this.displayLang()}
          </div>
      </div>
    );
  }
}

Data.defaultProps = {
 
};

Data.propTypes = {
 };

