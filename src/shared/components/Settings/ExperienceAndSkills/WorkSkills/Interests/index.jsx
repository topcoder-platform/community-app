/**
 * Child component of Settings/Profile/ renders the
 * 'Basic Info' page.
 */

import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';
import fetch from 'isomorphic-fetch';
import { config } from 'topcoder-react-utils';
import ConsentComponent from 'components/Settings/ConsentComponent';
import { SettingBannerV2 as Collapse } from 'components/Settings/SettingsBanner';
import { INTERESTS_AT_TOPCODER } from '../../../constants';
import './styles.scss';

export default class Interests extends ConsentComponent {
  constructor(props) {
    super(props);

    this.save = this.save.bind(this);
    this.processBasicInfo = this.processBasicInfo.bind(this);
    this.loadInterests = this.loadInterests.bind(this);
    this.updateInterest = this.updateInterest.bind(this);

    const { userTraits } = props;
    this.state = {
      allInterestData: INTERESTS_AT_TOPCODER,
      interestData: [],
      basicInfoTrait: this.loadBasicInfoTraits(userTraits),
      profile: {},
      newBasicInfo: {
        primaryInterestInTopcoder: '',
      },
    };

    this.previousInterestData = null;
  }

  componentDidMount() {
    const { basicInfoTrait } = this.state;
    const basicInfo = basicInfoTrait.traits ? basicInfoTrait.traits.data[0] : {};
    this.processBasicInfo(basicInfo, this.props.profile);
    this.setState({ profile: this.props.profile });
  }

  componentWillReceiveProps(nextProps) {
    const basicInfoTrait = this.loadBasicInfoTraits(nextProps.userTraits);

    const basicInfo = basicInfoTrait.traits ? basicInfoTrait.traits.data[0] : {};
    const previousBasicInfoTrait = this.loadBasicInfoTraits(this.props.userTraits);

    if (!_.isEqual(basicInfoTrait, previousBasicInfoTrait)) {
      this.processBasicInfo(basicInfo, nextProps.profile);
      this.setState({
        basicInfoTrait,
      });
    }
    if (!_.isEqual(this.state.profile, nextProps.profile)) {
      this.processBasicInfo(basicInfo, nextProps.profile);
      this.setState({ profile: nextProps.profile });
    }
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
   * Show User Consent Modal
   * @param {*} e event
   */
  save() {
    this.setState({ isSaving: true });
    this.showConsent(this.onSave.bind(this));
  }

  /**
   * Save Basic Info
   * @param answer user consent answer value
   */
  async onSave(/* answer */) {
    const {
      newBasicInfo, basicInfoTrait,
    } = this.state;
    const {
      handle,
      tokenV3,
      addUserTrait,
      updateUserTrait,
    } = this.props;

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

    this.setState({ isSaving: false });
    this.previousInterestData = null;
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
    const { newBasicInfo } = this.state;
    if (_.has(profile, 'handle')) {
      Object.keys(/* newBasicInfo */value).reduce((acc, key) => {
        // if (_.has(value, key)) {
        newBasicInfo[key] = value[key];
        // }
        return acc;
      }, {});
    }
    this.setState({ newBasicInfo }, () => {
      this.loadInterests();
    });
  }

  loadInterests() {
    const { newBasicInfo: { primaryInterestInTopcoder }, allInterestData } = this.state;

    const isValid = i => allInterestData.indexOf(i) !== -1;
    const isNotDeduplicated = (i, index, array) => array.indexOf(i) === index;
    const compareByIndex = (a, b) => allInterestData.indexOf(a) - allInterestData.indexOf(b);

    const interestData = primaryInterestInTopcoder
      .split(',')
      .map(i => i.trim())
      .filter(isValid)
      .filter(isNotDeduplicated)
      .sort(compareByIndex);

    this.setState({ interestData });
  }

  updateInterest(item) {
    const { interestData, newBasicInfo, allInterestData } = this.state;

    let updated;
    if (interestData.indexOf(item) !== -1) {
      updated = interestData.filter(i => i !== item);
    } else {
      updated = [...interestData, item].sort(
        (a, b) => allInterestData.indexOf(a) - allInterestData.indexOf(b),
      );
    }

    const primaryInterestInTopcoder = updated.join(',');
    this.setState({
      interestData: updated,
      newBasicInfo: { ...newBasicInfo, primaryInterestInTopcoder },
    });

    this.previousInterestData = interestData;
  }

  render() {
    const { interestData, allInterestData } = this.state;
    const canModifyTrait = !this.props.traitRequestCount;
    const isSelected = item => interestData.indexOf(item) !== -1;

    return (
      <div styleName="form-container">
        <Collapse>
          <div styleName="form-title">
            Select Your Interests at Topcoder
          </div>
          <div styleName="form-content">
            <div styleName="form-label">
              What do you want to do at Topcoder? Compete? Learn? Earn extra money?
              Get a full time gig? There are no wrong answers.
            </div>
            <form styleName="form-body" name="primaryInterestInTopcoder-form">
              <div styleName="interestList">
                { allInterestData.map(item => (
                  <span
                    key={item}
                    role="button"
                    styleName={`interestListItem ${isSelected(item) ? 'selected' : ''}`}
                    onClick={() => canModifyTrait && this.updateInterest(item)}
                    tabIndex={0}
                    onKeyDown={() => {}}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </form>
          </div>
        </Collapse>
      </div>
    );
  }
}

Interests.propTypes = {
  tokenV3: PT.string.isRequired,
  handle: PT.string.isRequired,
  profile: PT.shape().isRequired,
  userTraits: PT.array.isRequired,
  addUserTrait: PT.func.isRequired,
  updateUserTrait: PT.func.isRequired,
  traitRequestCount: PT.number.isRequired,
};
