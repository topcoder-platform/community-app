/**
 * This container component load data into its state, and pass them to children via props.
 * Also it defines all necessary handlers to pass to the children.
 */
/* global window */

import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import LoadingIndicator from 'components/LoadingIndicator';
import TermDetails from 'components/Terms/TermDetails';
import { actions } from 'topcoder-react-lib';
import { MetaTags } from 'topcoder-react-utils';
import { Modal, PrimaryButton } from 'topcoder-react-ui-kit';
import SwitchWithLabel from 'components/SwitchWithLabel';
import { themr } from 'react-css-super-themr';
import styles from './styles.scss';

const ACCEPTANCE_LABEL = 'I understand and agree';

class TermsDetailPageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      termsAccepted: false,
      showModal: false,
    };
    this.switchHandler = this.switchHandler.bind(this);
    this.resetModal = this.resetModal.bind(this);
    this.showModal = this.showModal.bind(this);
  }

  componentDidMount() {
    const { loadTermDetails, authTokens, termId } = this.props;
    loadTermDetails(authTokens, termId);
  }

  componentWillReceiveProps(nextProps) {
    const { loadTermDetails, authTokens, termId } = this.props;
    if (!_.isEqual(nextProps.termId, termId)) {
      loadTermDetails(authTokens, nextProps.termId);
    }
  }

  switchHandler() {
    const { termsAccepted } = this.state;
    this.setState({ termsAccepted: !termsAccepted });
  }

  resetModal() {
    this.setState({ showModal: false });
  }

  showModal() {
    this.setState({ showModal: true });
  }

  render() {
    const {
      authTokens,
      details,
      docuSignUrl,
      getDocuSignUrl,
      loadingDocuSignUrl,
      termId,
      getTermDetailsFailure,
      loadingTermId,
      agreeTerms,
      agreeingTerm,
      agreeTermFailure,
      theme,
    } = this.props;
    const { termsAccepted, showModal } = this.state;

    return (
      <div className={theme['outer-container']}>
        {
          loadingTermId === termId ? (
            <div className={theme.loading}>
              <LoadingIndicator />
            </div>
          ) : null
        }
        {
          getTermDetailsFailure ? (
            <div className={theme.error}>
              {getTermDetailsFailure.error.details}
            </div>
          ) : null
        }
        {
          details
            ? (
              <div className={theme['terms-detail-container']}>
                <MetaTags title={details.title} description={details.title} />
                <div className={theme['terms-title']}>
                  {details.title}
                </div>
                <TermDetails
                  details={details}
                  docuSignUrl={docuSignUrl}
                  getDocuSignUrl={(templateId) => {
                    const base = window ? window.location.href.match('.*://[^/]*')[0] : '';
                    return getDocuSignUrl(
                      authTokens,
                      templateId, `${base}/community-app-assets/iframe-break`,
                    );
                  }}
                  loadingDocuSignUrl={loadingDocuSignUrl}
                />
              </div>
            )
            : null
        }
        {
          agreeingTerm !== termId && details && !details.agreed
          && agreeTermFailure === undefined
          && details.agreeabilityType !== 'DocuSignable'
            ? (
              <div className={theme['terms-acceptance-handler']}>
                <SwitchWithLabel
                  onSwitch={this.switchHandler}
                  enabled={termsAccepted}
                  labelAfter={ACCEPTANCE_LABEL}
                  theme={theme}
                />
                <PrimaryButton
                  disabled={!termsAccepted}
                  onClick={() => {
                    agreeTerms(authTokens, termId);
                    this.showModal();
                  }}
                >
                  Accept
                </PrimaryButton>
              </div>
            )
            : null
        }
        {
          agreeingTerm === termId ? <LoadingIndicator /> : null
        }
        {
          agreeingTerm !== termId && agreeTermFailure !== undefined && showModal
            ? (
              <Modal
                onCancel={() => this.resetModal()}
                theme={theme}
              >
                <div className={theme.modalMsg}>
                  You have successfully agreed
                </div>
                <PrimaryButton
                  onClick={() => this.resetModal()}
                  theme={theme}
                >
                  Ok
                </PrimaryButton>
              </Modal>
            ) : null
        }
      </div>
    );
  }
}

TermsDetailPageContainer.defaultProps = {
  docuSignUrl: '',
  loadingDocuSignUrl: '',
  loadingTermId: '',
  // description: '',
  details: null,
  getTermDetailsFailure: false,
};

TermsDetailPageContainer.propTypes = {
  termId: PT.string.isRequired,
  authTokens: PT.shape().isRequired,
  docuSignUrl: PT.string,
  getDocuSignUrl: PT.func.isRequired,
  loadingDocuSignUrl: PT.string,
  loadTermDetails: PT.func.isRequired,
  getTermDetailsFailure: PT.oneOfType([PT.bool, PT.shape()]),
  loadingTermId: PT.string,
  details: PT.shape(),
  agreeTerms: PT.func.isRequired,
  agreeTermFailure: PT.oneOfType([undefined, PT.shape(), PT.bool]).isRequired,
  agreeingTerm: PT.oneOfType([undefined, PT.string]).isRequired,
  theme: PT.shape({
    'outer-container': PT.string.isRequired,
    loading: PT.string.isRequired,
    error: PT.string.isRequired,
    'terms-detail-container': PT.string.isRequired,
    'terms-acceptance-handler': PT.string.isRequired,
    'terms-title': PT.string.isRequired,
  }).isRequired,
};

function mapStateToProps(state, props) {
  return {
    termId: props.match.params.termId,
    agreeingTerm: state.terms.agreeingTerm,
    agreeTermFailure: state.terms.agreeTermFailure,
    authTokens: state.auth,
    docuSignUrl: state.terms.docuSignUrl,
    loadingDocuSignUrl: state.terms.loadingDocuSignUrl,
    getTermDetailsFailure: state.terms.getTermDetailsFailure,
    loadingTermId: state.terms.loadingDetailsForTermId,
    details: state.terms.details,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loadTermDetails: (tokens, termId) => {
      dispatch(actions.terms.getTermDetailsInit(termId));
      dispatch(actions.terms.getTermDetailsDone(termId, tokens.tokenV2, false));
    },
    getDocuSignUrl: (tokens, templateId, returnUrl) => {
      dispatch(actions.terms.getDocuSignUrlInit(templateId));
      dispatch(actions.terms.getDocuSignUrlDone(templateId, returnUrl, tokens.tokenV2));
    },
    agreeTerms: (tokens, termId) => {
      dispatch(actions.terms.agreeTermInit(termId));
      dispatch(actions.terms.agreeTermDone(termId, tokens.tokenV2));
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(themr('Contentful-Blog', styles)(TermsDetailPageContainer));
