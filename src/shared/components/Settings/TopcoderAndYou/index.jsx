import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';
import moment from 'moment';

import ConsentComponent from 'components/Settings/ConsentComponent';

import fetch from 'isomorphic-fetch';
import { config } from 'topcoder-react-utils';
import { PrimaryButton } from 'topcoder-react-ui-kit';

import SettingsBanner from '../SettingsBanner';
import Community from './Community';

import style from './styles.scss';

import { TOPCODER_AND_YOU } from '../constants';
import Tracks from './Tracks';

class TopcoderAndYou extends ConsentComponent {
  constructor(props) {
    super(props);

    this.onHandleSaveTopcoderAndYou = this.onHandleSaveTopcoderAndYou.bind(this);
    this.onSaveTopcoderAndYou = this.onSaveTopcoderAndYou.bind(this);
    this.onChange = this.onChange.bind(this);
    this.processBasicInfo = this.processBasicInfo.bind(this);

    this.loadPersonalizationTrait = this.loadPersonalizationTrait.bind(this);

    this.loadCommunityTrait = this.loadCommunityTrait.bind(this);
    this.loadPersonalizationTrait = this.loadPersonalizationTrait.bind(this);
    this.onCommunityChange = this.onCommunityChange.bind(this);

    const { userTraits } = props;
    this.state = {
      inputChanged: false,
      formInvalid: false,
      basicInfoTrait: this.loadBasicInfoTraits(userTraits),
      profile: {},
      isSubmit: false,
      isMobileView: false,
      screenSM: 767,
      isEdit: false,
      indexNo: null,
      showConfirmation: false,
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
      communityTrait: this.loadCommunityTrait(userTraits),
      isAdd: false,
    };
  }

  componentDidMount() {
    const { basicInfoTrait } = this.state;
    const basicInfo = basicInfoTrait.traits ? basicInfoTrait.traits.data[0] : {};
    this.processBasicInfo(basicInfo, this.props.profile);
    this.setState({ profile: this.props.profile });

    const { userTraits } = this.props;
    const trait = userTraits.filter(t => t.traitId === 'communities');
    this.setState({
      isAdd: trait.length === 0,
    });
    this.updatePredicate();
    window.addEventListener('resize', this.updatePredicate);
  }

  componentWillReceiveProps(nextProps) {
    const basicInfoTrait = this.loadBasicInfoTraits(nextProps.userTraits);

    const basicInfo = basicInfoTrait.traits ? basicInfoTrait.traits.data[0] : {};
    const previousBasicInfoTrait = this.loadBasicInfoTraits(this.props.userTraits);


    const { userTraits } = nextProps;
    const trait = userTraits.filter(t => t.traitId === 'communities');
    this.setState({
      isAdd: trait.length === 0,
    });
    const communityTrait = this.loadCommunityTrait(nextProps.userTraits);
    const personalizationTrait = this.loadPersonalizationTrait(nextProps.userTraits);
    this.setState({ communityTrait, personalizationTrait });

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
      personalizationTrait,
      formInvalid: false,
    });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updatePredicate);
  }

  // onCheckFormValue(newBasicInfo, newProfileInfo) {
  //   let invalid = false;

  //   if (!_.trim(newProfileInfo.firstName).length) {
  //     invalid = true;
  //   }

  //   if (!_.trim(newProfileInfo.lastName).length) {
  //     invalid = true;
  //   }

  //   if (!_.trim(newBasicInfo.country).length) {
  //     invalid = true;
  //   }

  //   if (_.trim(newBasicInfo.birthDate).length > 0) {
  //     if (!moment().isAfter(newBasicInfo.birthDate)) {
  //       invalid = true;
  //     }
  //   }

  //   this.setState({ formInvalid: invalid });
  //   return invalid;
  // }

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
  onHandleSaveTopcoderAndYou(e) {
    e.preventDefault();
    const { setIsSaving } = this.props;
    this.setState({ inputChange: true });
    setIsSaving(true);
    this.showConsent(this.onSaveTopcoderAndYou.bind(this));
  }

  /**
   * Save Basic Info
   * @param answer user consent answer value
   */
  async onSaveTopcoderAndYou(answer) {
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
    } catch (error) { // eslint-disable-line
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
   * Show User Consent Modal
   * @param e event
   * @param item the community object
   * @param checked the check value
   */
  onCommunityChange(e, item, checked) {
    e.preventDefault();
    this.showConsent(this.onUpdateCommunity.bind(this, item, checked));
  }

  /**
   * Add or Update CommunityTrait
   */
  onProcessCommunities = _.debounce((answer) => {
    const {
      handle,
      tokenV3,
      updateUserTrait,
      addUserTrait,
    } = this.props;
    const { isAdd, communityTrait, personalizationTrait } = this.state;
    if (isAdd) {
      const newCommunities = [];
      newCommunities.push(communityTrait);
      addUserTrait(handle, 'communities', newCommunities, tokenV3);
    } else {
      const newCommunities = [];
      newCommunities.push(communityTrait);
      updateUserTrait(handle, 'communities', newCommunities, tokenV3);
    }
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
  });

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
   * Change toggle button check value
   * @param answer user consent answer value
   */
  onUpdateCommunity(newCommunity, communityChecked, answer) {
    const { communityTrait } = this.state;
    communityTrait[newCommunity.id] = communityChecked;
    this.setState({
      communityTrait,
    }, () => this.onProcessCommunities(answer));
  }

  /**
   * Get community trait
   * @param userTraits the all user traits
   */
  loadCommunityTrait = (userTraits) => {
    const trait = userTraits.filter(t => t.traitId === 'communities');
    const communities = trait.length === 0 ? {
      cognitive: false,
      blockchain: false,
      veteran: false,
    } : trait[0].traits.data[0];
    return _.assign({}, communities);
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

  updatePredicate() {
    const { screenSM } = this.state;
    this.setState({ isMobileView: window.innerWidth <= screenSM });
  }

  render() {
    const {
      tracks, community,
    } = TOPCODER_AND_YOU;

    const { communityTrait } = this.state;
    const communityItems = communityTrait;

    const {
      newProfileInfo,
    } = this.state;

    return (
      <React.Fragment>
        <div styleName="profile-settings-container">
          <div styleName="header" style={{ marginBottom: '40px' }}>
            <h3>YOU AND TOPCODER</h3>
          </div>
          { this.shouldRenderConsent() && this.renderConsent() }
          <SettingsBanner title={tracks.title} description={tracks.description} row={false}>
            <Tracks
              newProfileInfo={newProfileInfo}
              onChange={this.onChange}
            />
          </SettingsBanner>
          <SettingsBanner title={community.title} row={false}>
            <Community
              communityItems={communityItems}
              onCommunityChange={this.onCommunityChange}
            />
          </SettingsBanner>
        </div>
        <div styleName="footer">
          <PrimaryButton
            onClick={this.onHandleSaveTopcoderAndYou}
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

TopcoderAndYou.defaultProps = {
  profile: {},
  isSaving: false,
};

TopcoderAndYou.propTypes = {
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

export default TopcoderAndYou;
