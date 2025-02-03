import React from 'react';
import PT from 'prop-types';
import _ from 'lodash';
import { Modal, PrimaryButton, GhostButton } from 'topcoder-react-ui-kit';
import FormField from 'components/Settings/FormField';
import FormInputSelect from 'components/Settings/FormInputSelect';
import IconClose from 'assets/images/icon-close.svg';
import RemoveTagIcon from 'assets/images/icon-x-cancel.svg';
import styles from './styles.scss';

export default function AddSkillsModal({
  disabled,
  editingSkills,
  lookupSkills,
  userSkills,
  onClose,
  onSave,
  setEditingSkills,
}) {
  const [tempStr, setTempStr] = React.useState('');
  const [displayingSkills, setDisplayingSkills] = React.useState([]);

  // onInit
  React.useEffect(() => {
    setEditingSkills([...userSkills]);
    setDisplayingSkills([...userSkills]);
  }, [userSkills]);

  const findSkill = (arr, skill) => arr && arr.find(a => a.id === skill.id);

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

  const lookupSkillsOptions = lookupSkills
    .filter(skill => !findSkill(allDisplayingSkills, skill))
    .sort((a, b) => {
      if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
      if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
      return 0;
    });

  const skillList = allDisplayingSkills.map((skill) => {
    const selected = findSkill(editingSkills, skill);
    return (
      <li key={skill.id} styleName={`skillListItem non-removable ${selected ? 'selected' : ''}`}>
        <span
          role="button"
          onClick={() => !selected && toggleSkillSelection(skill)}
          tabIndex={0}
          onKeyDown={() => { }}
        >
          {_.truncate(skill.name, { length: 18, separator: ' ' })}
        </span>
        <span
          role="button"
          onClick={() => selected && toggleSkillSelection(skill)}
          styleName="close"
          tabIndex={0}
          onKeyDown={() => { }}
        >
          <RemoveTagIcon />
        </span>
      </li>
    );
  });

  return (
    <Modal theme={{ container: styles.modal, overlay: styles['modal-overlay'] }}>
      <div styleName="modal-dialog">
        <div styleName="modal-content">
          <h3 styleName="modal-header">
            Add Skills
            <GhostButton theme={{ button: styles.close }} onClick={onClose}>
              <IconClose />
            </GhostButton>
          </h3>
          <div styleName="modal-body">
            <h4 styleName="title">Select Skills</h4>

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
          <div styleName="modal-footer">
            <PrimaryButton theme={{ button: styles['button-save'] }} onClick={onSave} disabled={disabled}>
              Save
            </PrimaryButton>
          </div>
        </div>
      </div>
    </Modal>
  );
}

AddSkillsModal.propTypes = {
  disabled: PT.bool.isRequired,
  editingSkills: PT.arrayOf(PT.shape()).isRequired,
  lookupSkills: PT.arrayOf(PT.shape()).isRequired,
  userSkills: PT.arrayOf(PT.shape()).isRequired,
  onClose: PT.func.isRequired,
  onSave: PT.func.isRequired,
  setEditingSkills: PT.func.isRequired,
};
