/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
/* eslint jsx-a11y/no-static-element-interactions:0 */
/* global window */

import React, { useState } from 'react';
import PT from 'prop-types';
import { Modal, PrimaryButton } from 'topcoder-react-ui-kit';
import FocusTrap from 'focus-trap-react';
import Checkbox from 'components/GUIKit/Checkbox';

import style from './styles.scss';


function SecurityReminder({
  onOk,
}) {
  const [isAgree, setIsAgree] = useState(false);
  return (
    <div>
      <FocusTrap>
        <Modal
          theme={{ container: style['modal-container'] }}
        >
          <div styleName="modal-content" tabIndex="0">
            <div styleName="desc">
              IMPORTANT REMINDER: In accordance with the Terms & Conditions and Code
              of Conduct you agree:
              <ul styleName="agreementList">
                <li>
                  To keep private any downloaded data (including code)
                </li>
                <ul>
                  <li>Except sharing or submission as directed or authorized by Topcoder</li>
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
          </div>
        </Modal>
      </FocusTrap>
    </div>
  );
}

SecurityReminder.propTypes = {
  onOk: PT.func.isRequired,
};
export default SecurityReminder;
