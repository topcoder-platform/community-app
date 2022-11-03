/**
 * Child component of Settings/Profile renders "Skills" section of profile setting page.
 */
/* global analytics */

import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';
import { PrimaryButton } from 'topcoder-react-ui-kit';
import ConsentComponent from 'components/Settings/ConsentComponent';

import VerifiedBadgeIcon from 'assets/images/verified-skill-badge-green.svg';
import ConfirmationModal from 'components/Settings/ConfirmationModal';
import AddItemIcon from 'assets/images/settings-add-item.svg';
import RemoveTagIcon from 'assets/images/icon-x-cancel.svg';
import { SettingBannerV2 as Collapse } from 'components/Settings/SettingsBanner';
import AddSkillsModal from './AddSkillsModal';

import styles from './styles.scss';


export default class Skills extends ConsentComponent {
  constructor(props) {
    super(props);
    this.onHandleAddSkill = this.onHandleAddSkill.bind(this);
    this.onHandleDeleteSkills = this.onHandleDeleteSkills.bind(this);
    this.onAddSkill = this.onAddSkill.bind(this);
    this.toggleSkill = this.toggleSkill.bind(this);
    this.loadPersonalizationTrait = this.loadPersonalizationTrait.bind(this);
    this.lastValidInputPosition = 0;
    this.setEditingSkills = this.setEditingSkills.bind(this);
    this.onModalClose = this.onModalClose.bind(this);
    this.onModalSave = this.onModalSave.bind(this);

    const { userTraits } = props;
    this.state = {
      personalizationTrait: this.loadPersonalizationTrait(userTraits),
      userSkills: [],
      editingSkills: [],
      newSkill: {
        design: [],
        develop: [],
        data_science: [],
        qa: [],
      },
      skillsToDelete: null,
      showConfirmation: false,
      showAddSkillsModal: null,
    };
  }

  componentWillMount() {
    this.processUserSkills(this.props);
  }

  componentDidUpdate() {
    this.removeHover();
  }

  componentWillReceiveProps(nextProps) {
    const personalizationTrait = this.loadPersonalizationTrait(nextProps.userTraits);
    this.setState({
      personalizationTrait,
      userSkills: [],
      editingSkills: [],
      newSkill: {
        design: [],
        develop: [],
        data_science: [],
        qa: [],
      },
    });

    this.processUserSkills(nextProps);
  }

  /**
   * Show User Consent Modal
   * @param e event
   */
  onHandleAddSkill(selectedSkill) {
    this.showConsent(this.onAddSkill.bind(this, selectedSkill));
  }

  setEditingSkills(updatedEdittingSkills) {
    this.setState({
      editingSkills: updatedEdittingSkills,
    });
  }

