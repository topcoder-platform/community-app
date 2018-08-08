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

    this.state = {
      formInvalid: false,
      errorMessage: '',
      skillTrait: this.loadSkillTrait(props.userTraits),
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
    const skillTrait = this.loadSkillTrait(nextProps.userTraits);
    this.setState({
      skillTrait,
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
   */
  onAddSkill(e) {
    e.preventDefault();
    const { newSkill, selectedSkill } = this.state;
    const {
      handle,
      tokenV3,
      updateUserTrait,
      addUserTrait,
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

    const { skillTrait } = this.state;
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
    if (skillTrait.traits && skillTrait.traits.data.length > 0) {
      const newSkillTrait = { ...skillTrait };
      newSkillTrait.traits.data = [];
      newSkillTrait.traits.data.push(newSkill);
      this.setState({ skillTrait: newSkillTrait });
      updateUserTrait(handle, 'skill', newSkillTrait.traits.data, tokenV3);
    } else {
      const newSkills = [];
      newSkills.push(newSkill);
      const traits = {
        data: newSkills,
      };
      this.setState({ skillTrait: { traits } });
      addUserTrait(handle, 'skill', newSkills, tokenV3);
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
   * Get skill trait
   * @param userTraits the all user traits
   */
  loadSkillTrait = (userTraits) => {
    const trait = userTraits.filter(t => t.traitId === 'skill');
    const skills = trait.length === 0 ? {} : trait[0];
    return _.assign({}, skills);
  }

  /**
   * Process user skills
   */
  processUserSkills = (props) => {
    const { lookupData, userTraits } = props;
    const { pageSize, currentIndex } = this.state;
    const skillTrait = this.loadSkillTrait(userTraits);
    // All lookup skills
    const lookupSkills = lookupData.skillTags || [];

    // Construct user skills
    const userSkills = [];
    const design = [];
    const development = [];
    const dataScience = [];
    const skills = skillTrait.traits ? skillTrait.traits.data.slice() : [];
    if (skills.length > 0) {
      for (let i = 0; i < skills[0].design.length; i += 1) {
        const result = _.filter(lookupSkills, skill => (
          skill.name.toLowerCase() === skills[0].design[i].toLowerCase()
        ));
        if (result && result.length > 0) {
          userSkills.push(result[0]);
          design.push(result[0].name);
        }
      }
      for (let i = 0; i < skills[0].development.length; i += 1) {
        const result = _.filter(lookupSkills, skill => (
          skill.name.toLowerCase() === skills[0].development[i].toLowerCase()
        ));
        if (result && result.length > 0) {
          userSkills.push(result[0]);
          development.push(result[0].name);
        }
      }
      for (let i = 0; i < skills[0].dataScience.length; i += 1) {
        const result = _.filter(lookupSkills, skill => (
          skill.name.toLowerCase() === skills[0].dataScience[i].toLowerCase()
        ));
        if (result && result.length > 0) {
          userSkills.push(result[0]);
          dataScience.push(result[0].name);
        }
      }

      const { newSkill } = this.state;
      newSkill.design = design.length > 0 ? design.slice() : [];
      newSkill.development = development.length > 0 ? development.slice() : [];
      newSkill.dataScience = dataScience.length > 0 ? dataScience.slice() : [];
      const totalPage = Math.ceil(userSkills.length / pageSize);
      this.setState({ newSkill, userSkills, totalPage });
      if (currentIndex < totalPage) {
        this.setState({
          indexList: userSkills.slice(currentIndex * pageSize, currentIndex * pageSize + pageSize),
        });
      } else {
        this.setState({
          indexList: userSkills.slice(0, pageSize),
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
    const { newSkill, skillTrait } = this.state;
    const {
      handle,
      tokenV3,
      updateUserTrait,
      deleteUserTrait,
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
    if (newSkill.design.length === 0
      && newSkill.development.length === 0
      && newSkill.dataScience.length === 0) {
      deleteUserTrait(handle, 'skill', tokenV3);
    } else {
      skillTrait.traits.data = [];
      skillTrait.traits.data.push(newSkill);
      updateUserTrait(handle, 'skill', skillTrait.traits.data, tokenV3);
    }
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
    const lookupSkills = lookupData.skillTags || [];
    const buttons = userSkills.slice(0, totalPage);
    const list = isMobileView ? indexList : userSkills;

    return (
      <div styleName={containerStyle}>
        <div styleName={`skill-container ${list.length > 0 ? '' : 'no-skills'}`}>
          <div styleName={`error-message ${formInvalid ? 'active' : ''}`}>
            { errorMessage }
          </div>
          <h1>
            Skill
          </h1>
          <div styleName={`form-container ${list.length > 0 ? '' : 'no-skills'}`}>
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
                onClick={this.onAddSkill}
              >
                Add Skill
              </PrimaryButton>
            </div>
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

Skills.propTypes = {
  handle: PT.string.isRequired,
  tokenV3: PT.string.isRequired,
  lookupData: PT.shape().isRequired,
  addUserTrait: PT.func.isRequired,
  updateUserTrait: PT.func.isRequired,
  deleteUserTrait: PT.func.isRequired,
  userTraits: PT.array.isRequired,
  settingsUI: PT.shape().isRequired,
};
