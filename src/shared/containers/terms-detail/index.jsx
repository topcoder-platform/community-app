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

import './styles.scss';

class TermsDetailPageContainer extends React.Component {
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
    } = this.props;
    return (
      <div styleName="outer-container">
        {
          loadingTermId === termId ? (
            <div styleName="loading">
              <LoadingIndicator />
            </div>
          ) : null
        }
        {
          getTermDetailsFailure ? (
            <div styleName="error">
              {getTermDetailsFailure.error.details}
            </div>
          ) : null
        }
        {
          details
            ? (
              <div styleName="terms-detail-container">
                <MetaTags title={details.title} description={details.title} />
                <div styleName="terms-title">
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
};

function mapStateToProps(state, props) {
  return {
    termId: props.match.params.termId,
    agreeingTerm: state.terms.agreeingTerm,
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
      dispatch(actions.terms.getTermDetailsDone(termId, tokens.tokenV2));
    },
    getDocuSignUrl: (tokens, templateId, returnUrl) => {
      dispatch(actions.terms.getDocuSignUrlInit(templateId));
      dispatch(actions.terms.getDocuSignUrlDone(templateId, returnUrl, tokens.tokenV2));
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TermsDetailPageContainer);
