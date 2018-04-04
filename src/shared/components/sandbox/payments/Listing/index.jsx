/**
 * Payments listing.
 */

import LoadingIndicator from 'components/LoadingIndicator';
import PT from 'prop-types';
import React from 'react';
import Select from 'components/Select';
import { PrimaryButton } from 'topcoder-react-ui-kit';
import Background from '../Background';
import PaymentRow from './PaymentRow';
import style from './style.scss';

export default function Listing({
  loadingMemberTasks,
  memberTasks,
  projects,
  selectedProjectId,
  selectProject,
}) {
  const selectedProjectIdNum = Number(selectedProjectId);
  let content = memberTasks
    .filter(item => item.projectId === selectedProjectIdNum)
    .sort((a, b) => {
      const aDate = a.updatedAt || a.createdAt;
      const bDate = b.updatedAt || b.createdAt;
      return bDate.localeCompare(aDate);
    }).map(challenge => (
      <PaymentRow
        challenge={challenge}
        key={challenge.id}
      />
    ));

  if (content.length) {
    content = (
      <table styleName="table">
        <thead>
          <tr>
            <th />
            <th styleName="name">Payment</th>
            <th>Amount</th>
            <th>Member</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {content}
          {
            loadingMemberTasks ? (
              <tr>
                <td colSpan={5}>
                  <LoadingIndicator />
                </td>
              </tr>
            ) : null
          }
        </tbody>
      </table>
    );
  } else if (loadingMemberTasks) {
    content = <LoadingIndicator />;
  } else content = 'No member payments associated with this project so far';

  return (
    <Background>
      <div styleName="container">
        <h1 styleName="title">Member Payments</h1>
        <div styleName="actionBar">
          <span styleName="text">Project</span>
          <Select
            autoBlur
            clearable={false}
            labelKey="name"
            onChange={project => selectProject(project.id)}
            options={projects}
            value={Number(selectedProjectId)}
            valueKey="id"
          />
          <div styleName="button">
            <PrimaryButton
              theme={{
                button: style.newPaymentButton,
              }}
              to="/sandbox/payments/new"
            >New payment
            </PrimaryButton>
          </div>
        </div>
        {content}
      </div>
    </Background>
  );
}

Listing.propTypes = {
  loadingMemberTasks: PT.bool.isRequired,
  memberTasks: PT.arrayOf(PT.shape()).isRequired,
  projects: PT.arrayOf(PT.shape()).isRequired,
  selectedProjectId: PT.number.isRequired,
  selectProject: PT.func.isRequired,
};
