import React, { useEffect } from 'react';
import PT from 'prop-types';
import DiceImage from 'assets/images/account/security/dicelogosmall.png';
import CloseButton from 'assets/images/account/security/green-close.svg';

import './style.scss';

export default function DiceModal({
  showTools, children, onCancel, leftButtonName, leftButtonDisabled, leftButtonClick,
  rightButtonName, rightButtonDisabled, rightButtonClick,
}) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  return (
    (
      <React.Fragment>
        <div
          styleName="container"
          onWheel={event => event.stopPropagation()}
        >
          {showTools ? (
            <><div styleName="header">
              <div styleName="icon-wrapper">
                <img src={DiceImage} alt="diceid" />
              </div>
              <div styleName="title">DICE ID authenticator setup </div>
              <CloseButton onClick={onCancel} styleName="close-button" />
            </div><div styleName="divider" /><div styleName="body">
                {children}
              </div><div styleName="divider" /><div styleName="footer">
                <div
                  styleName={`left-button ${leftButtonDisabled ? 'disabled' : ''}`}
                  onClick={leftButtonClick}
                  role="button"
                  tabIndex={0}
                  onKeyDown={leftButtonClick}
                >{leftButtonName}
                </div>
                <div
                  styleName={`right-button ${rightButtonDisabled ? 'disabled' : ''}`}
                  onClick={rightButtonClick}
                  role="button"
                  tabIndex={0}
                  onKeyDown={rightButtonClick}
                >{rightButtonName}
                </div>
              </div></>
          )
          : (
            {children}
          )}
        </div>
        <div
          styleName="overlay"
        />
      </React.Fragment>
    )
  );
}
DiceModal.defaultProps = {
  showTools: true,
  children: null,
  leftButtonDisabled: false,
  rightButtonDisabled: false,

};
DiceModal.propTypes = {
  showTools: PT.bool,
  children: PT.node,
  onCancel: PT.func.isRequired,
  leftButtonName: PT.string.isRequired,
  leftButtonDisabled: PT.bool,
  leftButtonClick: PT.func.isRequired,
  rightButtonName: PT.string.isRequired,
  rightButtonDisabled: PT.bool,
  rightButtonClick: PT.func.isRequired,
};
