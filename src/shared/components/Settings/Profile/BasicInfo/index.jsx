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

export default class BasicInfo extends React.Component {
    constructor(props) {
        super(props);
        console.log("Basic Info props", props)
        this.state = {
          bio:props.basicInfo.traits.data[0].shortBio,
          countryCode: props.profile.competitionCountryCode,
          firstName:props.basicInfo.traits.data[0].firstName,
          lastName:props.basicInfo.traits.data[0].lastName,
          birthDate: '',
          gender:props.basicInfo.traits.data[0].gender,
          ethnic:props.basicInfo.traits.data[0].ethnicBackground,
          tSize:props.basicInfo.traits.data[0].tshirtSize,
          address: '',
          state: '',
          city: '',
          zip: '',
          current: '',
          interest:props.basicInfo.traits.data[0].primaryInterestInTopcoder
        };
    
        this.onUpdateBio = this.onUpdateBio.bind(this);
        this.onUpdateCountry = this.onUpdateCountry.bind(this);
        this.onSaveProfileBasicInfo = this.onSaveProfileBasicInfo.bind(this);
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
    
    
      onSaveProfileBasicInfo(e) {
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
          return (
              <Data 
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
              onSaveProfileBasicInfo= {this.onSaveProfileBasicInfo}
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
          );

      }

}