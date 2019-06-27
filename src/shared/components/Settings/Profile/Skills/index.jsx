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
import ReactTouchEvents from 'react-touch-events';
import requireContext from 'require-context';

import Select from 'components/Select';
import { PrimaryButton } from 'topcoder-react-ui-kit';
import ConsentComponent from 'components/Settings/ConsentComponent';
import ErrorMessage from 'components/Settings/ErrorMessage';
import DevFallbackIcon from 'assets/images/profile/skills/id-develop.svg';
import DesignFallbackIcon from 'assets/images/profile/skills/id-design.svg';
import DataFallbackIcon from 'assets/images/profile/skills/id-data.svg';
import VerifiedBadgeIcon from 'assets/images/verified-skill-badge.svg';
import { isomorphy } from 'topcoder-react-utils';
import ConfirmationModal from '../../CofirmationModal';

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

export default class Skills extends ConsentComponent {
  constructor(props) {
    super(props);
    this.onHandleAddSkill = this.onHandleAddSkill.bind(this);
    this.onHandleDeleteSkill = this.onHandleDeleteSkill.bind(this);
    this.onAddSkill = this.onAddSkill.bind(this);
    this.onUpdateSelect = this.onUpdateSelect.bind(this);
    this.toggleSkill = this.toggleSkill.bind(this);
    this.setPage = this.setPage.bind(this);
    this.updatePredicate = this.updatePredicate.bind(this);
    this.loadPersonalizationTrait = this.loadPersonalizationTrait.bind(this);
    this.handleSwipe = this.handleSwipe.bind(this);
    this.lastValidInputPosition = 0;
    this.handleScroll = this.handleScroll.bind(this);
    this.handleInputRef = this.handleInputRef.bind(this);

    const { userTraits } = props;
    this.state = {
      formInvalid: false,
      personalizationTrait: this.loadPersonalizationTrait(userTraits),
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
      screenSM: 767,
      deleteSkill: null,
      deleteSelector: null,
      showConfirmation: false,
      inputChanged: false,
    };
  }

  componentWillMount() {
    this.processUserSkills(this.props);
  }

  componentDidMount() {
    this.updatePredicate();
    window.addEventListener('resize', this.updatePredicate);
    if (this.isIos()) {
      window.addEventListener('scroll', this.handleScroll);
    }
  }

  componentDidUpdate() {
    this.removeHover();
  }

