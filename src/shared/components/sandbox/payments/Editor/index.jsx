/**
 * Payment editor.
 */

import PT from 'prop-types';
import React from 'react';
import Select from 'components/Select';
import { PrimaryButton } from 'components/buttons';

import Background from '../Background';

import './style.scss';

export default function Editor({
  projects,
  selectedProjectId,
  selectProject,
}) {
  return (
    <Background>
      <div styleName="container">
        <h1 styleName="title">New Member Payment</h1>
        Project
        <Select
          labelKey="name"
          onChange={project => selectProject(project.id)}
          options={projects}
          valueKey="id"
          value={Number(selectedProjectId)}
        />
        Billing account
        <Select />
        Title
        <Select />
        Description
        <Select />
        Assign to
        <Select />
        Amount
        <Select />
        <PrimaryButton
          to="/sandbox/payments/123/done"
        >Pay now</PrimaryButton>
      </div>
    </Background>
  );
}

Editor.propTypes = {
  projects: PT.arrayOf(PT.object).isRequired,
  selectedProjectId: PT.string.isRequired,
  selectProject: PT.func.isRequired,
};
