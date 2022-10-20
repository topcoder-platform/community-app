/* eslint-disable react/no-danger */
import React, { useState } from 'react';
import PT from 'prop-types';
import cn from 'classnames';
import ArrowRightIcon from 'assets/images/arrow-right-green.svg';

import { Modal, Button } from 'topcoder-react-ui-kit';
import Checkbox from 'components/GUIKit/Checkbox';
import IconClose from 'assets/images/icon-close-green.svg';
import TaxExtraDetails from '../TaxExtraDetails';

import {
  TAX_FORM_MAP,
  FORM_DETAILS,
  TAX_PROVIDER,
} from '../constants';

import styles from './styles.scss';

const TaxFormMethod = ({
  taxMethod,
  show,
  handleClose,
  handleConfirm,
  handle,
  setSelectedMode,
  setTaxService,
}) => {
  const [completeTaxForm, setCompleteTaxForm] = useState(false);
  const [extraSelected, setExtraSelected] = useState('');

  const onChange = () => {
    setCompleteTaxForm(!completeTaxForm);
  };

  const taxName = TAX_FORM_MAP[taxMethod];
  const {
    description, answer, infoLabel, extraDetails, instructions, formUrl,
  } = FORM_DETAILS[taxMethod];

  const onConfirm = () => {
    localStorage.setItem(
      `${handle}_${TAX_PROVIDER}`,
      taxMethod,
    );
    setTaxService(taxMethod);
    handleConfirm();
    handleClose();
    setSelectedMode(true);
  };

  if (extraSelected) {
    return (
      <TaxExtraDetails
        extraSelected={extraSelected}
        show
        handleClose={() => {
          setExtraSelected('');
        }}
      />
    );
  }

  return (
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
                  {`complete tax from ${taxName}`}
                </div>
              </div>
              <div styleName="icon" role="presentation" onClick={handleClose}>
                <IconClose />
              </div>
            </div>
            <div styleName="page-divider" />

            <div
              styleName="tax-method-description"
              dangerouslySetInnerHTML={{ __html: description }}
            />
            <div styleName="container">
              <div styleName="left-pane">
                <div styleName="title">
                  {`Why do I need to complete Form ${taxName}`}
                </div>
                <div
                  styleName="answer"
                  dangerouslySetInnerHTML={{ __html: answer }}
                />
                {
                  infoLabel && (
                    <div
                      styleName="infoLabel-container"
                      onClick={() => {
                        setExtraSelected(taxName);
                      }}
                      onKeyPress={() => {
                        setExtraSelected(taxName);
                      }}
                      role="button"
                      tabIndex={0}
                    >
                      <span
                        styleName="infoLabel"
                        dangerouslySetInnerHTML={{ __html: infoLabel }}
                      />
                      <ArrowRightIcon />
                    </div>
                  )
                }
                {
                  extraDetails && (
                    <div
                      styleName="extraDetails"
                      dangerouslySetInnerHTML={{ __html: extraDetails }}
                    />
                  )
                }
                <div styleName="button-container">
                  <a
                    href={instructions}
                    styleName="tax-method-button instructions"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {`see instructions for form ${taxName}`}
                  </a>
                </div>
                <div styleName="button-container complete">
                  <a
                    href={formUrl}
                    styleName={cn('tax-method-button', completeTaxForm ? 'disable-complete' : 'enable-complete')}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {`COMPLETE FORM ${taxName}`}
                  </a>
                </div>
              </div>
              <div styleName="right-pane">
                <div styleName="title">Did you complete your DocuSign Tax Form?</div>
                <p styleName="important-text">Great! Check that box and click CONTINUE.</p>
                <div styleName="form-input-checkbox">
                  <Checkbox
                    checked={completeTaxForm}
                    className="tax-service-rc-checkbox"
                    onChange={onChange}
                  />
                  <span styleName="label">
                    {`Yes, I have completed Form ${taxName}`}
                  </span>
                </div>
              </div>
            </div>
            <div styleName="page-divider" />

            <div styleName="footer">
              <div styleName="confirm-button-wrapper">
                <Button
                  onClick={onConfirm}
                  disabled={!completeTaxForm}
                  theme={{ button: !completeTaxForm ? styles['footer-confirm-disabled'] : styles['footer-confirm-button'] }}
                >
                  Confirm
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};


TaxFormMethod.defaultProps = {
  taxMethod: '',
  show: false,
  handle: '',
  handleClose: () => {},
  handleConfirm: () => {},
  setTaxService: () => {},
  setSelectedMode: () => {},
};

TaxFormMethod.propTypes = {
  taxMethod: PT.string,
  show: PT.bool,
  handle: PT.string,
  handleClose: PT.func,
  handleConfirm: PT.func,
  setSelectedMode: PT.func,
  setTaxService: PT.func,
};

export default TaxFormMethod;
