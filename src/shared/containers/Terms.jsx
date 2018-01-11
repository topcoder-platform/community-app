/**
 * This container component load data into its state, and pass them to children via props.
 * Also it defines all necessary handlers to pass to the children.
 */
/* global window */

import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import Terms from 'components/Terms';
import termsActions from 'actions/terms';

class TermsPageContainer extends React.Component {
  componentDidMount() {
    const { loadTerms, authTokens, entity, termsForEntity } = this.props;

    if (!_.isEqual(entity, termsForEntity)) {
      loadTerms(authTokens, entity);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { loadTerms, authTokens, entity } = this.props;

    // this is currently never happens that we have mounted Terms component
    // which persist without unmounting during entity is changed
    // but just in case better to support such case to avoid hidden unexpected behavior
    if (!_.isEqual(nextProps.entity, entity)) {
      loadTerms(authTokens, nextProps.entity);
    }
  }

  render() {
    return (
      <div>
        {this.props.showTermsModal &&
          <Terms
            agreeingTerm={this.props.agreeingTerm}
            agreeTerm={termId => this.props.agreeTerm(this.props.authTokens, termId)}
            canRegister={this.props.canRegister}
            checkingStatus={this.props.checkingStatus}
            checkStatus={() => this.props.checkStatus(this.props.authTokens, this.props.entity)}
            description={this.props.description}
            details={this.props.termDetails}
            docuSignUrl={this.props.docuSignUrl}
            getDocuSignUrl={(templateId) => {
              const base = window ? window.location.href.match('.*://[^/]*')[0] : '';
              return this.props.getDocuSignUrl(this.props.authTokens,
                templateId, `${base}/community-app-assets/iframe-break`);
            }}
            isLoadingTerms={this.props.isLoadingTerms}
            loadDetails={termId => this.props.loadTermDetails(this.props.authTokens, termId)}
            loadingDocuSignUrl={this.props.loadingDocuSignUrl}
            loadingTermId={this.props.loadingTermId}
            onCancel={this.props.closeTermsModal}
            register={this.props.register}
            selectedTerm={this.props.selectedTerm}
            selectTerm={this.props.selectTerm}
            signDocu={this.props.signDocu}
            terms={this.props.terms}
            viewOnly={this.props.viewOnly}
          />
        }
      </div>
    );
  }
}

TermsPageContainer.defaultProps = {
  agreeingTerm: '',
  canRegister: false,
  checkingStatus: false,
  docuSignUrl: '',
  isLoadingTerms: false,
  loadingDocuSignUrl: '',
  loadingTermId: '',
  selectedTerm: null,
  showTermsModal: false,
  description: '',
  termDetails: {},
  terms: [],
  termsForEntity: null,
  viewOnly: false,
};

const enitytType = PT.shape({
  type: PT.oneOf(['challenge', 'community']).isRequired,
  id: PT.string.isRequired,
});

TermsPageContainer.propTypes = {
  agreeingTerm: PT.string,
  agreeTerm: PT.func.isRequired,
  authTokens: PT.shape().isRequired,
  canRegister: PT.bool,
  checkingStatus: PT.bool,
  checkStatus: PT.func.isRequired,
  closeTermsModal: PT.func.isRequired,
  description: PT.string,
  docuSignUrl: PT.string,
  entity: enitytType.isRequired,
  getDocuSignUrl: PT.func.isRequired,
  isLoadingTerms: PT.bool,
  loadingDocuSignUrl: PT.string,
  loadingTermId: PT.string,
  loadTermDetails: PT.func.isRequired,
  loadTerms: PT.func.isRequired,
  register: PT.func.isRequired,
  selectedTerm: PT.shape(),
  selectTerm: PT.func.isRequired,
  showTermsModal: PT.bool,
  signDocu: PT.func.isRequired,
  termDetails: PT.shape(),
  terms: PT.arrayOf(PT.shape()),
  termsForEntity: enitytType,
  viewOnly: PT.bool,
};

const mapStateToProps = (state, props) => ({
  agreeingTerm: state.terms.agreeingTerm,
  authTokens: state.auth,
  canRegister: state.terms.canRegister,
  checkingStatus: state.terms.checkingStatus,
  docuSignUrl: state.terms.docuSignUrl,
  isLoadingTerms: _.isEqual(state.terms.loadingTermsForEntity, props.entity),
  loadingDocuSignUrl: state.terms.loadingDocuSignUrl,
  loadingTermId: state.terms.loadingDetailsForTermId,
  selectedTerm: state.terms.selectedTerm,
  showTermsModal: state.terms.showTermsModal,
  termDetails: state.terms.details,
  terms: state.terms.terms,
  termsForEntity: state.terms.entity,
  viewOnly: state.terms.viewOnly,
});

const mapDispatchToProps = (dispatch) => {
  const t = termsActions.terms;
  return {
    closeTermsModal: () => {
      dispatch(t.closeTermsModal());
    },
    selectTerm: (term) => {
      dispatch(t.selectTerm(term));
    },
    loadTermDetails: (tokens, termId) => {
      dispatch(t.getTermDetailsInit(termId));
      dispatch(t.getTermDetailsDone(termId, tokens.tokenV3));
    },
    getDocuSignUrl: (tokens, templateId, returnUrl) => {
      dispatch(t.getDocuSignUrlInit(templateId));
      dispatch(t.getDocuSignUrlDone(templateId, returnUrl, tokens.tokenV3));
    },
    agreeTerm: (tokens, termId) => {
      dispatch(t.agreeTermInit(termId));
      dispatch(t.agreeTermDone(termId, tokens.tokenV3));
    },
    signDocu: (id) => {
      dispatch(t.signDocu(id));
    },
    checkStatus: (tokens, entity) => {
      dispatch(t.checkStatusInit());
      dispatch(t.checkStatusDone(entity, tokens));
    },
    loadTerms: (tokens, entity) => {
      if (entity.type === 'challenge') {
        // skip getting terms for challenge entities as they are
        // received as part of challenge details now
        return;
      }
      dispatch(t.getTermsInit(entity));
      dispatch(t.getTermsDone(entity, tokens));
    },
  };
};

const TermsContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(TermsPageContainer);

export default TermsContainer;
