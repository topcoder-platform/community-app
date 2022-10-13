import React, { useEffect, useState } from 'react';
import cn from 'classnames';
import PT from 'prop-types';

import { Button } from 'topcoder-react-ui-kit';

import ChevronDownGreen from 'assets/images/chevron-down-green.svg';
import IconDollar from 'assets/images/icon-dollar.svg';
import IconSpeed from 'assets/images/icon-speed.svg';
import IconWorld from 'assets/images/icon-world.svg';
import SelectedPaymentLogo from 'assets/images/selected-payment.svg';
import PayoneerLogo from 'assets/images/Payoneer_log_gray.svg';
import PayPalLogo from 'assets/images/PayPal_logo_gray.svg';
import WesternUnionLogo from 'assets/images/Western_Union_Logo_gray.svg';
import PaymentInfo from '../PaymentInfo';
import PaymentMethod from '../PaymentMethod';

import { PAYMENT_METHODS, PAYMENT_METHOD_MAP, PAYMENT_PROVIDER } from '../constants';

import styles from './styles.scss';


const PaymentProvider = ({ handleConfirm, handle }) => {
  const [collapse, setCollapse] = useState(true);
  const [selectedMethod, setSelectedMethod] = useState('');
  const [paymentService, setPaymentService] = useState(
    localStorage.getItem(`${handle}_${PAYMENT_PROVIDER}`),
  );
  const [selectedMode, setSelectedMode] = useState(false);

  useEffect(() => {
    if (paymentService) {
      setSelectedMode(true);
    }
  }, []);

  const onRemove = () => {
    localStorage.removeItem(`${handle}_${PAYMENT_PROVIDER}`);
    setPaymentService(null);
    setSelectedMethod('');
  };

  return (
    <div styleName="platform-banner">
      <div styleName="header">
        <h3 styleName="banner-title">PAYMENT PROVIDER</h3>

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
              <span>Topcoder is partnered with several payment
                providers to send payments to our community members.
                Once a provider is set up, payments will be routed to your selected payment
                provider at the completion of work.
                Currently, members can be paid through one of the following providers:
                Payoneer®, PayPal®, or Western Union.
              </span>
            </div>

            {
              selectedMode ? (
                <div styleName="selectedWrapper">
                  <div styleName="selected-left">
                    <div styleName="selected-payment-logo">
                      <SelectedPaymentLogo />
                    </div>
                    <div styleName="payment-wrapper">
                      <p styleName="payment-title">Payment Provider Detail Submitted</p>

                      <p styleName="payment-desc">
                        You have submitted account details to use {paymentService} as your
                        payment service provider.
                        Processing may take up to 48 hours.
                      </p>
                    </div>
                  </div>

                  <div>
                    <Button
                      theme={{ button: styles['desc-button'] }}
                      onClick={() => setSelectedMode(false)}
                    >
                      CHANGE PROVIDER
                    </Button>
                  </div>

                </div>
              ) : null
            }

            {
              paymentService && !selectedMode ? (
                <div styleName="desc-container">
                  <div styleName="desc">
                    <p>
                      <strong>
                        Your currently selected payment provider is:{' '}
                        {PAYMENT_METHOD_MAP[paymentService]}
                      </strong>
                    </p>

                    <p>
                      <strong>Note:</strong> You have chosen to change your
                      selected payment provider.
                      This change may take up to 48 hours to be reflected in your account.
                    </p>
                  </div>

                  <Button
                    theme={{ button: styles['desc-button'] }}
                    onClick={onRemove}
                  >
                    CANCEL CHANGE
                  </Button>
                </div>
              ) : null
            }

            {
              !selectedMode ? (
                <div>
                  <div styleName="payment-methods">
                    {PAYMENT_METHODS.map(method => (
                      <div styleName="payment-method-card">
                        <div styleName="">
                          {PAYMENT_METHOD_MAP[method.name] === 'Payoneer' && (
                          <PayoneerLogo />
                          )}
                          {PAYMENT_METHOD_MAP[method.name] === 'PayPal' && <PayPalLogo />}
                          {PAYMENT_METHOD_MAP[method.name] === 'Western Union' && (
                          <WesternUnionLogo />
                          )}
                        </div>
                        <div styleName="divider" />
                        <div styleName="content-wrapper">
                          <PaymentInfo
                            icon={<IconDollar />}
                            label="Fees"
                            value={method.fees}
                            isLastChild={false}
                          />
                          <PaymentInfo
                            icon={<IconWorld />}
                            label="countries"
                            value={`Available in ${method.countries}+ countries`}
                            isLastChild={false}
                          />
                          <PaymentInfo
                            icon={<IconSpeed />}
                            label="Speed"
                            value={`Up to ${method.speed} Business Day`}
                            isLastChild
                          />
                        </div>
                        <div styleName="button-wrapper">
                          <Button
                            type="secondary"
                            theme={{ button: styles.button }}
                            onClick={() => {
                              setSelectedMethod(method.name);
                            }}
                          >
                            SELECT {PAYMENT_METHOD_MAP[method.name]}
                          </Button>
                        </div>
                      </div>
                    ))}

                    {selectedMethod && (
                    <PaymentMethod
                      paymentMethod={selectedMethod}
                      show
                      handle={handle}
                      handleClose={() => {
                        setSelectedMethod('');
                      }}
                      handleConfirm={() => {
                        handleConfirm();
                      }}
                      paymentService={paymentService}
                      setPaymentService={setPaymentService}
                      setSelectedMode={setSelectedMode}
                    />
                    )}
                  </div>
                  <div styleName="info-text">
                    The information above is gathered from each payment provider&apos;s
                    respective website. We encourage you to do any additional information
                    gathering you see fit prior to making a payment provider decision.
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

PaymentProvider.defaultProps = {
  handleConfirm: () => {},
  handle: '',
};

PaymentProvider.propTypes = {
  handleConfirm: PT.func,
  handle: PT.string,
};

export default PaymentProvider;