  componentWillReceiveProps(nextProps) {
    const personalizationTrait = this.loadPersonalizationTrait(nextProps.userTraits);
    this.setState({
      personalizationTrait,
      formInvalid: false,
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
    if (this.isIos()) {
      window.removeEventListener('scroll', this.handleScroll);
    }
  }

  /**
   * Show User Consent Modal
   * @param e event
   */
  onHandleAddSkill(e) {
    e.preventDefault();
    this.setState({ inputChanged: true });
    const { selectedSkill } = this.state;
    if (!selectedSkill.name) {
      this.setState({
        formInvalid: true,
      });
      return;
    }

    this.setState({
      formInvalid: false,
    });
    this.showConsent(this.onAddSkill.bind(this));
  }

  /**
   * Update select value
   * @param option selected value
   */
  onUpdateSelect(option) {
    if (option) {
      this.setState({
        selectedSkill: option,
        inputChanged: true,
      });
    }
  }

  /**
   * Add new skill
   * @param answer user consent answer value
   */
  onAddSkill(answer) {
    const { newSkill, selectedSkill, personalizationTrait } = this.state;
    const {
      handle,
      tokenV3,
      addUserSkill,
    } = this.props;

    if (!selectedSkill.name) {
      this.setState({
        formInvalid: true,
      });
      return;
    }

    this.setState({
      formInvalid: false,
      inputChanged: false,
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

  /*
    handle swipe in the skills section on mobile
   */
  handleSwipe(direction) {
    const { isMobileView, totalPage, currentIndex } = this.state;

    if (isMobileView) {
      switch (direction) {
        case 'right':
          if (currentIndex > 0) {
            this.setPage(currentIndex - 1);
          }
          break;

        case 'left':
          if (currentIndex < totalPage - 1) {
            this.setPage(currentIndex + 1);
          }
          break;

        default:
          break;
      }
    }
  }

  onHandleDeleteSkill(skill, selector) {
    this.setState({
      showConfirmation: true,
      deleteSkill: skill,
      deleteSelector: selector,
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
          result[0].sources = arraySkill[i].sources;
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

  isIos = () => (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream);


  removeHover = () => {
    setTimeout(() => {
      const btn = document.querySelector('a:hover');
      if (btn && this.selectedElement !== btn) {
        const par = btn.parentNode;
        const next = btn.nextSibling;
        par.removeChild(btn);
        setTimeout(() => { par.insertBefore(btn, next); }, 0);
      }
      if (!btn) {
        this.selectedElement = null;
      }
    }, 100);
  }

  /**
   * Toggle Skill to delete selected skill
   */
  toggleSkill = (e, skill, selector) => {
    const skillElement = document.querySelector(selector);
    if (this.selectedElement !== skillElement && this.isIos()) {
      this.selectedElement = skillElement;
      return;
    }
    this.selectedElement = skillElement;

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
    this.setState({
      deleteSkill: null,
      deleteSelector: null,
      showConfirmation: false,
      inputChanged: false,
    });
  };

  updatePredicate() {
    const { screenSM } = this.state;
    this.setState({ isMobileView: window.innerWidth <= screenSM });
  }

  handleScroll() {
    if (this.lastValidInputPosition === 0) {
      this.lastValidInputPosition = window.scrollY;
    }
  }

  handleInputRef(ref) {
    if (!this.isIos()) {
      return;
    }
    this.inputRef = ref;
    const keyPress = () => {
      window.scroll(0, this.lastValidInputPosition);
    };
    this.inputRef.control.onkeydown = keyPress;
    const input = this.inputRef.control.getElementsByTagName('input');
    input[0].onfocus = () => {
      this.lastValidInputPosition = 0;
    };
  }

  render() {
    const {
      lookupData,
      settingsUI,
    } = this.props;

    const {
      userSkills,
      selectedSkill,
      currentIndex,
      isMobileView,
      totalPage,
      indexList,
      showConfirmation,
      deleteSkill,
      deleteSelector,
      inputChanged,
      formInvalid,
    } = this.state;

    const canModifyTrait = !this.props.traitRequestCount;
    const tabs = settingsUI.TABS.PROFILE;
    const currentTab = settingsUI.currentProfileTab;
    const containerStyle = currentTab === tabs.SKILL ? '' : 'hide';
    // All lookup skills
    const allSkills = lookupData.skillTags ? lookupData.skillTags : [];
    const buttons = userSkills.slice(0, totalPage);
    let list = isMobileView ? indexList : userSkills;
    list = _.orderBy(list, [skill => skill.name.toLowerCase()], ['asc']); // Use Lodash to sort array by 'name'

    // filter out already added skills
    const lookupSkills = _.sortBy(
      _.filter(allSkills, skill => _.findIndex(userSkills, l => l.id === skill.id) === -1),
      s => s.name,
    );

    return (
      <div styleName={containerStyle}>
        {
          this.shouldRenderConsent() && this.renderConsent()
        }
        {
          showConfirmation && (
            <ConfirmationModal
              onConfirm={() => this.showConsent(this.toggleSkill
                .bind(this, deleteSkill, deleteSelector))}
              onCancel={() => this.setState({
                showConfirmation: false,
                deleteSkill: null,
                deleteSelector: null,
              })}
              name={deleteSelector.name}
            />
          )
        }
        <div styleName={`skill-container ${list.length > 0 ? '' : 'no-skills'}`}>
          <h1>
            Skill
          </h1>
          <div styleName={`sub-title ${list.length > 0 ? '' : 'hidden'}`}>
            Your skills
          </div>
          <div styleName={`skill-list ${list.length > 0 ? '' : 'hide'}`}>
            <ReactTouchEvents
              onSwipe={this.handleSwipe}
            >
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
                          <a
                            id={`skill-a-${skill.id}`}
                            role="link"
                            onClick={e => this.onHandleDeleteSkill(e, skill, `#skill-a-${skill.id}`)}
                            styleName={linkStyle}
                          >
                            <div styleName="skill-icon">
                              <div styleName="remove-indicator" />
                              <div styleName="hidden-indicator" />
                              { imageExist(`id-${skill.id}.svg`) ? getImage(`id-${skill.id}.svg`) : <FallbackIcon /> }
                            </div>
                          </a>
                          <div styleName="name-wrapper">
                            <div styleName="name">
                              {_.truncate(skill.name, { length: 18, separator: ' ' })}
                            </div>
                            {_.includes(skill.sources, 'CHALLENGE') && <div styleName="verified-badge"><VerifiedBadgeIcon /></div> }
                          </div>
                        </div>
                      </li>
                    );
                  })
                }
              </ul>
            </ReactTouchEvents>
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
          <div styleName={`sub-title ${list.length > 0 ? 'second' : 'first'}`}>
            Add a new skill
          </div>
          <div styleName="form-container-default">
            <form name="device-form" noValidate autoComplete="off">
              <div styleName="row">
                <div styleName="field col-1">
                  <label htmlFor="skill">
                    Skill
                    <input type="hidden" />
                  </label>
                </div>
                <div styleName="field col-2">
                  <span styleName="text-required">* Required</span>
                  <Select
                    selectRef={this.handleInputRef}
                    name="skills"
                    options={lookupSkills}
                    onChange={this.onUpdateSelect}
                    placeholder="Start typing a skill then select from the list"
                    matchPos="any"
                    matchProp="name"
                    labelKey="name"
                    valueKey="name"
                    clearable={false}
                    value={selectedSkill.name}
                    disabled={!canModifyTrait}
                  />
                  <ErrorMessage invalid={_.isEmpty(selectedSkill.name) && formInvalid} addMargin message="Skill cannot be empty" />
                </div>
              </div>
            </form>
            <div styleName="button-save">
              <PrimaryButton
                styleName="complete"
                onClick={this.onHandleAddSkill}
                disabled={!canModifyTrait}
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
                    <span styleName="text-required">* Required</span>
                    <input type="hidden" />
                  </label>
                  <Select
                    selectRef={this.handleInputRef}
                    name="skills"
                    options={lookupSkills}
                    onChange={this.onUpdateSelect}
                    placeholder="Start typing a skill then select from the list"
                    matchPos="any"
                    matchProp="name"
                    labelKey="name"
                    valueKey="name"
                    clearable={false}
                    value={selectedSkill.name}
                    disabled={!canModifyTrait}
                  />
                  <ErrorMessage invalid={_.isEmpty(selectedSkill.name) && inputChanged} addMargin message="Skill cannot be empty" />
                </div>
              </div>
            </form>
            <div styleName="button-save">
              <PrimaryButton
                styleName="complete"
                onClick={this.onHandleAddSkill}
                disabled={!canModifyTrait}
              >
                Add Skill
              </PrimaryButton>
            </div>
          </div>
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
  traitRequestCount: PT.number.isRequired,
};
