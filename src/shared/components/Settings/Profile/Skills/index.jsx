/**
 * Child component of Settings/Profile renders "Skills" section of profile setting page.
 */
/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-undef */
import _ from 'lodash';
import path from 'path';
import React from 'react';
import PT from 'prop-types';
import { toastr } from 'react-redux-toastr';
import requireContext from 'require-context';

import Select from 'components/Select';
import { PrimaryButton } from 'topcoder-react-ui-kit';
import UserConsentModal from 'components/Settings/UserConsentModal';
import DevFallbackIcon from 'assets/images/profile/skills/id-develop.svg';
import DesignFallbackIcon from 'assets/images/profile/skills/id-design.svg';
import DataFallbackIcon from 'assets/images/profile/skills/id-data.svg';
import { isomorphy } from 'topcoder-react-utils';

import './styles.scss';

let assets;
if (isomorphy.isClientSide()) {
  // require.context is only available in webpack bundled client code
  assets = require.context('assets/images/profile/skills', false, /svg/);
} else {
  assets = requireContext(path.dirname(require.resolve('assets/images/profile/skills/id-data.svg')), false, /svg/);
}


/**
 * Get image.
 * @param {String} imageFile The image file name
 * @returns {Element} React element
 */
function getImage(imageFile) {
  if (isomorphy.isClientSide()) {
    return <img src={assets(`./${imageFile}`)} alt="Skill Icon" />;
  }
  const Image = assets(imageFile);
  return <Image />;
}

/**
 * Check image exists.
 * @param {String} imageFile The image file name
 * @returns {Boolean} True if image exists; false otherwise
 */
function imageExist(imageFile) {
  if (!assets) {
    return false;
  }
  return (isomorphy.isClientSide() && assets.keys().includes(`./${imageFile}`)) || assets.keys().includes(imageFile);
}

export default class Skills extends React.Component {
  constructor(props) {
    super(props);
    this.onAddSkill = this.onAddSkill.bind(this);
    this.onUpdateSelect = this.onUpdateSelect.bind(this);
    this.toggleSkill = this.toggleSkill.bind(this);
    this.setPage = this.setPage.bind(this);
    this.updatePredicate = this.updatePredicate.bind(this);
    this.onShowUserConsent = this.onShowUserConsent.bind(this);
    this.loadPersonalizationTrait = this.loadPersonalizationTrait.bind(this);

    this.state = {
      formInvalid: false,
      showUserConsent: false,
      personalizationTrait: this.loadPersonalizationTrait(props.userTraits),
      errorMessage: '',
      userSkills: [],
      selectedSkill: {},
      newSkill: {
        design: [],
        development: [],
        dataScience: [],
      },
      indexList: [],
      currentIndex: 0,
      pageSize: 6,
      totalPage: 0,
      isMobileView: false,
      screenSM: 768,
    };
  }

  componentWillMount() {
    this.processUserSkills(this.props);
  }

  componentDidMount() {
    this.updatePredicate();
    window.addEventListener('resize', this.updatePredicate);
  }

