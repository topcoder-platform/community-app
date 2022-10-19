import React, { useEffect, useState } from 'react';
import cn from 'classnames';
import PT from 'prop-types';

import { Button } from 'topcoder-react-ui-kit';

import ChevronDownGreen from 'assets/images/chevron-down-green.svg';
import SelectedLogo from 'assets/images/selected-payment.svg';
import IconUSA from 'assets/images/icon-american.svg';
import IconEarth from 'assets/images/icon-earth.svg';

import TaxFormMethod from '../TaxFormMethod';

import {
  TAX_PROVIDER, TAX_FORM, TAX_FORM_MAP, FORM_DETAILS,
} from '../constants';

import styles from './styles.scss';


const TaxForm = ({ handleConfirm, handle }) => {
  const [collapse, setCollapse] = useState(true);
  const [selectedMethod, setSelectedMethod] = useState('');
  const [taxService, setTaxService] = useState(
    localStorage.getItem(`${handle}_${TAX_PROVIDER}`),
  );
  const [selectedMode, setSelectedMode] = useState(TAX_PROVIDER);

  useEffect(() => {
    if (taxService) {
      setSelectedMode(true);
    }
  }, []);

  const onRemove = () => {
    localStorage.removeItem(`${handle}_${TAX_FORM}`);
    setTaxService(null);
    setSelectedMethod('');
  };

  return (
    <div styleName="platform-banner">
      <div styleName="header">
        <div styleName="title-container">
          <h3 styleName="banner-title">TAX FORM</h3>
          {
            taxService ? (
              <span styleName="complete">Complete</span>
            ) : (
              <span styleName="required">Required</span>
            )
          }
        </div>
        <span
          role="presentation"
          styleName={cn('icon', { up: collapse })}
          onClick={() => setCollapse(!collapse)}
        >
          <ChevronDownGreen />
        </span>
      </div>

      {
        collapse && (
          <div styleName="content">
            <div styleName="description">
              <span>All members must have a tax form on file before they can be paid.&nbsp;
                There are two options: a W-9 or a W-8BEN.<br />
                We will walk you through completing your tax form.
              </span>
            </div>

            {
              selectedMode ? (
                <div styleName="selectedWrapper">
                  <div styleName="selected-left">
                    <div styleName="selected-taxform-logo">
                      <SelectedLogo />
                    </div>
                    <div styleName="taxform-wrapper">
                      <p styleName="taxform-title">Tax Form Submitted</p>

                      <p styleName="taxform-desc">
                        You have submitted a {TAX_FORM_MAP[taxService]} Tax Form via DocuSign. You
                        will receive confirmation from Topcoder via email
                        to acknowledge receipt. Processing may take up to 48 hours.
                      </p>
                    </div>
                  </div>

                  <div styleName="selected-button-wrapper">
                    <Button
                      theme={{ button: styles['desc-button'] }}
                      onClick={() => setSelectedMode(false)}
                    >
                      SUBMIT A NEW TAX FORM
                    </Button>
                  </div>

                </div>
              ) : null
            }

            {
              taxService && !selectedMode ? (
                <div styleName="desc-container">
                  <div styleName="desc">
                    <p>
                      <strong>
                        Your currently tax form on file is:{' '}
                        {TAX_FORM_MAP[taxService]}
                      </strong>
                    </p>

                    <p>
                      <strong>Note:</strong> You have chosen to change your
                      selected payment provider.
                      This change may take up to 48 hours to be reflected in your account.
                    </p>
                  </div>

                  <div styleName="selected-button-wrapper">
                    <Button
                      theme={{ button: styles['desc-button'] }}
                      onClick={onRemove}
                    >
                      CANCEL CHANGE
                    </Button>
                  </div>
                </div>
              ) : null
            }

            {
              !selectedMode ? (
                <div>
                  <div styleName="taxform-methods">
                    {TAX_FORM.map(detail => (
                      <div styleName="taxform-method-card">
                        <div>
                          {TAX_FORM_MAP[detail.name] === 'W-9' && (
                            <IconUSA />
                          )}
                          {TAX_FORM_MAP[detail.name] === 'W-8BEN' && (
                            <IconEarth />
                          )}
                        </div>
                        <div styleName="divider" />
                        <div
                          styleName="tax-description"
                          dangerouslySetInnerHTML={{
                            __html: FORM_DETAILS[detail.name].description,
                          }}
                        />
                        <div styleName="button-wrapper">
                          <Button
                            type="secondary"
                            theme={{ button: styles.button }}
                            onClick={() => {
                              setSelectedMethod(detail.name);
                            }}
                          >
                            SELECT {TAX_FORM_MAP[detail.name]}
                          </Button>
                        </div>
                      </div>
                    ))}

                    {selectedMethod && (
                      <TaxFormMethod
                        taxMethod={selectedMethod}
                        show
                        handle={handle}
                        handleClose={() => {
                          setSelectedMethod('');
                        }}
                        handleConfirm={() => {
                          handleConfirm();
                        }}
                        setTaxService={setTaxService}
                        setSelectedMode={setSelectedMode}
                      />
                    )}
                  </div>
                </div>
              ) : null
            }
          </div>
        )
      }
    </div>
  );
};

TaxForm.defaultProps = {
  handleConfirm: () => {},
  handle: '',
};

TaxForm.propTypes = {
  handleConfirm: PT.func,
  handle: PT.string,
};

export default TaxForm;