  /**
   * Add new skill
   * @param answer user consent answer value
   */
  onAddSkill(selectedSkill, answer) {
    const { newSkill, personalizationTrait } = this.state;
    const {
      handle,
      tokenV3,
      addUserSkill,
      addUserTrait,
      updateUserTrait,
    } = this.props;

    let category = '';
    switch (selectedSkill.categories[0]) {
      case 'develop':
        category = 'develop';
        break;
      case 'data_science':
        category = 'data_science';
        break;
      case 'design':
        category = 'design';
        break;
      case 'qa':
        category = 'qa';
        break;
      default:
        category = 'design';
        break;
    }

    const index = _.findIndex(newSkill[category], skill => (
      skill.name.toLowerCase() === selectedSkill.name.toLowerCase()
    ));

    if (index > -1) {
      return;
    }

    newSkill[category].push(selectedSkill);
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

  onHandleDeleteSkills(skill) {
    const skillsToDelete = Array.isArray(skill) ? skill : [skill];
    this.setState({
      showConfirmation: true,
      skillsToDelete,
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

    // All lookup skills
    const lookupSkills = lookupData.skillTags || [];

    // Construct user skills
    const filterUserSkills = [];

    const arraySkill = _.map(skills, (skill, tagId) => ({ tagId: Number(tagId), ...skill }));
    const design = [];
    const develop = [];
    const dataScience = [];
    const qa = [];
    if (arraySkill.length > 0) {
      for (let i = 0; i < arraySkill.length; i += 1) {
        const result = _.filter(lookupSkills, skill => (
          skill.id === arraySkill[i].tagId
        ));
        if (result && result.length > 0) {
          result[0].sources = arraySkill[i].sources;
          filterUserSkills.push(result[0]);
          if (_.some(result[0].categories, category => category.toLowerCase() === 'design')) {
            design.push(result[0]);
          }
          if (_.some(result[0].categories, category => category.toLowerCase() === 'develop')) {
            develop.push(result[0]);
          }
          if (_.some(result[0].categories, category => category.toLowerCase() === 'data_science')) {
            dataScience.push(result[0]);
          }
          if (_.some(result[0].categories, category => category.toLowerCase() === 'qa')) {
            qa.push(result[0]);
          }
        }
      }

      const { newSkill } = this.state;
      newSkill.design = design.length > 0 ? design.slice() : [];
      newSkill.develop = develop.length > 0 ? develop.slice() : [];
      newSkill.data_science = dataScience.length > 0 ? dataScience.slice() : [];
      newSkill.qa = qa.length > 0 ? qa.slice() : [];

      this.setState({ newSkill, userSkills: filterUserSkills });
    }
  }

  removeHover = () => {
    setTimeout(() => {
      const btn = document.querySelector('a:hover');
      if (btn) {
        const par = btn.parentNode;
        const next = btn.nextSibling;
        par.removeChild(btn);
        setTimeout(() => { par.insertBefore(btn, next); }, 0);
      }
    }, 100);
  }

  /**
   * Toggle Skill to delete selected skill
   */
  toggleSkill = (skillsToDelete/* , consentAnswer */) => {
    const { newSkill } = this.state;
    const {
      handle,
      tokenV3,
      deleteUserSkill,
    } = this.props;

    skillsToDelete.forEach((skill) => {
      let category = '';
      switch (skill.categories[0]) {
        case 'develop':
          category = 'develop';
          break;
        case 'data_science':
          category = 'data_science';
          break;
        case 'design':
          category = 'design';
          break;
        case 'qa':
          category = 'qa';
          break;
        default:
          category = 'design';
          break;
      }
      const result = _.remove(newSkill[category], item => (
        item.name.toLowerCase() !== skill.name.toLowerCase()
      ));
      newSkill[category] = result.length > 0 ? result.slice() : [];
      deleteUserSkill(handle, skill, tokenV3);
    });

    this.setState({
      skillsToDelete: null,
      showConfirmation: false,
    });
  };

  onModalClose() {
    this.setState({ showAddSkillsModal: null });
  }

  onModalSave() {
    this.onModalClose();

    const { userSkills, editingSkills } = this.state;

    const diffAdd = (target, source) => target.filter(t => !source.find(s => s.id === t.id));
    const diffRemove = (target, source) => source.filter(s => !target.find(t => t.id === s.id));

    const toAdd = diffAdd(editingSkills, userSkills);
    const toRemove = diffRemove(editingSkills, userSkills);

    toAdd.forEach(skill => this.onAddSkill(skill));
    if (toRemove.length) {
      this.onHandleDeleteSkills(toRemove);
    }

    // track the CTA event
    analytics.track('Member clicked "Save" on skills picker', {
      handle: this.props.handle,
      newSkill: this.state.newSkill,
    });
  }

  render() {
    const {
      lookupData,
    } = this.props;

    const {
      userSkills,
      showConfirmation,
      skillsToDelete,
      editingSkills,
      showAddSkillsModal,
    } = this.state;

    const canModifyTrait = !this.props.traitRequestCount;
    // All lookup skills
    const allSkills = lookupData.skillTags ? lookupData.skillTags : [];
    let list = userSkills;
    list = _.orderBy(list, [skill => skill.name.toLowerCase()], ['asc']); // Use Lodash to sort array by 'name'

    // // filter out already added skills
    const lookupSkills = _.sortBy(
      _.filter(allSkills, skill => _.findIndex(userSkills, l => l.id === skill.id) === -1),
      s => s.name,
    );

    const skillList = (
      <ul styleName="skillList">
        {
          _.map(list, skill => (
            <li key={skill.id} styleName="skillListItem">
              {_.includes(skill.sources, 'CHALLENGE') && <VerifiedBadgeIcon styleName="verified-badge" /> }
              {_.truncate(skill.name, { length: 18, separator: ' ' })}
              <a
                id={`skill-a-${skill.id}`}
                role="link"
                onClick={(e) => {
                  e.preventDefault();
                  this.onHandleDeleteSkills(skill);
                }}
                styleName="close"
                tabIndex={0}
                onKeyDown={() => {}}
              >
                <RemoveTagIcon />
              </a>
            </li>
          ))
        }
      </ul>
    );

    return (
      <React.Fragment>
        {
          this.shouldRenderConsent() && this.renderConsent()
        }
        {
          showConfirmation && (
            <ConfirmationModal
              onConfirm={() => this.showConsent(this.toggleSkill
                .bind(this, skillsToDelete))}
              onCancel={() => this.setState({
                showConfirmation: false,
                skillsToDelete: null,
              })}
              name={skillsToDelete.map(s => s.name).join(', ')}
            />
          )
        }
        { showAddSkillsModal && (
          <AddSkillsModal
            allSkills={allSkills}
            lookupSkills={lookupSkills}
            userSkills={userSkills}
            disabled={!canModifyTrait}
            setEditingSkills={this.setEditingSkills}
            editingSkills={editingSkills}
            category={showAddSkillsModal}
            onClose={this.onModalClose}
            onSave={this.onModalSave}
          />
        )}

        <div styleName="form-container">
          <Collapse>
            <h2 styleName="form-title">
              Add your skills
            </h2>

            <div styleName="form-content">
              <div styleName="form-label">
                Add skills to your profile. You can add or update your skills any time.
              </div>

              <div styleName="form-body">
                {skillList}
              </div>

              <div styleName="form-footer">
                <PrimaryButton
                  onClick={() => this.setState({ showAddSkillsModal: 'design' })}
                  disabled={!canModifyTrait}
                  theme={{ button: styles['button-add'] }}
                >
                  <AddItemIcon styleName="icon" /> Add Design / UX Skills
                </PrimaryButton>

                <PrimaryButton
                  onClick={() => this.setState({ showAddSkillsModal: 'develop' })}
                  disabled={!canModifyTrait}
                  theme={{ button: styles['button-add'] }}
                >
                  <AddItemIcon styleName="icon" /> Add Developer Skills
                </PrimaryButton>

                <PrimaryButton
                  onClick={() => this.setState({ showAddSkillsModal: 'data_science' })}
                  disabled={!canModifyTrait}
                  theme={{ button: styles['button-add'] }}
                >
                  <AddItemIcon styleName="icon" /> Add Data Science Skills
                </PrimaryButton>

                <PrimaryButton
                  onClick={() => this.setState({ showAddSkillsModal: 'qa' })}
                  disabled={!canModifyTrait}
                  theme={{ button: styles['button-add'] }}
                >
                  <AddItemIcon styleName="icon" /> Add QA Skills
                </PrimaryButton>
              </div>
            </div>
          </Collapse>
        </div>
      </React.Fragment>
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
  userTraits: PT.array.isRequired,
  traitRequestCount: PT.number.isRequired,
  updateUserTrait: PT.func.isRequired,
};
