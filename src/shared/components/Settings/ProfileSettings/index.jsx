import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';
import moment from 'moment';

import ConsentComponent from 'components/Settings/ConsentComponent';

import fetch from 'isomorphic-fetch';
import { config } from 'topcoder-react-utils';
import { PrimaryButton } from 'topcoder-react-ui-kit';

import { validateStartDate, validateEndDate } from 'utils/settings';
import ImageInput from './ImageInput';
import SettingsBanner from '../SettingsBanner';
import PersonalDetails from './PersonalDetails';
import EducationList from './Learning/List';
import HobbyList from './Hobbies/List';

import style from './styles.scss';

import { PROFILE_SETTINGS } from '../constants';
import AboutYou from './AboutYou';
import Learning from './Learning';
import Hobbies from './Hobbies';
import ConfirmationModal from '../ConfirmationModal';

class ProfileSettings extends ConsentComponent {
  constructor(props) {
    super(props);

    this.shouldDisableSave = this.shouldDisableSave.bind(this);
    this.onUpdateCountry = this.onUpdateCountry.bind(this);
    this.onUpdateInput = this.onUpdateInput.bind(this);
    this.onUpdateDate = this.onUpdateDate.bind(this);
    this.onHandleSaveBasicInfo = this.onHandleSaveBasicInfo.bind(this);
    this.onSaveBasicInfo = this.onSaveBasicInfo.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onCheckFormValue = this.onCheckFormValue.bind(this);
    this.processBasicInfo = this.processBasicInfo.bind(this);

    this.onHandleDeleteEducation = this.onHandleDeleteEducation.bind(this);
    this.onDeleteEducation = this.onDeleteEducation.bind(this);
    this.onEditEducation = this.onEditEducation.bind(this);
    this.loadEducationTrait = this.loadEducationTrait.bind(this);
    this.onUpdateEducationInput = this.onUpdateEducationInput.bind(this);
    this.onHandleAddEducation = this.onHandleAddEducation.bind(this);
    this.onAddEducation = this.onAddEducation.bind(this);
    this.loadPersonalizationTrait = this.loadPersonalizationTrait.bind(this);
    this.updatePredicate = this.updatePredicate.bind(this);
    this.onUpdateEducationDate = this.onUpdateEducationDate.bind(this);
    this.onCancelEditStatus = this.onCancelEditStatus.bind(this);
    this.onCheckEducationFormValue = this.onCheckEducationFormValue.bind(this);

    this.onHandleDeleteHobby = this.onHandleDeleteHobby.bind(this);
    this.onDeleteHobby = this.onDeleteHobby.bind(this);
    this.onEditHobby = this.onEditHobby.bind(this);
    this.loadHobbyTrait = this.loadHobbyTrait.bind(this);
    this.onUpdateHobbyInput = this.onUpdateHobbyInput.bind(this);
    this.onHandleAddHobby = this.onHandleAddHobby.bind(this);
    this.onAddHobby = this.onAddHobby.bind(this);
    this.onCancelEditStatusHobby = this.onCancelEditStatusHobby.bind(this);


    const { userTraits } = props;
    this.state = {
      inputChanged: false,
      formInvalid: false,
      startDateInvalid: false,
      startDateInvalidMsg: '',
      endDateInvalid: false,
      endDateInvalidMsg: '',
      basicInfoTrait: this.loadBasicInfoTraits(userTraits),
      profile: {},
      educationTrait: this.loadEducationTrait(userTraits),
      newEducation: {
        schoolCollegeName: '',
        major: '',
        timePeriodFrom: '',
        timePeriodTo: '',
        graduated: false,
      },
      isSubmit: false,
      isMobileView: false,
      screenSM: 767,
      isEdit: false,
      indexNo: null,
      showConfirmation: false,
      showConfirmationHobby: false,
      personalizationTrait: this.loadPersonalizationTrait(userTraits),
      newProfileInfo: {
        firstName: null,
        lastName: null,
        tracks: [],
        status: null,
        addresses: [],
        description: '',
        email: null,
        homeCountryCode: null,
        competitionCountryCode: null,
        photoURL: null,
      },
      newBasicInfo: {
        gender: null,
        shortBio: '',
        tshirtSize: null,
        country: null,
        primaryInterestInTopcoder: null,
        currentLocation: null,
        birthDate: null,
      },
      hobbyTrait: this.loadHobbyTrait(userTraits),
      formInvalidHobby: false,
      isSubmitHobby: false,
      indexNoHobby: null,
      isHobbyEdit: false,
      newHobby: {
        hobby: '',
        description: '',
      },
    };
  }

