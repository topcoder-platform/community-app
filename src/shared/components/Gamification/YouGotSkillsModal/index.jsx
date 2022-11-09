import React from 'react';
import PT from 'prop-types';
import { Modal } from 'topcoder-react-ui-kit';

import IconClose from 'assets/images/icon-close-green.svg';
import style from './styles.scss';

const YouGotSkillsModal = ({
  handle,
  onCancel,
  onCTA,
}) => (
  <Modal onCancel={onCancel} theme={style}>
    <div styleName="gotSkillsModal">

      <div styleName="header">
        <div styleName="title">
          <span>Well done!</span>
        </div>
        <div styleName="icon" role="presentation" onClick={onCancel}>
          <IconClose />
        </div>
      </div>

      <div styleName="description">
        <span>
          {/* eslint-disable-next-line max-len */}
          Congrats <strong>{handle}</strong>, by having 5 or more skills associated to your profile, not only will you have a more curated experience here at Topcoder, but you will also be presented with more opportunities.
        </span>
      </div>

      <div>
        <button type="button" styleName="primaryBtn" onClick={onCTA}>
          I feel lucky
        </button>
      </div>

    </div>
  </Modal>
);

YouGotSkillsModal.propTypes = {
  handle: PT.string.isRequired,
  onCancel: PT.func.isRequired,
  onCTA: PT.func.isRequired,
};

export default YouGotSkillsModal;
