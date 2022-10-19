/* eslint-disable react/no-danger */
import React from 'react';
import PT from 'prop-types';

import { Modal, Button } from 'topcoder-react-ui-kit';
import IconClose from 'assets/images/icon-close-green.svg';
import ArrowPrev from 'assets/images/arrow-prev.svg';

import {
  TAX_INFO_CONTENT,
} from '../constants';

import styles from './styles.scss';

const TaxExtraDetails = ({
  extraSelected,
  show,
  handleClose,
}) => (
  <Modal
    show={show}
    theme={{
      container: styles['modal-container'],
      overlay: styles['modal-overlay'],
    }}
    handleClose={handleClose}
    onCancel={handleClose}
  >
    <div title="tax Setup" styleName="page-wrapper">
      <div styleName="tax-method">
        <div styleName="page-content">
          <div styleName="page-header">
            <div styleName="left-pane">
              <div styleName="tax-service-title">
                {`Topcoder Tax Information for Form ${extraSelected}`}
              </div>
            </div>
            <div styleName="icon" role="presentation" onClick={handleClose}>
              <IconClose />
            </div>
          </div>
          <div styleName="page-divider" />

          <div
            styleName="tax-info-description"
            dangerouslySetInnerHTML={{ __html: TAX_INFO_CONTENT }}
          />
          <div styleName="page-divider" />

          <div styleName="footer">
            <div styleName="confirm-button-wrapper">
              <Button
                theme={{ button: styles['footer-confirm-button'] }}
                onClick={handleClose}
              >
                <ArrowPrev />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Modal>
);


TaxExtraDetails.defaultProps = {
  extraSelected: '',
  show: false,
  handleClose: () => {},
};

TaxExtraDetails.propTypes = {
  extraSelected: PT.string,
  show: PT.bool,
  handleClose: PT.func,
};

export default TaxExtraDetails;
