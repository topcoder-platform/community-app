import React from 'react';
import PT from 'prop-types';
import _ from 'lodash';
import { Modal, PrimaryButton, GhostButton } from 'topcoder-react-ui-kit';
import FormField from 'components/Settings/FormField';
import FormInputSelect from 'components/Settings/FormInputSelect';
import IconClose from 'assets/images/icon-close.svg';
import RemoveTagIcon from 'assets/images/icon-x-cancel.svg';
import styles from './styles.scss';

const CATEGORIES = {
  design: 'design',
  develop: 'develop',
  data_science: 'data_science',
  qa: 'qa',
};

export default function AddSkillsModal({
  allSkills,
  disabled,
  category: intialCategory,
  editingSkills,
  lookupSkills,
  userSkills,
  onClose,
  onSave,
  setEditingSkills,
}) {
  const [tempStr, setTempStr] = React.useState('');
  const [tab, setTab] = React.useState(intialCategory);
  const [displayingSkills, setDisplayingSkills] = React.useState([]);
  const category = tab;

  // onInit
  React.useEffect(() => {
    setEditingSkills([...userSkills]);
    setDisplayingSkills([...userSkills]);
  }, [userSkills]);

  const find = (arr, i) => arr && arr.indexOf(i) !== -1;
  const findSkill = (arr, skill) => arr && arr.find(a => a.id === skill.id);

  const popularSkills = React.useMemo(() => allSkills
    .filter(skill => find(skill.categories, category))
    .slice(0, 10)
    .map(skill => _.cloneDeep(({ ...skill, isPopularSkill: true }))),
  [allSkills, category]);

  const handleSkillSelect = (skill) => {
    setEditingSkills([...editingSkills, skill]);
  };
  const handleSkillUnselect = (skill) => {
    setEditingSkills(editingSkills.filter(i => i.id !== skill.id));
  };
  const toggleSkillSelection = (skill) => {
    if (findSkill(editingSkills, skill)) {
      handleSkillUnselect(skill);
    } else {
      handleSkillSelect(skill);
    }
  };
  const updateDisplayingSkills = (skill) => {
    if (!findSkill(displayingSkills, skill)) {
      setDisplayingSkills([...displayingSkills, skill]);
    }
  };

  const allDisplayingSkills = displayingSkills;
  popularSkills.forEach((skill) => {
    if (!findSkill(displayingSkills, skill)) {
      allDisplayingSkills.push(skill);
    }
  });

  const lookupSkillsOptions = lookupSkills
    .filter(skill => !findSkill(allDisplayingSkills, skill))
    .filter(skill => find(skill.categories, category));

  const skillList = allDisplayingSkills.map((skill) => {
    const isOtherCategorySkill = s => !find(s.categories, category);
    if (isOtherCategorySkill(skill)) {
      return null;
    }

    const selected = findSkill(editingSkills, skill);
    return (
      <li key={skill.id} styleName={`skillListItem non-removable ${selected ? 'selected' : ''}`}>
        <span
          role="button"
          onClick={() => !selected && toggleSkillSelection(skill)}
          tabIndex={0}
          onKeyDown={() => {}}
        >
          {_.truncate(skill.name, { length: 18, separator: ' ' })}
        </span>
        <span
          role="button"
          onClick={() => selected && toggleSkillSelection(skill)}
          styleName="close"
          tabIndex={0}
          onKeyDown={() => {}}
        >
          <RemoveTagIcon />
        </span>
      </li>
    );
  });

  const getTabName = (tabname) => {
    if (tabname === CATEGORIES.design) return 'Design / UX';
    if (tabname === CATEGORIES.develop) return 'Development';
    if (tabname === CATEGORIES.data_science) return 'Data Science';
    if (tabname === CATEGORIES.qa) return 'QA';
    return '';
  };

  return (
    <Modal theme={{ container: styles.modal, overlay: styles['modal-overlay'] }}>
      <div styleName="modal-content">
        <h3 styleName="modal-header">
          Add Skills
          <GhostButton theme={{ button: styles.close }} onClick={onClose}>
            <IconClose />
          </GhostButton>
        </h3>
        <div styleName="modal-body">
          <nav styleName="tabs">
            <ul>
              <li
                styleName={tab === CATEGORIES.design ? 'active' : ''}
                role="presentation"
                onClick={() => setTab(CATEGORIES.design)}
                onKeyDown={() => {}}
              >
                { getTabName(CATEGORIES.design) }
              </li>
              <li
                styleName={tab === CATEGORIES.develop ? 'active' : ''}
                role="presentation"
                onClick={() => setTab(CATEGORIES.develop)}
                onKeyDown={() => {}}
              >
                { getTabName(CATEGORIES.develop) }
              </li>
              <li
                styleName={tab === CATEGORIES.data_science ? 'active' : ''}
                role="presentation"
                onClick={() => setTab(CATEGORIES.data_science)}
                onKeyDown={() => {}}
              >
                { getTabName(CATEGORIES.data_science) }
              </li>
              <li
                styleName={tab === CATEGORIES.qa ? 'active' : ''}
                role="presentation"
                onClick={() => setTab(CATEGORIES.qa)}
                onKeyDown={() => {}}
              >
                { getTabName(CATEGORIES.qa) }
              </li>
            </ul>
          </nav>
          <div styleName="tabContent">
            <h4 styleName="title">Select {getTabName(tab)} Skills</h4>

            <FormField label="Skill">
              <FormInputSelect
                options={lookupSkillsOptions}
                onChange={(skill) => {
                  handleSkillSelect(skill);
                  setTempStr(skill.name);
                  updateDisplayingSkills(skill);
                }}
                matchPos="any"
                matchProp="name"
                labelKey="name"
                valueKey="name"
                placeholder="Add new skill"
                clearable={false}
                disabled={disabled}
                value={tempStr}
              />
            </FormField>

            <ul styleName="skillList">
              {skillList}
            </ul>
          </div>
        </div>
        <div styleName="modal-footer">
          <PrimaryButton theme={{ button: styles['button-save'] }} onClick={onSave} disabled={disabled}>
            Save
          </PrimaryButton>
        </div>
      </div>
    </Modal>
  );
}

AddSkillsModal.propTypes = {
  allSkills: PT.arrayOf(PT.shape()).isRequired,
  disabled: PT.bool.isRequired,
  category: PT.string.isRequired,
  editingSkills: PT.arrayOf(PT.shape()).isRequired,
  lookupSkills: PT.arrayOf(PT.shape()).isRequired,
  userSkills: PT.arrayOf(PT.shape()).isRequired,
  onClose: PT.func.isRequired,
  onSave: PT.func.isRequired,
  setEditingSkills: PT.func.isRequired,
};
