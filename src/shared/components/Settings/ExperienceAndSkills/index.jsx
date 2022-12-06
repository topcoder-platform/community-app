/* eslint-disable prefer-destructuring */
import React from 'react';
import PT from 'prop-types';
import _ from 'lodash';
import { PrimaryButton } from 'topcoder-react-ui-kit';
import WorkExperience from './WorkExperience';
import WorkSkills from './WorkSkills';
import ErrorWrapper from '../ErrorWrapper';

import styles from './styles.scss';

export default class ExperienceAndSkills extends React.Component {
  constructor(props) {
    super(props);
    this.save = this.save.bind(this);
    this.workExperienceRef = React.createRef();
    this.workSkillsRef = React.createRef();
  }

  componentWillReceiveProps(nextProps) {
    const { isSaving, setIsSaving } = this.props;
    if (isSaving && nextProps.userTraits) {
      setIsSaving(false);
    }
  }

  save() {
    const { isSaving, setIsSaving } = this.props;
    if (isSaving) {
      return;
    }

    const newWork = this.workExperienceRef.current.state.newWork;
    const newWorkDirty = newWork.company !== ''
      || newWork.position !== ''
      || newWork.cityTown !== ''
      || newWork.timePeriodFrom !== ''
      || newWork.timePeriodTo !== ''
      || newWork.industry !== ''
      || newWork.working;

    const newLanguage = this.workSkillsRef.current.languagesRef.current.state.newLanguage;
    const newLanguageDirty = newLanguage.language !== ''
      || newLanguage.spokenLevel !== ''
      || newLanguage.writtenLevel !== '';

    const interestData = this.workSkillsRef.current.interestsRef.current.state.interestData;
    const previousInterestData = this.workSkillsRef.current.interestsRef.current
      .previousInterestData;
    const interestDataDirty = previousInterestData
      && !_.isEqual(interestData, previousInterestData);

    let valid = true;
    let dirty;

    if (newWorkDirty) {
      valid = valid && !this.workExperienceRef.current.onCheckFormValue(newWork);
      dirty = true;
    }

    if (newLanguageDirty) {
      valid = valid && !this.workSkillsRef.current.languagesRef.current
        .onCheckFormValue(newLanguage);
      dirty = true;
    }

    if (interestDataDirty) {
      valid = valid && true;
      dirty = true;
    }

    if (newWorkDirty) this.workExperienceRef.current.onHandleAddWork();
    if (newLanguageDirty) this.workSkillsRef.current.languagesRef.current.onHandleAddLanguage();
    if (interestDataDirty && valid) this.workSkillsRef.current.interestsRef.current.save();

    if (dirty && valid) setIsSaving(true);
  }

  render() {
    const { isSaving } = this.props;

    const saveBtn = (
      <PrimaryButton
        onClick={this.save}
        theme={{
          button: `${styles['save-changes-btn']} ${isSaving ? styles.disabled : ''}`,
        }}
        disabled={!!isSaving}
      >
        Save Changes
      </PrimaryButton>
    );

    return (
      <ErrorWrapper>
        <div styleName="experience-and-skills">
          <WorkSkills
            {...this.props}
            ref={this.workSkillsRef}
          />
          <WorkExperience
            {...this.props}
            ref={this.workExperienceRef}
          />
          <div styleName="footer">{saveBtn}</div>
        </div>
      </ErrorWrapper>
    );
  }
}

ExperienceAndSkills.defaultProps = {
  isSaving: false,
  setIsSaving: () => { },
};

ExperienceAndSkills.propTypes = {
  userTraits: PT.array.isRequired,
  isSaving: PT.bool,
  setIsSaving: PT.func,
};
