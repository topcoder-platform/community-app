/**
 * Payments listing.
 */

import LoadingIndicator from 'components/LoadingIndicator';
import PT from 'prop-types';
import React from 'react';
import Select from 'components/Select';
import { Link } from 'react-router-dom';
import { PrimaryButton } from 'components/buttons';

import Background from '../Background';

import './style.scss';

const mockData = [{
  id: '123',
  amount: 50,
  member: 'coder',
  name: '[Common] "wins" must display in-line to the number of wins',
  status: 'scheduled',
}, {
  amount: 75,
  id: '124',
  member: 'mike',
  name: '[Common] Long usernames won\'t display in landscape mode',
  status: 'paid',
}, {
  amount: 100,
  id: '125',
  member: 'tom',
  name: 'After clicking "Load more button" everything crushes',
  status: 'paid',
}];

export default function Listing({
  loadingMemberTasks,
  memberTasks,
  projects,
  selectedProjectId,
  selectProject,
}) {
  const selectedProjectIdNum = Number(selectedProjectId);
  const content = memberTasks
    .filter(item => item.projectId === selectedProjectIdNum)
    .map(item => (
      <tr key={item.id}>
        <td><Link to="/sandbox/payments/123">{item.name}</Link></td>
        <td>{`$${item.prizes[0]}`}</td>
        <td>{item.member || 'topcoder'}</td>
        <td>{item.status}</td>
      </tr>
    ));
  return (
    <Background>
      <div styleName="container">
        <h1 styleName="title">Member Payments</h1>
        Project
        <Select
          clearable={false}
          labelKey="name"
          onChange={project => selectProject(project.id)}
          options={projects}
          value={Number(selectedProjectId)}
          valueKey="id"
        />
        <PrimaryButton
          to="/sandbox/payments/123"
        >New payment</PrimaryButton>
        <table styleName="table">
          <thead>
            <tr>
              <th>Payment</th>
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
                  <td>
                    <LoadingIndicator />
                  </td>
                </tr>
              ) : null
            }
          </tbody>
        </table>
      </div>
    </Background>
  );
}

Listing.propTypes = {
  loadingMemberTasks: PT.bool.isRequired,
  memberTasks: PT.arrayOf(PT.shape()).isRequired,
  projects: PT.arrayOf(PT.shape()).isRequired,
  selectedProjectId: PT.string.isRequired,
  selectProject: PT.func.isRequired,
};
