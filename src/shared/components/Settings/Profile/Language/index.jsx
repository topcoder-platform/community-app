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
          language:props.language.traits.data[0].language,
          spokenLevel: props.language.traits.data[0].spokenLevel,
          writtenLevel:props.language.traits.data[0].writtenLevel
        };
    
        
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
              language= {this.state.language}
              spokenLevel= {this.state.spokenLevel}
              writtenLevel= {this.state.writtenLevel}
              />
          );

      }

}