/**
 * Child component of Settings/Profile renders setting page for profile.
 */
import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';

import { PrimaryButton } from 'topcoder-react-ui-kit';

import { looseEqual } from 'utils/tc';

import BasicInfo from './BasicInfo';
import Language from './Language';
import Education from './Education';
import Work from './Work';
import Organization from './Organization';
import Skill from './Skill';
import Hobby from './Hobby';

import Tracks from './Tracks';
import Skills from './Skills';
import ExternalLinks from './ExternalLinks';

import Styles from './styles.scss';

import ProfileSubtabs from './ProfileSubtabs';
import { PROFILETABS } from 'actions/page/profileSettings';
export default class Profile extends React.Component {
  constructor(props) {
    super(props);
    console.log("Profile props", props);
    this.state = {
      bio: props.basicInfo? props.basicInfo.traits.data[0].shortBio : '',
      countryCode: props.profile.competitionCountryCode,
      firstName: props.basicInfo? props.basicInfo.traits.data[0].firstName :'',
      lastName: props.basicInfo? props.basicInfo.traits.data[0].lastName :'',
      birthDate: '',
      gender: props.basicInfo? props.basicInfo.traits.data[0].gender : '',
      ethnic: props.basicInfo? props.basicInfo.traits.data[0].ethnicBackground : '',
      tSize: props.basicInfo? props.basicInfo.traits.data[0].tshirtSize : '',
      address: '',
      state: '',
      city: '',
      zip: '',
      current: '',
      interest: props.basicInfo? props.basicInfo.traits.data[0].primaryInterestInTopcoder : ''
    };

    this.onUpdateBio = this.onUpdateBio.bind(this);
    this.onUpdateCountry = this.onUpdateCountry.bind(this);
    this.onSaveProfile = this.onSaveProfile.bind(this);
    this.onUpdateFirstName = this.onUpdateFirstName.bind(this);
    this.onUpdateLastName = this.onUpdateLastName.bind(this);
    this.onUpdateBirthDate = this.onUpdateBirthDate.bind(this);
    this.onUpdateGender = this.onUpdateGender.bind(this);
    this.onUpdateEthnic = this.onUpdateEthnic.bind(this);
    this.onUpdateTSize = this.onUpdateTSize.bind(this);
    this.onUpdateAddress = this.onUpdateAddress.bind(this);
    this.onUpdateState = this.onUpdateState.bind(this);
    this.onUpdateCity = this.onUpdateCity.bind(this);
    this.onUpdateZip = this.onUpdateZip.bind(this);
    this.onUpdateCurrent = this.onUpdateCurrent.bind(this);
    this.onUpdateInterest = this.onUpdateInterest.bind(this);
  }

  onUpdateCountry(countryCode) {
    this.setState({ countryCode });
  }

  onUpdateBio(bio) {
    this.setState({ bio });
  }

  onUpdateFirstName(firstName) {
    this.setState({ firstName });
  }

  onUpdateLastName(lastName) {
  this.setState({ lastName });
  }
  onUpdateBirthDate(birthDate) {
    this.setState({ birthDate });
  }
  onUpdateGender(gender) {
    this.setState({ gender });
  }
  onUpdateEthnic(ethnic) {
    this.setState({ ethnic });
  }
  onUpdateTSize(tSize) {
    this.setState({ tSize });
  }
  onUpdateAddress(address) {
    this.setState({ address });
  }
  onUpdateState(state) {
    this.setState({ state });
  }
  onUpdateCity(city) {
    this.setState({ city });
  }
  onUpdateZip(zip) {
    this.setState({ zip });
  }
  onUpdateCurrent(location) {
    this.setState({ location });
  }
  onUpdateInterest(interest) {
    this.setState({ interest });
  }


  onSaveProfile(e) {
    e.preventDefault();
    if (this.props.profileState.updatingProfile) {
      return;
    }
    const newBasicInfo= _.clone(this.props.basicInfo);
    const newProfile = _.clone(this.props.profile);

    newProfile.description = this.state.bio;
    newProfile.competitionCountryCode = this.state.countryCode;
    newProfile.tracks = this.state.tracks;

    newBasicInfo.traits.data[0].shortBio= this.state.bio;
    newBasicInfo.traits.data[0].firstName= this.state.firstName;
    newBasicInfo.traits.data[0].lastName= this.state.lastName;
    newBasicInfo.traits.data[0].gender= this.state.gender;
    newBasicInfo.traits.data[0].ethnicBackground= this.state.ethnic;
    newBasicInfo.traits.data[0].tshirtSize= this.state.tSize;
    newBasicInfo.traits.data[0].ethnicBackground= this.state.ethnic;
    newBasicInfo.traits.data[0].primaryInterestInTopcoder= this.state.interest;
    delete newProfile.groups;
    this.props.updateProfile(newProfile, this.props.tokenV3);
    console.log("Updated basic info/ profile component ", newBasicInfo);
    this.props.updateBasicInfo(newBasicInfo);
  }

