/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
/* eslint jsx-a11y/no-static-element-interactions:0 */
/* global window */

import React, { useState } from 'react';
import PT from 'prop-types';
import { Modal, PrimaryButton } from 'topcoder-react-ui-kit';
import FocusTrap from 'focus-trap-react';
import Checkbox from 'components/GUIKit/Checkbox';
import IconClose from 'assets/images/tc-edu/icon-close-big.svg';

import style from './styles.scss';


function SecurityReminder({
  onOk,
  onCancel,
}) {
  const [isAgree, setIsAgree] = useState(false);
  return (
    <div>
      <FocusTrap>
        <Modal
          onCancel={onCancel}
          theme={{ container: style['modal-container'] }}
        >
          <div styleName="modal-content" tabIndex="0">
            <div styleName="title">
              IMPORTANT REMINDER
            </div>
            <div styleName="desc">
              In accordance with the Terms & Conditions and Code
              of Conduct you agree:
              <ul styleName="agreementList">
                <li>
                  To keep private any downloaded data (including code)
                </li>
                <ul>
                  <li>Except sharing a submission as directed or authorized by Topcoder</li>
                </ul>
                <li>To delete such data after completion of the challenge or project</li>
              </ul>

              <div styleName="checkboxContainer">
                <Checkbox
                  onChange={checked => setIsAgree(checked)}
                  checked={isAgree}
                />
                <span>I agree</span>
              </div>

              <div styleName="buttons">
                <PrimaryButton
                  disabled={!isAgree}
                  onClick={onOk}
                  theme={style}
                >
                  Register
                </PrimaryButton>
              </div>
            </div>

            <button styleName="btn-close" type="button" onClick={onCancel}>
              <IconClose />
            </button>

          </div>
        </Modal>
      </FocusTrap>
    </div>
  );
}

SecurityReminder.propTypes = {
  onOk: PT.func.isRequired,
  onCancel: PT.func.isRequired,
};
export default SecurityReminder;
