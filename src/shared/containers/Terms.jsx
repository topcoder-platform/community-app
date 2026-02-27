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
import { actions } from 'topcoder-react-lib';

let isAnyTermModalOpen = false;

class TermsPageContainer extends React.Component {
  componentDidMount() {
    const {
      loadTerms, authTokens, entity, termsForEntity,
    } = this.props;

    // Only load terms for authenticated users
    const isLoggedIn = !_.isEmpty(authTokens.tokenV3);
    if (isLoggedIn && !_.isEqual(entity, termsForEntity)) {
      loadTerms(authTokens, entity);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { loadTerms, authTokens, entity } = this.props;

    // this is currently never happens that we have mounted Terms component
    // which persist without unmounting during entity is changed
    // but just in case better to support such case to avoid hidden unexpected behavior
    // Only load terms for authenticated users
    const isLoggedIn = !_.isEmpty(authTokens.tokenV3);
    if (isLoggedIn && !_.isEqual(nextProps.entity, entity)) {
      loadTerms(authTokens, nextProps.entity);
    }
  }

  componentWillUnmount() {
    if (this.forceOpen) isAnyTermModalOpen = false;
  }

  render() {
    const {
      agreeingTerm,
      agreeTerm,
      authTokens,
      canRegister,
      checkingStatus,
      checkStatus,
      closeTermsModal,
      defaultTitle,
      description,
      docuSignUrl,
      entity,
      getDocuSignUrl,
      instanceId,
      isLoadingTerms,
      loadingDocuSignUrl,
      loadingTermId,
      loadTermDetails,
      openTermsModalUuid,
      register,
      selectedTerm,
      selectTerm,
      signDocu,
      termDetails,
      terms,
      viewOnly,
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
              agreeingTerm={agreeingTerm}
              agreeTerm={termId => agreeTerm(authTokens, termId)}
              canRegister={canRegister}
              checkingStatus={checkingStatus}
              checkStatus={() => checkStatus(authTokens, entity)}
              defaultTitle={defaultTitle}
              description={description}
              details={termDetails}
              docuSignUrl={docuSignUrl}
              getDocuSignUrl={(templateId) => {
                const base = window ? window.location.href.match('.*://[^/]*')[0] : '';
                return getDocuSignUrl(
                  authTokens,
                  templateId,
                  `${base}/community-app-assets/iframe-break`,
                );
              }}
              isLoadingTerms={isLoadingTerms}
              loadDetails={termId => loadTermDetails(authTokens, termId)}
              loadingDocuSignUrl={loadingDocuSignUrl}
              loadingTermId={loadingTermId}
              onCancel={() => closeTermsModal(instanceId)}
              register={register}
              selectedTerm={selectedTerm}
              selectTerm={selectTerm}
              signDocu={signDocu}
              terms={terms}
              viewOnly={viewOnly}
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
  openTermsModalUuid: '',
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
  openTermsModalUuid: PT.string,
  register: PT.func.isRequired,
  selectedTerm: PT.shape(),
  selectTerm: PT.func.isRequired,

  signDocu: PT.func.isRequired,
  termDetails: PT.shape(),
  terms: PT.arrayOf(PT.shape()),
  termsForEntity: enitytType,
  viewOnly: PT.bool,
};

function mapStateToProps(state, props) {
  const { entity } = props;
  return {
    agreeingTerm: state.terms.agreeingTerm,
    authTokens: state.auth,
    canRegister: state.terms.canRegister,
    checkingStatus: state.terms.checkingStatus,
    docuSignUrl: state.terms.docuSignUrl,
    isLoadingTerms: _.isEqual(state.terms.loadingTermsForEntity, entity),
    loadingDocuSignUrl: state.terms.loadingDocuSignUrl,
    loadingTermId: state.terms.loadingDetailsForTermId,
    openTermsModalUuid: state.terms.openTermsModalUuid,
    selectedTerm: state.terms.selectedTerm,
    termDetails: state.terms.details,
    terms: state.terms.terms,
    termsForEntity: state.terms.entity,
    viewOnly: state.terms.viewOnly,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    closeTermsModal: (uuid) => {
      dispatch(termsActions.terms.closeTermsModal(uuid));
    },
    selectTerm: (term) => {
      dispatch(termsActions.terms.selectTerm(term));
    },
    loadTermDetails: (tokens, termId) => {
      dispatch(actions.terms.getTermDetailsInit(termId));
      dispatch(actions.terms.getTermDetailsDone(termId, tokens.tokenV3));
    },
    getDocuSignUrl: (tokens, templateId, returnUrl) => {
      dispatch(actions.terms.getDocuSignUrlInit(templateId));
      dispatch(actions.terms.getDocuSignUrlDone(templateId, returnUrl, tokens.tokenV3));
    },
    agreeTerm: (tokens, termId) => {
      dispatch(actions.terms.agreeTermInit(termId));
      dispatch(actions.terms.agreeTermDone(termId, tokens.tokenV3));
    },
    signDocu: (id) => {
      dispatch(termsActions.terms.signDocu(id));
    },
    checkStatus: (tokens, entity) => {
      dispatch(actions.terms.checkStatusInit());
      dispatch(actions.terms.checkStatusDone(entity, tokens));
    },
    loadTerms: (tokens, entity) => {
      dispatch(actions.terms.getTermsInit(entity));
      dispatch(actions.terms.getTermsDone(entity, tokens));
    },
  };
}

const TermsContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(TermsPageContainer);

export default TermsContainer;
