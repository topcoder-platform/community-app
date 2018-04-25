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

let isAnyTermModalOpen = false;

class TermsPageContainer extends React.Component {
  componentDidMount() {
    const {
      loadTerms, authTokens, entity, termsForEntity,
    } = this.props;

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

  componentWillUnmount() {
    if (this.forceOpen) isAnyTermModalOpen = false;
  }

  render() {
    const {
      closeTermsModal,
      instanceId,
      openTermsModalUuid,
    } = this.props;

    if (openTermsModalUuid === 'ANY' && !isAnyTermModalOpen) {
      isAnyTermModalOpen = true;
      this.forceOpen = true;
    }
    const open = (openTermsModalUuid && openTermsModalUuid === instanceId)
    || (openTermsModalUuid === 'ANY' && this.forceOpen);

    return (
      <div>
        {
          open ? (
            <Terms
              agreeingTerm={this.props.agreeingTerm}
              agreeTerm={termId => this.props.agreeTerm(this.props.authTokens, termId)}
              canRegister={this.props.canRegister}
              checkingStatus={this.props.checkingStatus}
              checkStatus={() => this.props.checkStatus(this.props.authTokens, this.props.entity)}
              defaultTitle={this.props.defaultTitle}
              description={this.props.description}
              details={this.props.termDetails}
              docuSignUrl={this.props.docuSignUrl}
              getDocuSignUrl={(templateId) => {
                const base = window ? window.location.href.match('.*://[^/]*')[0] : '';
                return this.props.getDocuSignUrl(
                  this.props.authTokens,
                  templateId,
                  `${base}/community-app-assets/iframe-break`,
                );
              }}
              isLoadingTerms={this.props.isLoadingTerms}
              loadDetails={termId => this.props.loadTermDetails(this.props.authTokens, termId)}
              loadingDocuSignUrl={this.props.loadingDocuSignUrl}
              loadingTermId={this.props.loadingTermId}
              onCancel={() => closeTermsModal(instanceId)}
              register={this.props.register}
              selectedTerm={this.props.selectedTerm}
              selectTerm={this.props.selectTerm}
              signDocu={this.props.signDocu}
              terms={this.props.terms}
              viewOnly={this.props.viewOnly}
            />
          ) : null
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
  // showTermsModal: false,
  description: '',
  defaultTitle: 'Terms & Conditions of Use',
  // reviewOpportunityTerms: [],
  termDetails: {},
  terms: [],
  termsForEntity: null,
  viewOnly: false,
};

const enitytType = PT.shape({
  type: PT.oneOf(['challenge', 'community', 'reviewOpportunity']).isRequired,
  id: PT.string.isRequired,
  reviewOpportunityTerms: PT.arrayOf(PT.shape()),
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
  defaultTitle: PT.string,
  docuSignUrl: PT.string,
  entity: enitytType.isRequired,
  getDocuSignUrl: PT.func.isRequired,
  isLoadingTerms: PT.bool,

  /* WARNING: This is very important prop! It is not safe to open multiple terms
   * modal simultaneously: DocuSign terms will fail to load, if the same terms
   * is shown in multiple modals. To prevent this, parent component should pass
   * into terms container an UUID that will be used then in actions to open
   * this exact modal. */
  instanceId: PT.string.isRequired,

  loadingDocuSignUrl: PT.string,
  loadingTermId: PT.string,
  loadTermDetails: PT.func.isRequired,
  loadTerms: PT.func.isRequired,
  openTermsModalUuid: PT.string.isRequired,
  register: PT.func.isRequired,
  selectedTerm: PT.shape(),
  selectTerm: PT.func.isRequired,

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
  openTermsModalUuid: state.terms.openTermsModalUuid,
  selectedTerm: state.terms.selectedTerm,
  termDetails: state.terms.details,
  terms: state.terms.terms,
  termsForEntity: state.terms.entity,
  viewOnly: state.terms.viewOnly,
});

const mapDispatchToProps = (dispatch) => {
  const t = termsActions.terms;
  return {
    closeTermsModal: (uuid) => {
      dispatch(t.closeTermsModal(uuid));
    },
    selectTerm: (term) => {
      dispatch(t.selectTerm(term));
    },
    loadTermDetails: (tokens, termId) => {
      dispatch(t.getTermDetailsInit(termId));
      dispatch(t.getTermDetailsDone(termId, tokens.tokenV2));
    },
    getDocuSignUrl: (tokens, templateId, returnUrl) => {
      dispatch(t.getDocuSignUrlInit(templateId));
      dispatch(t.getDocuSignUrlDone(templateId, returnUrl, tokens.tokenV2));
    },
    agreeTerm: (tokens, termId) => {
      dispatch(t.agreeTermInit(termId));
      dispatch(t.agreeTermDone(termId, tokens.tokenV2));
    },
    signDocu: (id) => {
      dispatch(t.signDocu(id));
    },
    checkStatus: (tokens, entity) => {
      dispatch(t.checkStatusInit());
      dispatch(t.checkStatusDone(entity, tokens));
    },
    loadTerms: (tokens, entity) => {
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
