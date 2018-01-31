/**
 * Payment editor.
 */
/* global window */

import _ from 'lodash';
import LoadingIndicator from 'components/LoadingIndicator';
import PT from 'prop-types';
import React from 'react';
import Select from 'components/Select';
import { PrimaryButton } from 'topcoder-react-ui-kit';

import MemberSearchInput from 'components/MemberSearchInput';

import Background from '../Background';

import './style.scss';

export default function Editor({
  memberSuggestions,
  getMemberSuggestions,
  memberInputPopupVisible,
  setMemberInputPopupVisible,
  memberInputKeyword,
  setMemberInputKeyword,
  memberInputSelected,
  setMemberInputSelected,
  makePayment,
  neu,
  paymentAmount,
  paymentAssignee,
  paymentDescription,
  paymentTitle,
  projectDetails,
  projects,
  selectedBillingAccountId,
  selectedProjectId,
  selectProject,
  setPaymentAmount,
  setPaymentAssignee,
  setPaymentDescription,
  setPaymentTitle,
}) {
  let content;
  if (!projectDetails) content = <LoadingIndicator />;
  else {
    const billingAccounts = _.get(projectDetails, 'billingAccountIds', [])
      .map(id => ({ label: id, value: id }));
    content = billingAccounts.length ? (
      <div styleName="field">
        <div styleName="field">
          <span styleName="label">Billing account</span>
          <Select
            autoBlur
            disabled={!neu}
            options={billingAccounts}
            value={selectedBillingAccountId}
          />
        </div>
        <div styleName="fieldGap" />
        <div styleName="field">
          <span styleName="label">Title</span>
          <input
            disabled={!neu}
            onChange={e => setPaymentTitle(e.target.value)}
            placeholder="Topcoder payment"
            value={paymentTitle}
          />
        </div>
        <div styleName="field">
          <span styleName="label">Description</span>
          <textarea
            disabled={!neu}
            onChange={e => setPaymentDescription(e.target.value)}
            placeholder="payment is for ..."
            rows={3}
            value={paymentDescription}
          />
        </div>
        <div styleName="field">
          <span styleName="label">Assign to</span>
          <MemberSearchInput
            placeholder="Type handle to assign member"
            searchMembers={memberSuggestions}
            isPopupVisible={memberInputPopupVisible}
            keyword={memberInputKeyword}
            selectedNewMember={memberInputSelected}
            onToggleSearchPopup={setMemberInputPopupVisible}
            onSelectNewMember={(member) => {
              setMemberInputSelected(member);
              setPaymentAssignee(member.handle);
            }}
            onKeywordChange={(keyword) => {
              setMemberInputKeyword(keyword);
              getMemberSuggestions(keyword);
            }}
          />
        </div>
        <div styleName="field">
          <span styleName="label">Amount</span>
          <div styleName="withPrefix">
            <div styleName="prefix">
              <div styleName="textPrefix">$</div>
            </div>
            <input
              disabled={!neu}
              onChange={e => setPaymentAmount(Number(e.target.value))}
              placeholder="0"
              type="number"
              value={String(paymentAmount)}
            />
          </div>
        </div>
        <div styleName="action">
          { paymentAmount
            && neu
            && paymentAssignee
            && paymentDescription
            && paymentTitle ? (
              <PrimaryButton
                onClick={makePayment}
                // to="/sandbox/payments/123/done"
              >Pay now</PrimaryButton>
            ) : null
          }
        </div>
      </div>
    ) : (
      <div styleName="field">
        This project has no associated billing accounts yet
      </div>
    );
  }

  return (
    <Background
      escapeButton
      // TODO: This is wrong, as it reloads the app, but fine for now.
      onExit={() => { window.location = '/sandbox/payments'; }}
    >
      <div styleName="container">
        <h1 styleName="title">{`${neu ? 'New ' : ''}Member Payment`}</h1>
        <div styleName="form">
          <div styleName="field">
            <span styleName="label">Project</span>
            <Select
              autoBlur
              disabled={!neu}
              labelKey="name"
              onChange={project => selectProject(project.id)}
              options={projects}
              valueKey="id"
              value={Number(selectedProjectId)}
            />
          </div>
          {content}
        </div>
      </div>
    </Background>
  );
}

Editor.defaultProps = {
  neu: true,
  projectDetails: null,
};

Editor.propTypes = {
  neu: PT.bool,
  makePayment: PT.func.isRequired,
  memberSuggestions: PT.arrayOf(PT.shape()).isRequired,
  getMemberSuggestions: PT.func.isRequired,
  memberInputPopupVisible: PT.bool.isRequired,
  setMemberInputPopupVisible: PT.func.isRequired,
  memberInputKeyword: PT.string.isRequired,
  setMemberInputKeyword: PT.func.isRequired,
  memberInputSelected: PT.shape().isRequired,
  setMemberInputSelected: PT.func.isRequired,
  paymentAmount: PT.number.isRequired,
  paymentAssignee: PT.string.isRequired,
  paymentDescription: PT.string.isRequired,
  paymentTitle: PT.string.isRequired,
  projectDetails: PT.shape(),
  projects: PT.arrayOf(PT.object).isRequired,
  selectedBillingAccountId: PT.number.isRequired,
  selectedProjectId: PT.number.isRequired,
  selectProject: PT.func.isRequired,
  setPaymentAmount: PT.func.isRequired,
  setPaymentAssignee: PT.func.isRequired,
  setPaymentDescription: PT.func.isRequired,
  setPaymentTitle: PT.func.isRequired,
};
