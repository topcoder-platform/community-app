/* eslint jsx-a11y/no-static-element-interactions:0 */
/* global window */

import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';
import cn from 'classnames';
import Modal from 'components/Modal';
import { PrimaryButton, Button } from 'components/buttons';
import LoadingIndicator from 'components/LoadingIndicator';
import TermDetails from './TermDetails';

import styles from './styles.scss';


export default class TermsModal extends React.Component {
  constructor(props) {
    super(props);

    this.selectTerm = this.selectTerm.bind(this);
    this.messageHandler = this.messageHandler.bind(this);
    this.nextTerm = this.nextTerm.bind(this);
    this.max = 0;
  }

  componentDidMount() {
    const { loadDetails, selectedTerm } = this.props;
    if (selectedTerm) {
      loadDetails(selectedTerm.termsOfUseId);
    }
    window.addEventListener('message', this.messageHandler, false);
  }

  componentWillReceiveProps(nextProps) {
    const { selectedTerm, loadDetails, terms,
      checkStatus, canRegister, onCancel, register } = this.props;
    if (nextProps.selectedTerm && !_.isEqual(selectedTerm, nextProps.selectedTerm) &&
      nextProps.loadingTermId !== _.toString(nextProps.selectedTerm.termsOfUseId)) {
      loadDetails(nextProps.selectedTerm.termsOfUseId);
    }
    if (!_.every(terms, 'agreed') && _.every(nextProps.terms, 'agreed') && !nextProps.checkingStatus) {
      checkStatus();
    }
    if (!canRegister && nextProps.canRegister) {
      onCancel();
      register();
    }
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.messageHandler);
  }

  selectTerm(term) {
    const { selectTerm, selectedTerm } = this.props;
    if (selectedTerm !== term) {
      selectTerm(term);
    }
  }

  nextTerm() {
    const { terms, selectTerm } = this.props;
    const term = _.find(terms, t => !t.agreed);
    selectTerm(term);
  }

  messageHandler(event) {
    const { onCancel, selectedTerm, signDocu } = this.props;
    if (event.data.type === 'DocuSign') {
      if (event.data.event === 'signing_complete') {
        signDocu(selectedTerm.termsOfUseId);
      } else {
        onCancel();
      }
    }
  }

  render() {
    const { onCancel, terms, details, loadingTermId, docuSignUrl,
      getDocuSignUrl, agreeTerm, agreeingTerm, isLoadingTerms,
      loadingDocuSignUrl, selectedTerm, viewOnly, checkingStatus } = this.props;

    return (
      <div styleName="container">
        <Modal
          onCancel={onCancel}
          theme={{ container: styles['modal-container'] }}
        >
          {
            isLoadingTerms &&
            <LoadingIndicator />
          }
          {
            !isLoadingTerms &&
            <div styleName="top-section">
              <div styleName="title">{terms.length > 1 ? 'Terms & Conditions of Use' : terms[0].title}</div>
              <div styleName="desc">You are seeing these Terms & Conditions because you have registered to a challenge and
                you have to respect the terms below in order to be able to submit.</div>
              {
                checkingStatus &&
                <LoadingIndicator />
              }
              {
                !checkingStatus && terms.length > 1 &&
                <div styleName="tabs-labels">
                  <div styleName="tabs-outer">
                    <div styleName="tabs-inner">
                      {
                        terms.map(t => (
                          <div key={t.termsOfUseId} styleName={cn(['tab', { agreed: t.agreed && !viewOnly, active: selectedTerm === t, 'view-only': viewOnly }])}>
                            {!viewOnly && <div styleName="indicator" />}
                          </div>
                        ))
                      }
                    </div>
                  </div>
                  <div styleName="labels">
                    {
                      terms.map(t => (
                        <div styleName="label" onClick={() => this.selectTerm(t)} key={t.termsOfUseId}>{t.title}</div>
                      ))
                    }
                  </div>
                </div>
              }
            </div>
          }
          {
            !isLoadingTerms && !checkingStatus && selectedTerm &&
            <div styleName={cn({ single: terms.length === 1 })}>
              {
                terms.length > 1 && <div styleName="sub-title">{selectedTerm.title}</div>
              }
              {
                loadingTermId === _.toString(selectedTerm.termsOfUseId) &&
                <LoadingIndicator />
              }
              {
                loadingTermId !== _.toString(selectedTerm.termsOfUseId) && details &&
                <TermDetails
                  details={details}
                  docuSignUrl={docuSignUrl}
                  getDocuSignUrl={getDocuSignUrl}
                  agreeTerm={agreeTerm}
                  agreeingTerm={agreeingTerm}
                  closeModal={onCancel}
                  loadingDocuSignUrl={loadingDocuSignUrl}
                  viewOnly={viewOnly}
                  agreed={selectedTerm.agreed}
                  nextTerm={this.nextTerm}
                />
              }
            </div>
          }

        </Modal>
        {
          !isLoadingTerms && !checkingStatus && selectedTerm && details && !viewOnly &&
          loadingTermId !== _.toString(selectedTerm.termsOfUseId) &&
          details.agreeabilityType === 'Electronically-agreeable' &&
          <div styleName="buttons">
            {
              selectedTerm.agreed ?
                (<PrimaryButton
                  theme={styles}
                  onClick={this.nextTerm}
                >Next</PrimaryButton>) :
                (<div>
                  <PrimaryButton
                    disabled={agreeingTerm === details.termsOfUseId}
                    onClick={() => agreeTerm(details.termsOfUseId)}
                    theme={styles}
                  >I Agree</PrimaryButton>
                  <Button
                    onClick={onCancel}
                    theme={styles}
                  >I Disagree</Button>
                </div>)
            }
          </div>
        }
      </div>
    );
  }
}

TermsModal.defaultProps = {
  terms: [],
  title: '',
  details: {},
  loadingTermId: '',
  docuSignUrl: '',
  agreeingTerm: '',
  isLoadingTerms: false,
  registering: false,
  loadingDocuSignUrl: '',
  selectedTerm: null,
  viewOnly: false,
};

TermsModal.propTypes = {
  onCancel: PT.func.isRequired,
  terms: PT.arrayOf(PT.shape()),
  loadDetails: PT.func.isRequired,
  details: PT.shape(),
  loadingTermId: PT.string,
  docuSignUrl: PT.string,
  getDocuSignUrl: PT.func.isRequired,
  register: PT.func.isRequired,
  agreeTerm: PT.func.isRequired,
  agreeingTerm: PT.string,
  isLoadingTerms: PT.bool,
  loadingDocuSignUrl: PT.string,
  selectedTerm: PT.shape(),
  checkStatus: PT.func.isRequired,
  canRegister: PT.bool.isRequired,
  checkingStatus: PT.bool.isRequired,
  signDocu: PT.func.isRequired,
  selectTerm: PT.func.isRequired,
  viewOnly: PT.bool,
};