  componentDidMount() {
    const { basicInfoTrait } = this.state;
    const basicInfo = basicInfoTrait.traits ? basicInfoTrait.traits.data[0] : {};
    this.processBasicInfo(basicInfo, this.props.profile);
    this.setState({ profile: this.props.profile });
    this.updatePredicate();
    window.addEventListener('resize', this.updatePredicate);
  }

  componentWillReceiveProps(nextProps) {
    const basicInfoTrait = this.loadBasicInfoTraits(nextProps.userTraits);

    const basicInfo = basicInfoTrait.traits ? basicInfoTrait.traits.data[0] : {};
    const previousBasicInfoTrait = this.loadBasicInfoTraits(this.props.userTraits);

    const personalizationTrait = this.loadPersonalizationTrait(nextProps.userTraits);
    const educationTrait = this.loadEducationTrait(nextProps.userTraits);
    const hobbyTrait = this.loadHobbyTrait(nextProps.userTraits);

    if (!_.isEqual(basicInfoTrait, previousBasicInfoTrait)) {
      this.processBasicInfo(basicInfo, nextProps.profile);
      this.setState({
        basicInfoTrait,
        personalizationTrait,
        inputChanged: false,
      });
    }
    if (!_.isEqual(this.state.profile, nextProps.profile)) {
      this.processBasicInfo(basicInfo, nextProps.profile);
      this.setState({ profile: nextProps.profile });
    }
    if (nextProps.lookupData) {
      const { countries } = nextProps.lookupData;
      const { newBasicInfo, newProfileInfo } = this.state;
      if (!newBasicInfo.country) {
        const code = newProfileInfo.homeCountryCode || newProfileInfo.competitionCountryCode;
        const { country } = countries.find(c => c.countryCode === code) || {};
        newBasicInfo.country = country;
        this.setState({ newBasicInfo });
      }
    }

    this.setState({
      educationTrait,
      personalizationTrait,
      formInvalid: false,
      startDateInvalid: false,
      startDateInvalidMsg: '',
      endDateInvalid: false,
      endDateInvalidMsg: '',
      isSubmit: false,
    });

    this.setState({
      hobbyTrait,
      personalizationTrait,
      formInvalidHobby: false,
      isSubmitHobby: false,
    });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updatePredicate);
  }

  onCheckFormValue(newBasicInfo, newProfileInfo) {
    let invalid = false;

    if (!_.trim(newProfileInfo.firstName).length) {
      invalid = true;
    }

    if (!_.trim(newProfileInfo.lastName).length) {
      invalid = true;
    }

    if (!_.trim(newBasicInfo.country).length) {
      invalid = true;
    }

    if (_.trim(newBasicInfo.birthDate).length > 0) {
      if (!moment().isAfter(newBasicInfo.birthDate)) {
        invalid = true;
      }
    }

    this.setState({ formInvalid: invalid });
    return invalid;
  }

  async onCheckUserTrait(traitId) {
    const { handle, tokenV3 } = this.props;
    let isExists = false;
    await fetch(`${config.API.V5}/members/${handle}/traits?traitIds=${traitId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenV3}`,
      },
    })
      .then(result => result.json())
      .then((dataResponse) => {
        if (dataResponse.length > 0) {
          const trait = dataResponse[0];
          if (trait.createdAt) {
            isExists = true;
          }
        }
      });

    return isExists;
  }

  /**
   * Save Personal Details
   * @param {*} e event
   */
  onHandleSaveBasicInfo(e) {
    if (e) e.preventDefault();
    const { setIsSaving } = this.props;
    this.setState({ inputChange: true, isSubmit: true, isSubmitHobby: true });
    setIsSaving(true);
    const {
      newBasicInfo, newProfileInfo, newEducation, newHobby,
    } = this.state;

    if (!_.isEmpty(newEducation.timePeriodFrom)
      && !_.isEmpty(newEducation.timePeriodTo)
      && _.trim(newEducation.schoolCollegeName).length
    ) {
      this.setState({ isSubmit: true });
      if (this.onCheckEducationFormValue(newEducation)) {
        setIsSaving(false);
        return;
      }
    }

    if (!this.onCheckEducationFormValue(newEducation)) {
      this.showConsent(this.onAddEducation.bind(this));
    }

    if (!this.onCheckFormValueHobby(newHobby)) {
      this.showConsent(this.onAddHobby.bind(this));
    }

    if (!this.onCheckFormValue(newBasicInfo, newProfileInfo)) {
      this.showConsent(this.onSaveBasicInfo.bind(this));
    } else {
      setIsSaving(false);
    }
  }

  /**
   * Save Basic Info
   * @param answer user consent answer value
   */
  async onSaveBasicInfo(answer) {
    const {
      newBasicInfo, newProfileInfo, basicInfoTrait, personalizationTrait,
    } = this.state;
    const {
      handle,
      tokenV3,
      addUserTrait,
      updateUserTrait,
      updateProfileV5,
    } = this.props;
    try {
      const parsedDate = moment(newBasicInfo.birthDate).utc();
      if (parsedDate.isValid()) {
        newBasicInfo.birthDate = `${parsedDate.format('YYYY-MM-DD')}T00:00:00.000Z`;
      } else {
        newBasicInfo.birthDate = null;
      }
    } catch (error) {
      newBasicInfo.birthDate = null;
    }

    if (newBasicInfo.gender === '') {
      newBasicInfo.gender = null;
    }

    if (newBasicInfo.tshirtSize === '') {
      newBasicInfo.tshirtSize = null;
    }

    newProfileInfo.addresses[0] = _.omit(newProfileInfo.addresses[0], ['createdAt', 'updatedBy', 'createdBy', 'updatedAt']);
    _.forEach(newProfileInfo.addresses[0], (value, key) => {
      newProfileInfo.addresses[0][key] = _.trim(value);
    });
    _.forEach(['currentLocation', 'primaryInterestInTopcoder'], (key) => {
      newBasicInfo[key] = _.trim(newBasicInfo[key]);
    });
    _.forEach(['description'], (key) => {
      newProfileInfo[key] = _.trim(newProfileInfo[key]);
    });
    // This is a hack to check if the user has an existing basic_info trait object
    const exists = await this.onCheckUserTrait('basic_info');
    if (exists) {
      const newBasicInfoTrait = { ...basicInfoTrait };
      newBasicInfoTrait.traits.data = [];
      newBasicInfoTrait.traits.data.push(newBasicInfo);
      await updateUserTrait(handle, 'basic_info', newBasicInfoTrait.traits.data, tokenV3);
    } else {
      const data = [];
      data.push(newBasicInfo);
      await addUserTrait(handle, 'basic_info', data, tokenV3);
    }

    // save personalization
    if (_.isEmpty(personalizationTrait)) {
      const personalizationData = { userConsent: answer };
      await addUserTrait(handle, 'personalization', [personalizationData], tokenV3);
    } else {
      const trait = personalizationTrait.traits.data[0];
      if (trait.userConsent !== answer) {
        const personalizationData = { userConsent: answer };
        await updateUserTrait(handle, 'personalization', [personalizationData], tokenV3);
      }
    }

    if (newProfileInfo.homeCountryCode == null) {
      delete newProfileInfo.homeCountryCode;
    }

    const updateProfileData = {
      ...newProfileInfo,
    };

    await updateProfileV5(updateProfileData, handle, tokenV3);

    this.props.setIsSaving(false);
  }

  onUpdateInput(e) {
    const { newBasicInfo: oldBasicInfo, newProfileInfo: oldProfileInfo } = this.state;
    const newBasicInfo = { ...oldBasicInfo };
    const newProfileInfo = { ...oldProfileInfo };
    const { name, value } = e.target;
    switch (name) {
      case 'stateCode':
      case 'zip':
      case 'city':
      case 'streetAddr1':
      case 'streetAddr2':
        if (newProfileInfo.addresses.length === 0) {
          newProfileInfo.addresses.push({
            stateCode: '',
            zip: '',
            city: '',
            streetAddr1: '',
            streetAddr2: '',
          });
        }
        newProfileInfo.addresses[0][name] = value;
        break;
      case 'firstName':
      case 'lastName':
        newProfileInfo[name] = value.replace(/[^a-zA-Z0-9,. -]/g, '');
        break;
      default:
        if (name in newProfileInfo) {
          newProfileInfo[name] = value;
        } else if (name in newBasicInfo) {
          newBasicInfo[name] = value;
        }
    }

    this.setState({ newBasicInfo, newProfileInfo, inputChanged: true });
  }

  onUpdateDate(date) {
    const { newBasicInfo: oldBasicInfo } = this.state;
    const newBasicInfo = { ...oldBasicInfo };
    newBasicInfo.birthDate = date;
    this.setState({ newBasicInfo, inputChanged: true });
  }

  onUpdateCountry(country) {
    if (country) {
      const { newBasicInfo: oldBasicInfo } = this.state;
      const newBasicInfo = { ...oldBasicInfo };
      newBasicInfo.country = country.name;
      newBasicInfo.competitionCountryCode = country.key;
      newBasicInfo.homeCountryCode = country.key;
      this.setState({ newBasicInfo, inputChanged: true });
    }
  }

  /**
   * Change toggle button check value
   * @param id community id
   * @param checked check value
   */
  onChange(id, checked) {
    const { newProfileInfo } = this.state;
    if (checked) {
      newProfileInfo.tracks.push(id.toUpperCase());
    } else {
      _.remove(newProfileInfo.tracks, track => (
        track.toUpperCase() === id.toUpperCase()
      ));
    }
    this.setState({ newProfileInfo, inputChanged: true });
  }

  /**
   * Get basic info trait
   * @param userTraits the all user traits
   */
  loadBasicInfoTraits = (userTraits) => {
    const trait = userTraits.filter(t => t.traitId === 'basic_info');
    const basicInfo = trait.length === 0 ? {} : trait[trait.length - 1];
    return _.assign({}, basicInfo);
  }

  /**
   * Get personalization trait
   * @param userTraits the all user traits
   */
  loadPersonalizationTrait = (userTraits) => {
    const trait = userTraits.filter(t => t.traitId === 'personalization');
    const personalization = trait.length === 0 ? {} : trait[0];
    return _.assign({}, personalization);
  }

  /**
   * Process basic info state
   */
  processBasicInfo = (value, profile) => {
    const { newBasicInfo, newProfileInfo: profileInfo } = this.state;
    if (_.has(profile, 'handle')) {
      const newProfileInfo = Object.keys(profileInfo).reduce((acc, key) => {
        if (_.has(profileInfo, key)) {
          acc[key] = profile[key] || profileInfo[key];
        }
        return acc;
      }, {});
      const basicInfo = Object.keys(newBasicInfo).reduce((acc, key) => {
        if (_.has(value, key)) {
          acc[key] = value[key];
          newBasicInfo[key] = value[key];
        }
        return acc;
      }, {});
      this.setState({ newBasicInfo: basicInfo, newProfileInfo });
    }
    if (_.has(value, 'tshirtSize')) {
      newBasicInfo.tshirtSize = value.tshirtSize;
    }
    if (_.has(value, 'userId')) {
      newBasicInfo.userId = value.userId;
    } else {
      newBasicInfo.userId = profile.userId;
    }
    this.setState({ newBasicInfo });
  }

  /**
   * Check form validation
   * @returns {boolean}
   */
  shouldDisableSave() {
    const { newBasicInfo, inputChanged, newProfileInfo } = this.state;

    const { addresses } = newProfileInfo;

    const invalid = !_.trim(newProfileInfo.firstName).length
      || !_.trim(newProfileInfo.lastName).length
      || !_.trim(newBasicInfo.gender).length
      || !_.trim(newBasicInfo.tshirtSize).length
      || !_.trim(newBasicInfo.country).length
      || !_.trim(newBasicInfo.primaryInterestInTopcoder).length
      || !_.trim(newBasicInfo.currentLocation).length
      || !_.trim(newBasicInfo.birthDate).length
      || (addresses.length > 0 && !_.trim(addresses[0].city).length)
      || (addresses.length > 0 && !_.trim(addresses[0].stateCode).length)
      || (addresses.length > 0 && !_.trim(addresses[0].zip).length)
      || (addresses.length > 0
        && !_.trim(addresses[0].streetAddr1).length);

    // Invalid value, can not save
    if (invalid) {
      return true;
    }

    // Value not changed, no need save
    return inputChanged === false;
  }

  /**
   * Check form fields value,
   * Invalid value, can not save
   * @param newEducation object
   */
  onCheckEducationFormValue(newEducation) {
    let invalid = false;

    if (!_.trim(newEducation.schoolCollegeName).length) {
      invalid = true;
    }

    const fromDateValidResult = validateStartDate(newEducation.graduated,
      newEducation.timePeriodFrom, newEducation.timePeriodTo);
    const endDateValidResult = validateEndDate(newEducation.graduated,
      newEducation.timePeriodFrom, newEducation.timePeriodTo);
    const formInvalid = invalid || fromDateValidResult.invalid || endDateValidResult.invalid;

    this.setState({
      formInvalid,
      startDateInvalid: fromDateValidResult.invalid,
      startDateInvalidMsg: fromDateValidResult.message,
      endDateInvalidMsg: endDateValidResult.message,
      endDateInvalid: endDateValidResult.invalid,
    });
    return formInvalid;
  }

  onCheckStartDate() {
    const { newEducation } = this.state;
    const currentDate = new Date().setHours(0, 0, 0, 0);
    const result = {
      invalid: false,
      message: '',
    };

    if (!_.isEmpty(newEducation.timePeriodFrom) && _.isEmpty(newEducation.timePeriodTo)) {
      const fromDate = new Date(newEducation.timePeriodFrom).setHours(0, 0, 0, 0);

      if (fromDate > currentDate) {
        result.invalid = true;
        result.message = 'Start Date should be in past or current';
      }
    } else if (!_.isEmpty(newEducation.timePeriodFrom) && !_.isEmpty(newEducation.timePeriodTo)) {
      const fromDate = new Date(newEducation.timePeriodFrom).setHours(0, 0, 0, 0);
      const toDate = new Date(newEducation.timePeriodTo).setHours(0, 0, 0, 0);

      if (fromDate > currentDate) {
        result.invalid = true;
        result.message = 'Start Date should be in past or current';
      }

      if (fromDate >= toDate) {
        result.invalid = true;
        result.message = 'Start Date should be before End Date';
      }
    }

    return result;
  }

  onHandleDeleteEducation(indexNo) {
    this.setState({
      showConfirmation: true,
      indexNo,
    });
  }

  onUpdateEducationDate(date, timePeriod) {
    const { newEducation: oldEducation } = this.state;
    const newEducation = { ...oldEducation };
    newEducation[timePeriod] = date || '';
    this.setState({ newEducation, isSubmit: false });
  }

  /**
   * Delete education by index
   * @param indexNo the education index no
   */
  onDeleteEducation(indexNo) {
    const { educationTrait } = this.state;
    const newEducationTrait = { ...educationTrait };
    newEducationTrait.traits.data.splice(indexNo, 1);
    this.setState({
      educationTrait: newEducationTrait,
    });

    const {
      handle,
      tokenV3,
      updateUserTrait,
      deleteUserTrait,
    } = this.props;

    if (newEducationTrait.traits.data.length > 0) {
      updateUserTrait(handle, 'education', newEducationTrait.traits.data, tokenV3);
    } else {
      deleteUserTrait(handle, 'education', tokenV3);
    }

    this.setState({
      showConfirmation: false,
      indexNo: null,
      isSubmit: false,
      isEdit: false,
      formInvalid: false,
      startDateInvalid: false,
      startDateInvalidMsg: '',
      endDateInvalid: false,
      endDateInvalidMsg: '',
    });
  }

  /**
   * Edit Education by index
   * @param indexNo the education index no
   */
  onEditEducation(indexNo) {
    const { educationTrait } = this.state;
    this.setState({
      newEducation: {
        schoolCollegeName: educationTrait.traits.data[indexNo].schoolCollegeName,
        major: _.isEmpty(educationTrait.traits.data[indexNo].major) ? '' : educationTrait.traits.data[indexNo].major,
        timePeriodFrom: _.isEmpty(educationTrait.traits.data[indexNo].timePeriodFrom) ? '' : educationTrait.traits.data[indexNo].timePeriodFrom,
        timePeriodTo: _.isEmpty(educationTrait.traits.data[indexNo].timePeriodTo) ? '' : educationTrait.traits.data[indexNo].timePeriodTo,
        graduated: educationTrait.traits.data[indexNo].graduated,
      },
      isSubmit: false,
      isEdit: true,
      indexNo,
      formInvalid: false,
      startDateInvalid: false,
      startDateInvalidMsg: '',
      endDateInvalid: false,
      endDateInvalidMsg: '',
    });
  }

  /**
   * Add new education
   * @param answer user consent answer value
   */
  onAddEducation(answer) {
    const {
      newEducation, personalizationTrait, isEdit, indexNo,
    } = this.state;

    if (this.onCheckEducationFormValue(newEducation)) {
      return;
    }

    const {
      handle,
      tokenV3,
      updateUserTrait,
      addUserTrait,
    } = this.props;

    const { educationTrait } = this.state;

    const education = _.clone(newEducation);
    if (_.isEmpty(education.major)) {
      delete education.major;
    }
    if (_.isEmpty(education.timePeriodFrom)) {
      delete education.timePeriodFrom;
    }

    if (_.isEmpty(education.timePeriodTo)) {
      delete education.timePeriodTo;
    }

    if (educationTrait.traits && educationTrait.traits.data.length > 0) {
      const newEducationTrait = _.cloneDeep(educationTrait);
      if (isEdit) {
        newEducationTrait.traits.data.splice(indexNo, 1);
      }
      newEducationTrait.traits.data.push(education);
      updateUserTrait(handle, 'education', newEducationTrait.traits.data, tokenV3);
    } else {
      const newEducations = [];
      newEducations.push(education);
      addUserTrait(handle, 'education', newEducations, tokenV3);
    }
    const empty = {
      schoolCollegeName: '',
      major: '',
      timePeriodFrom: '',
      timePeriodTo: '',
      graduated: false,
    };
    this.setState({
      newEducation: empty,
      isEdit: false,
      indexNo: null,
      isSubmit: false,
    });
    // save personalization
    if (_.isEmpty(personalizationTrait)) {
      const personalizationData = { userConsent: answer };
      addUserTrait(handle, 'personalization', [personalizationData], tokenV3);
    } else {
      const trait = personalizationTrait.traits.data[0];
      if (trait.userConsent !== answer) {
        const personalizationData = { userConsent: answer };
        updateUserTrait(handle, 'personalization', [personalizationData], tokenV3);
      }
    }
  }

  /**
   * Update education input value
   * @param e event
   */
  onUpdateEducationInput(e) {
    const { newEducation: oldEducation } = this.state;
    const newEducation = { ...oldEducation };
    if (e.target.type !== 'checkbox') {
      newEducation[e.target.name] = e.target.value;
    } else {
      newEducation[e.target.name] = e.target.checked;
      if (e.target.checked) { // if graduated and toDate is in Future, nullify it
        const toDate = new Date(newEducation.timePeriodTo).setHours(0, 0, 0, 0);
        const currentDate = new Date().setHours(0, 0, 0, 0);
        if (toDate > currentDate) {
          newEducation.timePeriodTo = '';
        }
      }
    }

    this.setState({ newEducation, isSubmit: false });
  }

  /**
   * Show User Consent Modal
   * @param e event
   */
  onHandleAddEducation(e) {
    if (e) e.preventDefault();
    const { newEducation } = this.state;
    this.setState({ isSubmit: true });
    if (this.onCheckEducationFormValue(newEducation)) {
      return;
    }
    this.showConsent(this.onAddEducation.bind(this));
  }

  /**
   * Get education trait
   * @param userTraits the all user traits
   */
  loadEducationTrait = (userTraits) => {
    const trait = userTraits.filter(t => t.traitId === 'education');
    const educations = trait.length === 0 ? {} : trait[0];
    return _.assign({}, educations);
  }

  updatePredicate() {
    const { screenSM } = this.state;
    this.setState({ isMobileView: window.innerWidth <= screenSM });
  }

  onCancelEditStatus() {
    const { isEdit } = this.state;
    if (isEdit) {
      this.setState({
        isEdit: false,
        isSubmit: false,
        indexNo: null,
        newEducation: {
          schoolCollegeName: '',
          major: '',
          timePeriodFrom: '',
          timePeriodTo: '',
          graduated: false,
        },
        formInvalid: false,
        startDateInvalid: false,
        startDateInvalidMsg: '',
        endDateInvalid: false,
        endDateInvalidMsg: '',
      });
    }
  }

  /**
   * Show User Consent Modal
   * @param e event
   */
  onHandleAddHobby(e) {
    e.preventDefault();
    const { newHobby } = this.state;
    this.setState({ isSubmitHobby: true });
    if (this.onCheckFormValueHobby(newHobby)) {
      return;
    }
    this.showConsent(this.onAddHobby.bind(this));
  }

  /**
     * Check form fields value,
     * Invalid value, can not save
     * @param newHobby object
     */
  onCheckFormValueHobby(newHobby) {
    let invalid = false;

    if (!_.trim(newHobby.hobby).length) {
      invalid = true;
    }

    this.setState({ formInvalidHobby: invalid });
    return invalid;
  }

  onHandleDeleteHobby(indexNoHobby) {
    this.setState({
      showConfirmationHobby: true,
      indexNoHobby,
    });
  }

  /**
     * Delete hobby by index
     * @param indexNoHobby the hobby index no
     */
  onDeleteHobby(indexNoHobby) {
    const { hobbyTrait } = this.state;
    const newHobbyTrait = { ...hobbyTrait };
    newHobbyTrait.traits.data.splice(indexNoHobby, 1);
    this.setState({
      hobbyTrait: newHobbyTrait,
    });

    const {
      handle,
      tokenV3,
      updateUserTrait,
      deleteUserTrait,
    } = this.props;

    if (newHobbyTrait.traits.data.length > 0) {
      updateUserTrait(handle, 'hobby', newHobbyTrait.traits.data, tokenV3);
    } else {
      deleteUserTrait(handle, 'hobby', tokenV3);
    }
    this.setState({
      showConfirmationHobby: false,
      isHobbyEdit: false,
      indexNoHobby: null,
      isSubmitHobby: false,
    });
  }

  /**
     * Add new hobby
     * @param answer user consent answer value
     */
  onAddHobby(answer) {
    const {
      newHobby, personalizationTrait, hobbyTrait, isHobbyEdit, indexNoHobby,
    } = this.state;

    const {
      handle,
      tokenV3,
      updateUserTrait,
      addUserTrait,
    } = this.props;
    const hobby = _.clone(newHobby);
    if (_.isEmpty(hobby.description)) {
      delete hobby.description;
    }

    // save hobby
    if (hobbyTrait.traits && hobbyTrait.traits.data.length > 0) {
      const newHobbyTrait = _.cloneDeep(hobbyTrait);
      if (isHobbyEdit) {
        newHobbyTrait.traits.data.splice(indexNoHobby, 1);
      }
      newHobbyTrait.traits.data.push(hobby);
      updateUserTrait(handle, 'hobby', newHobbyTrait.traits.data, tokenV3);
    } else {
      const newHobbies = [];
      newHobbies.push(hobby);
      addUserTrait(handle, 'hobby', newHobbies, tokenV3);
    }
    const empty = {
      hobby: '',
      description: '',
    };
    this.setState({
      newHobby: empty,
      isHobbyEdit: false,
      indexNoHobby: null,
      inputChanged: false,
    });

    // save personalization
    if (_.isEmpty(personalizationTrait)) {
      const personalizationData = { userConsent: answer };
      addUserTrait(handle, 'personalization', [personalizationData], tokenV3);
    } else {
      const trait = personalizationTrait.traits.data[0];
      if (trait.userConsent !== answer) {
        const personalizationData = { userConsent: answer };
        updateUserTrait(handle, 'personalization', [personalizationData], tokenV3);
      }
    }
  }

  /**
     * Update input value
     * @param e event
     */
  onUpdateHobbyInput(e) {
    const { newHobby: oldHobby } = this.state;
    const newHobby = { ...oldHobby };
    newHobby[e.target.name] = e.target.value;
    this.setState({ newHobby, isSubmitHobby: false });
  }

  /**
   * Get hobby trait
   * @param userTraits the all user traits
   */
  loadHobbyTrait = (userTraits) => {
    const trait = userTraits.filter(t => t.traitId === 'hobby');
    const hobbys = trait.length === 0 ? {} : trait[0];
    return _.assign({}, hobbys);
  }

  /**
   * Edit hobby by index
   * @param indexNoHobby the hobby index no
   */
  onEditHobby(indexNoHobby) {
    const { hobbyTrait } = this.state;
    this.setState({
      newHobby: {
        hobby: hobbyTrait.traits.data[indexNoHobby].hobby,
        description: _.isEmpty(hobbyTrait.traits.data[indexNoHobby].description) ? '' : hobbyTrait.traits.data[indexNoHobby].description,
      },
      isHobbyEdit: true,
      indexNoHobby,
      formInvalidHobby: false,
      isSubmitHobby: false,
    });
  }

  onCancelEditStatusHobby() {
    const { isHobbyEdit } = this.state;
    if (isHobbyEdit) {
      this.setState({
        isHobbyEdit: false,
        indexNoHobby: null,
        isSubmitHobby: false,
        formInvalidHobby: false,
        newHobby: {
          hobby: '',
          description: '',
        },
      });
    }
  }

  render() {
    const {
      personalDetails, aboutYou, learningAndEducations, hobbies,
    } = PROFILE_SETTINGS;

    const canModifyTrait = !this.props.traitRequestCount;
    if (!canModifyTrait) {
      this.props.setIsSaving(true);
    } else {
      this.props.setIsSaving(false);
    }
    const { lookupData } = this.props;
    const countries = _.get(lookupData, 'countries', []).map(country => ({
      key: country.countryCode,
      name: country.country,
    }));

    const {
      newBasicInfo,
      newProfileInfo,
      inputChanged,
      showConfirmation,
      showConfirmationHobby,
      educationTrait,
      indexNo,
      formInvalid,
      isSubmit,
      isEdit,
      isMobileView,
      startDateInvalid,
      startDateInvalidMsg,
      endDateInvalid,
      endDateInvalidMsg,
      newEducation,
      hobbyTrait,
      isHobbyEdit,
      formInvalidHobby,
      isSubmitHobby,
      newHobby,
      indexNoHobby,
    } = this.state;

    const educationItems = educationTrait.traits
      ? educationTrait.traits.data.slice() : [];

    const hobbyItems = hobbyTrait.traits
      ? hobbyTrait.traits.data.slice() : [];

    return (
      <React.Fragment>
        <div styleName="profile-settings-container">
          <div styleName="header">
            <h3>BASIC INFO</h3>
          </div>
          {
          this.shouldRenderConsent() && this.renderConsent()
          }
          {
            showConfirmation && (
              <ConfirmationModal
                onConfirm={() => this.showConsent(this.onDeleteEducation.bind(this, indexNo))}
                onCancel={() => this.setState({
                  showConfirmation: false,
                  indexNo: null,
                })}
                name={educationTrait.traits.data[indexNo].schoolCollegeName}
              />
            )
          }
          {
            showConfirmationHobby && (
              <ConfirmationModal
                onConfirm={() => this.showConsent(this.onDeleteHobby.bind(this, indexNoHobby))}
                onCancel={() => this.setState({ showConfirmationHobby: false, indexNoHobby: null })}
                name={indexNoHobby ? hobbyTrait.traits.data[indexNoHobby].hobby : ''}
              />
            )
          }

          <ImageInput {...this.props} />

          <SettingsBanner
            title={personalDetails.title}
            description={personalDetails.description}
          >
            <PersonalDetails
              countries={countries}
              canModifyTrait={canModifyTrait}
              newProfileInfo={newProfileInfo}
              newBasicInfo={newBasicInfo}
              onUpdateDate={this.onUpdateDate}
              onUpdateInput={this.onUpdateInput}
              inputChanged={inputChanged}
              onUpdateCountry={this.onUpdateCountry}
            />
          </SettingsBanner>
          <SettingsBanner title={aboutYou.title} description={aboutYou.description}>
            <AboutYou
              canModifyTrait={canModifyTrait}
              newProfileInfo={newProfileInfo}
              newBasicInfo={newBasicInfo}
              onUpdateInput={this.onUpdateInput}
            />
          </SettingsBanner>
          <SettingsBanner
            title={learningAndEducations.title}
            description={learningAndEducations.description}
          >
            {
              educationItems.length > 0
              && (
                <EducationList
                  educationList={{ items: educationItems }}
                  onDeleteItem={this.onHandleDeleteEducation}
                  onEditItem={this.onEditEducation}
                />
              )
            }
            <Learning
              formInvalid={formInvalid}
              isSubmit={isSubmit}
              isEdit={isEdit}
              isMobileView={isMobileView}
              educationItems={educationItems}
              onHandleDeleteEducation={this.onHandleDeleteEducation}
              onEditEducation={this.onEditEducation}
              startDateInvalid={startDateInvalid}
              startDateInvalidMsg={startDateInvalidMsg}
              endDateInvalid={endDateInvalid}
              endDateInvalidMsg={endDateInvalidMsg}
              newEducation={newEducation}
              onUpdateInput={this.onUpdateEducationInput}
              onUpdateDate={this.onUpdateEducationDate}
              onHandleAddEducation={this.onHandleAddEducation}
              onCancelEditStatus={this.onCancelEditStatus}
            />
          </SettingsBanner>
          <SettingsBanner
            title={hobbies.title}
            description={hobbies.description}
          >
            {
              hobbyItems.length > 0
              && (
                <HobbyList
                  hobbyList={{ items: hobbyItems }}
                  onDeleteItem={this.onHandleDeleteHobby}
                  onEditItem={this.onEditHobby}
                />
              )
            }
            <Hobbies
              isMobileView={isMobileView}
              hobbyItems={hobbyItems}
              isEdit={isHobbyEdit}
              onHandleDeleteHobby={this.onHandleDeleteHobby}
              onEditHobby={this.onEditHobby}
              canModifyTrait={canModifyTrait}
              formInvalid={formInvalidHobby}
              isSubmit={isSubmitHobby}
              newHobby={newHobby}
              onUpdateInput={this.onUpdateHobbyInput}
              onHandleAddHobby={this.onHandleAddHobby}
              onCancelEditStatus={this.onCancelEditStatusHobby}
            />
          </SettingsBanner>
        </div>
        <div styleName="footer">
          <PrimaryButton
            disabled={!canModifyTrait}
            onClick={this.onHandleSaveBasicInfo}
            theme={{
              button: style['save-changes-btn'],
            }}
          >
            Save Changes
          </PrimaryButton>
        </div>
      </React.Fragment>
    );
  }
}

ProfileSettings.defaultProps = {
  profile: {},
  isSaving: false,
};

ProfileSettings.propTypes = {
  tokenV3: PT.string.isRequired,
  handle: PT.string.isRequired,
  profile: PT.shape(),
  userTraits: PT.array.isRequired,
  addUserTrait: PT.func.isRequired,
  updateUserTrait: PT.func.isRequired,
  updateProfileV5: PT.func.isRequired,
  traitRequestCount: PT.number.isRequired,
  isSaving: PT.bool,
  setIsSaving: PT.func.isRequired,
};

export default ProfileSettings;
