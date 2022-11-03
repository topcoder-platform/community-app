import React from 'react';
import PT from 'prop-types';
import { Modal } from 'topcoder-react-ui-kit';
import { keys } from 'lodash';

import IconClose from 'assets/images/icon-close-green.svg';
import style from './styles.scss';

const SkillsNagModal = ({
  skills,
  onCancel,
  onCTA,
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
        {`We have detected you have ${keys(skills).length} skill[s] added to your profile.
        In order to match for opportunities at Topcoder, please add at least 5 skills to your profile.`}
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
  skills: PT.shape().isRequired,
  onCancel: PT.func.isRequired,
  onCTA: PT.func.isRequired,
};

export default SkillsNagModal;
