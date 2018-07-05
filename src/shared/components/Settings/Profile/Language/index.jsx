/**
 * Child component of Settings/Profile renders setting page for profile.
 */
import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';

import { PrimaryButton } from 'topcoder-react-ui-kit';

import { looseEqual } from 'utils/tc';

import Data from './Data';

import Styles from './styles.scss';

export default class Language extends React.Component {
    constructor(props) {
        super(props);
        console.log("Language props", props)
        this.state = {
          languages:props.language.traits.data,
          spokenLevel: '',
          writtenLevel: '',
          language: ''
        };
        this.onUpdateLanguages = this.onUpdateLanguages.bind(this);
        this.onSaveProfileLanguages = this.onSaveProfileLanguages.bind(this);
        this.onDeleteProfileLanguages= this.onDeleteProfileLanguages.bind(this);
        this.onUpdateLanguage= this.onUpdateLanguage.bind(this);
        this.onUpdateWrittenLevel= this.onUpdateWrittenLevel.bind(this);
        this.onUpdateSpokenLevel= this.onUpdateSpokenLevel.bind(this);
      }
      onDeleteProfileLanguages(languageobj){
        _.remove(this.state.languages, language => language.language===languageobj);
        this.setState({languages: this.state.languages});
        const newLanguage= _.clone(this.props.language);
        newLanguage.traits.data= this.state.languages;
        this.props.updateLanguage(newLanguage, this.props.handle);
      }
      onUpdateSpokenLevel(spokenLevel) {
        this.setState({ spokenLevel });
      }
      onUpdateWrittenLevel(writtenLevel) {
        this.setState({ writtenLevel });
      }
      onUpdateLanguage(language) {
        this.setState({ language });
      }
      onUpdateLanguages(languagesobj) {
        const languagesObjects= this.state.languages;
        languagesObjects.push(languagesobj);
        this.setState({languages:languagesObjects});
      }
      onSaveProfileLanguages(e) {
        e.preventDefault();
        const newLanguage= _.clone(this.props.language);
        newLanguage.traits.data= this.state.languages;
        this.props.updateLanguage(newLanguage, this.props.handle);
      }
    //   onSaveProfileLanguage(e) {
    //     e.preventDefault();
    //     if (this.props.profileState.updatingProfile) {
    //       return;
    //     }
    //     const newBasicInfo= _.clone(this.props.basicInfo);
    //     const newProfile = _.clone(this.props.profile);
    
    //     newProfile.description = this.state.bio;
    //     newProfile.competitionCountryCode = this.state.countryCode;
    //     newProfile.tracks = this.state.tracks;
    
    //     newBasicInfo.traits.data[0].shortBio= this.state.bio;
    //     newBasicInfo.traits.data[0].firstName= this.state.firstName;
    //     newBasicInfo.traits.data[0].lastName= this.state.lastName;
    //     newBasicInfo.traits.data[0].gender= this.state.gender;
    //     newBasicInfo.traits.data[0].ethnicBackground= this.state.ethnic;
    //     newBasicInfo.traits.data[0].tshirtSize= this.state.tSize;
    //     newBasicInfo.traits.data[0].ethnicBackground= this.state.ethnic;
    //     newBasicInfo.traits.data[0].primaryInterestInTopcoder= this.state.interest;
    //     delete newProfile.groups;
    //     this.props.updateProfile(newProfile, this.props.tokenV3);
    //     console.log("Updated basic info/ profile component ", newBasicInfo);
    //     this.props.updateBasicInfo(newBasicInfo);
    //   }
      render() {
          return (
              <Data 
              languages= {this.state.languages}
              language= {this.state.language}
              spokenLevel= {this.state.spokenLevel}
              writtenLevel= {this.state.writtenLevel}
              onUpdateLanguages= {this.onUpdateLanguages}
              onSaveProfileLanguages= {this.onSaveProfileLanguages}
              onDeleteProfileLanguages= {this.onDeleteProfileLanguages}
              onUpdateSpokenLevel= {this.onUpdateSpokenLevel}
              onUpdateWrittenLevel= {this.onUpdateWrittenLevel}
              onUpdateLanguage= {this.onUpdateLanguage}
              />
          );

      }

}