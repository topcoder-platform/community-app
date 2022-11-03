import React from 'react';
import PT from 'prop-types';
import { Modal } from 'topcoder-react-ui-kit';
import { keys } from 'lodash';

import IconClose from 'assets/images/icon-close-green.svg';
import style from './styles.scss';

const SkillsNagModal = ({
  handle,
  skills,
  onCancel,
  onCTA,
  MIN_SKILLS_TO_REMIND,
}) => (
  <Modal onCancel={onCancel} theme={style}>
    <div styleName="nagModal">

      <div styleName="header">
        <div styleName="title">
          <span>Profile Skills Reminder</span>
        </div>
        <div styleName="icon" role="presentation" onClick={onCancel}>
          <IconClose />
        </div>
      </div>

      <div styleName="description">
        <span>
          {/* eslint-disable-next-line max-len */}
          Hey <strong>{handle}</strong>, we have detected you have only {keys(skills).length} skill[s] added to your profile. In order to match for opportunities at Topcoder, please add at least <strong>{MIN_SKILLS_TO_REMIND} skills</strong> to your profile.
        </span>
      </div>

      <div>
        <button type="button" styleName="primaryBtn" onClick={onCTA}>
          Update Your Skills
        </button>
      </div>

    </div>
  </Modal>
);

SkillsNagModal.propTypes = {
  MIN_SKILLS_TO_REMIND: PT.number.isRequired,
  handle: PT.string.isRequired,
  skills: PT.shape().isRequired,
  onCancel: PT.func.isRequired,
  onCTA: PT.func.isRequired,
};

export default SkillsNagModal;