  render() {
    const {
      profileState,
      subTab
    } = this.props;
    const { updatingProfile } = profileState;
    
    const selectTab = (tab) => {
      var sTab= 'profile';
      const tab1= sTab+"/"+tab;
      this.props.selectTab(tab1);
      this.props.history.push(`/settings/profile/${tab}`);
    };

    const needSaveAboutMe = this.state.countryCode && (
      !looseEqual(this.state.bio, this.props.profile.description)
      || !looseEqual(this.state.countryCode, this.props.profile.competitionCountryCode));

    const needSaveTracks = this.state.tracks && this.state.tracks.length &&
      (!this.props.profile.tracks
        || !_.isEqual(this.state.tracks.sort(), this.props.profile.tracks.sort()));

    const needSave = needSaveAboutMe || needSaveTracks;

    return (
      <div styleName="edit-profile-container" style= {{padding: "0 50px 30px"}}>
        <div className="settings-section">
          <form autoComplete="off" style= {{width: "100%"}}>
            <input autoComplete="false" name="hidden" type="text" className="hidden" />
            <div styleName= "col-lg-3 col-sm-3 col-xs-3 col-md-3" style= {{padding: "0 10px"}}>
              <div>
                <ProfileSubtabs
                  subTab= {subTab}
                  selectTab= {selectTab}
                  />
              </div>
            </div>
            <div styleName= "col-lg-9 col-sm-9 col-xs-9 col-md-9">
              {
                subTab === PROFILETABS.BASICINFO &&
                <BasicInfo
                  bio={this.state.bio}
                  countryCode={this.state.countryCode}
                  firstName={this.state.firstName}
                  lastName={this.state.lastName}
                  birthDate={this.state.birthDate}
                  gender={this.state.gender}
                  ethnic={this.state.ethnic}
                  tSize={this.state.tSize}
                  address={this.state.address}
                  state={this.state.state}
                  city={this.state.city}
                  zip={this.state.zip}
                  current={this.state.current}
                  interest={this.state.interest}
                  onUpdateCountry={this.onUpdateCountry}
                  onSaveProfile= {this.onSaveProfile}
                  onUpdateBio={this.onUpdateBio}
                  onUpdateFirstName = {this.onUpdateFirstName}
                  onUpdateLastName = {this.onUpdateLastName}
                  onUpdateBirthDate = {this.onUpdateBirthDate}
                  onUpdateGender = {this.onUpdateGender}
                  onUpdateEthnic = {this.onUpdateEthnic}
                  onUpdateTSize = {this.onUpdateTSize}
                  onUpdateAddress = {this.onUpdateAddress}
                  onUpdateState = {this.onUpdateState}
                  onUpdateCity = {this.onUpdateCity}
                  onUpdateZip = {this.onUpdateZip}
                  onUpdateCurrent = {this.onUpdateCurrent}
                  onUpdateInterest = {this.onUpdateInterest}
                  {...this.props}
                />
              }
              {
                subTab === PROFILETABS.LANGUAGE &&
                <Language
                />
              }
              {
                subTab === PROFILETABS.EDUCATION &&
                <Education
                />
              }
              {
                subTab === PROFILETABS.WORK &&
                <Work
                />
              }
              {
                subTab === PROFILETABS.ORGANIZATION &&
                <Organization
                />
              }
              {
                subTab === PROFILETABS.SKILL &&
                <Skill
                />
              }
              {
                subTab === PROFILETABS.HOBBY &&
                <Hobby
                />
              }
              {/* <Tracks
                tracks={this.state.tracks}
                onUpdateTracks={this.onUpdateTracks}
                {...this.props}
              />
              <div className="save-section">
                <PrimaryButton
                  disabled={!needSave || updatingProfile}
                  onClick={this.onSaveProfile}
                  theme={{ button: Styles['save-button'] }}
                >
                  {
                    !updatingProfile && 'Save'
                  }
                  {
                    updatingProfile && <i className="fa fa-spinner fa-spin" />
                  }
                </PrimaryButton>
              </div>
              <Skills
                {...this.props}
              />
              <ExternalLinks
                {...this.props}
              /> */}
            </div>
          </form>
        </div>
      </div>
    );
  }
}

Profile.propTypes = {
  handle: PT.string.isRequired,
  tokenV3: PT.string.isRequired,
  profile: PT.shape().isRequired,
  profileState: PT.shape().isRequired,
  updateProfile: PT.func.isRequired,
  updateBasicInfo: PT.func.isRequired,
  subTab: PT.string.isRequired,
  selectTab: PT.func.isRequired,
  selectSubtab: PT.func.isRequired
};

