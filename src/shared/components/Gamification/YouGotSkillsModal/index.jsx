import React from 'react';
import PT from 'prop-types';
import { Modal } from 'topcoder-react-ui-kit';

import IconClose from 'assets/images/icon-close-green.svg';
import YouGotSkillsBadge from './YouGotSkillsBadge';
import style from './styles.scss';

const YouGotSkillsModal = ({
  MIN_SKILLS_TO_REMIND,
  onCancel,
  onCTA,
}) => (
  <Modal onCancel={onCancel} theme={style}>
    <div styleName="gotSkillsModal">

      <div styleName="header">
        <div styleName="title">
          <span>YOU’VE GOT SKILLS!</span>
        </div>
        <div styleName="icon" role="presentation" onClick={onCancel}>
          <IconClose />
        </div>
      </div>

      <div styleName="description">
        <div styleName="badgeWrap">
          <YouGotSkillsBadge />
        </div>
        <span>
          {/* eslint-disable-next-line max-len */}
          By having <strong>{MIN_SKILLS_TO_REMIND} or more skills</strong> associated with your profile, not only will you have a more curated experience here at Topcoder, but you will also be presented with more opportunities that align with your strengths and interests.
        </span>
      </div>

      <div styleName="actionButtons">
        <button type="button" styleName="primaryBtn" onClick={onCTA}>
          Go to your public profile
        </button>
      </div>

    </div>
  </Modal>
);

YouGotSkillsModal.propTypes = {
  MIN_SKILLS_TO_REMIND: PT.number.isRequired,
  onCancel: PT.func.isRequired,
  onCTA: PT.func.isRequired,
};

export default YouGotSkillsModal;