  componentWillReceiveProps(nextProps) {
    const personalizationTrait = this.loadPersonalizationTrait(nextProps.userTraits);
    this.setState({
      personalizationTrait,
      formInvalid: false,
      errorMessage: '',
      userSkills: [],
      selectedSkill: {},
      newSkill: {
        design: [],
        development: [],
        dataScience: [],
      },
      indexList: [],
      totalPage: 0,
    });

    this.processUserSkills(nextProps);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updatePredicate);
  }

  /**
   * Show User Consent Modal
   * @param e event
   */
  onShowUserConsent(e) {
    e.preventDefault();
    const { selectedSkill } = this.state;
    if (!selectedSkill.name) {
      this.setState({
        errorMessage: 'Skill can not be empty',
        formInvalid: true,
      });
      return;
    }

    this.setState({
      errorMessage: '',
      formInvalid: false,
      showUserConsent: true,
    });
  }

  /**
   * Update select value
   * @param option selected value
   */
  onUpdateSelect(option) {
    if (option) {
      this.setState({
        selectedSkill: option,
      });
    }
  }

  /**
   * Add new skill
   * @param e form submit event
   * @param answer user consent answer value
   */
  onAddSkill(e, answer) {
    e.preventDefault();
    this.setState({ showUserConsent: false });
    const { newSkill, selectedSkill, personalizationTrait } = this.state;
    const {
      handle,
      tokenV3,
      addUserSkill,
    } = this.props;

    if (!selectedSkill.name) {
      this.setState({
        errorMessage: 'Skill can not be empty',
        formInvalid: true,
      });
      return;
    }

    this.setState({
      errorMessage: '',
      formInvalid: false,
    });

    let category = '';
    switch (selectedSkill.categories[0]) {
      case 'develop':
        category = 'development';
        break;
      case 'data_science':
        category = 'dataScience';
        break;
      default:
        category = 'design';
        break;
    }

    const index = _.findIndex(newSkill[category], skill => (
      skill.toLowerCase() === selectedSkill.name.toLowerCase()
    ));

    if (index > -1) {
      toastr.info('', `You've already added skill "${selectedSkill.name}".`);
      return;
    }

    newSkill[category].push(selectedSkill.name);
    addUserSkill(handle, selectedSkill, tokenV3);
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
   * Update items to display
   */
  setPage(index) {
    const { userSkills, pageSize } = this.state;
    this.setState({
      indexList: userSkills.slice(index * pageSize, index * pageSize + pageSize),
      currentIndex: index,
    });
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
   * Process user skills
   */
  processUserSkills = (props) => {
    const { lookupData, skills } = props;
    const { pageSize, currentIndex } = this.state;

    // All lookup skills
    const lookupSkills = lookupData.skillTags || [];

    // Construct user skills
    const filterUserSkills = [];

    const arraySkill = _.map(skills, (skill, tagId) => ({ tagId: Number(tagId), ...skill }));
    const design = [];
    const development = [];
    const dataScience = [];
    if (arraySkill.length > 0) {
      for (let i = 0; i < arraySkill.length; i += 1) {
        const result = _.filter(lookupSkills, skill => (
          skill.id === arraySkill[i].tagId
        ));
        if (result && result.length > 0) {
          filterUserSkills.push(result[0]);
          if (_.some(result[0].categories, category => category.toLowerCase() === 'design')) {
            design.push(result[0].name);
          }
          if (_.some(result[0].categories, category => category.toLowerCase() === 'develop')) {
            development.push(result[0].name);
          }
          if (_.some(result[0].categories, category => category.toLowerCase() === 'data_science')) {
            dataScience.push(result[0].name);
          }
        }
      }

      const { newSkill } = this.state;
      newSkill.design = design.length > 0 ? design.slice() : [];
      newSkill.development = development.length > 0 ? development.slice() : [];
      newSkill.dataScience = dataScience.length > 0 ? dataScience.slice() : [];
      const totalPage = Math.ceil(filterUserSkills.length / pageSize);
      this.setState({ newSkill, userSkills: filterUserSkills, totalPage });
      if (currentIndex < totalPage) {
        this.setState({
          indexList:
            filterUserSkills.slice(currentIndex * pageSize, currentIndex * pageSize + pageSize),
        });
      } else {
        this.setState({
          indexList: filterUserSkills.slice(0, pageSize),
          currentIndex: 0,
        });
      }
    }
  }

  /**
   * Toggle Skill to delete selected skill
   */
  toggleSkill = (e, skill) => {
    e.preventDefault();
    const { newSkill } = this.state;
    const {
      handle,
      tokenV3,
      deleteUserSkill,
    } = this.props;
    let category = '';
    switch (skill.categories[0]) {
      case 'develop':
        category = 'development';
        break;
      case 'data_science':
        category = 'dataScience';
        break;
      default:
        category = 'design';
        break;
    }
    const result = _.remove(newSkill[category], item => (
      item.toLowerCase() !== skill.name.toLowerCase()
    ));
    newSkill[category] = result.length > 0 ? result.slice() : [];
    deleteUserSkill(handle, skill, tokenV3);
  };

  updatePredicate() {
    const { screenSM } = this.state;
    this.setState({ isMobileView: window.innerWidth <= screenSM });
  }

  render() {
    const {
      lookupData,
      settingsUI,
    } = this.props;

    const {
      showUserConsent,
      userSkills,
      formInvalid,
      errorMessage,
      selectedSkill,
      currentIndex,
      isMobileView,
      totalPage,
      indexList,
    } = this.state;

    const tabs = settingsUI.TABS.PROFILE;
    const currentTab = settingsUI.currentProfileTab;
    const containerStyle = currentTab === tabs.SKILL ? '' : 'hide';
    // All lookup skills
    const lookupSkills = lookupData.skillTags ? _.sortBy(lookupData.skillTags, s => s.name) : [];
    const buttons = userSkills.slice(0, totalPage);
    const list = isMobileView ? indexList : userSkills;

    return (
      <div styleName={containerStyle}>
        {
          showUserConsent && (<UserConsentModal onSaveTrait={this.onAddSkill} />)
        }
        <div styleName={`skill-container ${list.length > 0 ? '' : 'no-skills'}`}>
          <div styleName={`error-message ${formInvalid ? 'active' : ''}`}>
            { errorMessage }
          </div>
          <h1>
            Skill
          </h1>
          <div styleName={`sub-title ${list.length > 0 ? '' : 'hidden'}`}>
            Your skills
          </div>
          <div styleName={`skill-list ${list.length > 0 ? '' : 'hide'}`}>
            <ul>
              {
                _.map(list, (skill) => {
                  let linkStyle = '';
                  if (skill.hidden) {
                    linkStyle = 'skill-hidden';
                  }
                  if (skill.isNew) {
                    linkStyle += ' new';
                  }

                  let FallbackIcon;
                  const category = skill.categories.length > 0 ? skill.categories[0].toUpperCase() : '';
                  switch (category) {
                    case 'DATA_SCIENCE':
                      FallbackIcon = DataFallbackIcon;
                      break;
                    case 'DESIGN':
                      FallbackIcon = DesignFallbackIcon;
                      break;
                    default:
                      FallbackIcon = DevFallbackIcon;
                      break;
                  }

                  return (
                    <li key={skill.id}>
                      <div styleName="skill-tile">
                        <a role="link" onClick={e => this.toggleSkill(e, skill)} styleName={linkStyle}>
                          <div styleName="skill-icon">
                            <div styleName="remove-indicator" />
                            <div styleName="hidden-indicator" />
                            { imageExist(`id-${skill.id}.svg`) ? getImage(`id-${skill.id}.svg`) : <FallbackIcon /> }
                          </div>
                          <div styleName="name">
                            {_.truncate(skill.name, { length: 18, separator: ' ' })}
                          </div>
                        </a>
                      </div>
                    </li>
                  );
                })
              }
            </ul>
          </div>
          <div styleName={`sub-title ${list.length > 0 ? 'second' : 'first'}`}>
            Add a new skill
          </div>
          <div styleName="form-container-default">
            <form name="device-form" noValidate autoComplete="off">
              <div styleName="row">
                <div styleName="field col-1">
                  <label htmlFor="skill">
                    Skill
                  </label>
                </div>
                <div styleName="field col-2">
                  <span styleName="text-required">* Required</span>
                  <Select
                    name="skills"
                    options={lookupSkills}
                    onChange={this.onUpdateSelect}
                    placeholder="Start typing a skill then select from the list"
                    matchPos="start"
                    matchProp="name"
                    labelKey="name"
                    valueKey="name"
                    clearable={false}
                    value={selectedSkill.name}
                  />
                </div>
              </div>
            </form>
            <div styleName="button-save">
              <PrimaryButton
                styleName="complete"
                onClick={this.onShowUserConsent}
              >
                Add skill to your list
              </PrimaryButton>
            </div>
          </div>
          <div styleName={`form-container-mobile ${list.length > 0 ? '' : 'no-skills'}`}>
            <form name="skill-form" noValidate autoComplete="off">
              <div styleName="row">
                <p>
                  Add Skill
                </p>
              </div>
              <div styleName="row">
                <div styleName="field">
                  <label htmlFor="skills">
                    Skill
                  </label>
                  <Select
                    name="skills"
                    options={lookupSkills}
                    onChange={this.onUpdateSelect}
                    placeholder="Start typing a skill then select from the list"
                    matchPos="start"
                    matchProp="name"
                    labelKey="name"
                    valueKey="name"
                    clearable={false}
                    value={selectedSkill.name}
                  />
                </div>
              </div>
            </form>
            <div styleName="button-save">
              <PrimaryButton
                styleName="complete"
                onClick={this.onShowUserConsent}
              >
                Add Skill
              </PrimaryButton>
            </div>
          </div>
          {
            isMobileView && (
              <div styleName={`mobile-buttons ${list.length > 0 ? '' : 'hide'}`}>
                {
                  buttons.map((item, index) => (
                    <span
                      tabIndex="0"
                      key={item.id}
                      onClick={() => this.setPage(index)}
                      onKeyPress={() => this.setPage(index)}
                      role="button"
                      styleName={`mobile-button ${currentIndex === index ? 'mobile-active' : ''}`}
                    />
                  ))
                }
              </div>
            )
          }
        </div>
      </div>
    );
  }
}

Skills.defaultProps = {
  skills: {},
};

Skills.propTypes = {
  handle: PT.string.isRequired,
  tokenV3: PT.string.isRequired,
  lookupData: PT.shape().isRequired,
  addUserSkill: PT.func.isRequired,
  deleteUserSkill: PT.func.isRequired,
  /* eslint-disable react/no-unused-prop-types */
  skills: PT.shape(),
  /* eslint-disable react/no-unused-prop-types */
  settingsUI: PT.shape().isRequired,
  userTraits: PT.array.isRequired,
};
