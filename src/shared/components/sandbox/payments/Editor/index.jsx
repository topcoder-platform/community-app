/**
 * Payment editor.
 */

import PT from 'prop-types';
import React from 'react';
import Select from 'components/Select';
import { PrimaryButton } from 'components/buttons';

import Avatar from '../../../Avatar';
import Background from '../Background';

import './style.scss';

export default function Editor({
  projects,
  selectedProjectId,
  selectProject,
}) {
  return (
    <Background escapeButton>
      <div styleName="container">
        <h1 styleName="title">New Member Payment</h1>
        <div styleName="form">
          <div styleName="field">
            <span styleName="label">Project</span>
            <Select
              autoBlur
              labelKey="name"
              onChange={project => selectProject(project.id)}
              options={projects}
              valueKey="id"
              value={Number(selectedProjectId)}
            />
          </div>
          <div styleName="field">
            <span styleName="label">Billing account</span>
            <Select autoBlur />
          </div>
          <div styleName="fieldGap" />
          <div styleName="field">
            <span styleName="label">Title</span>
            <input placeholder="Topcoder payment" />
          </div>
          <div styleName="field">
            <span styleName="label">Description</span>
            <textarea rows={3} placeholder="payment is for ..." />
          </div>
          <div styleName="field">
            <span styleName="label">Assign to</span>
            <div styleName="withPrefix">
              <div styleName="prefix">
                <div styleName="avatarPrefix" >
                  <Avatar />
                </div>
              </div>
              <input placeholder="Type handle to assign member" />
            </div>
          </div>
          <div styleName="field">
            <span styleName="label">Amount</span>
            <div styleName="withPrefix">
              <div styleName="prefix">
                <div styleName="textPrefix">$</div>
              </div>
              <input placeholder="0" />
            </div>
          </div>
          <div styleName="action">
            <PrimaryButton
              to="/sandbox/payments/123/done"
            >Pay now</PrimaryButton>
          </div>
        </div>
      </div>
    </Background>
  );
}

Editor.propTypes = {
  projects: PT.arrayOf(PT.object).isRequired,
  selectedProjectId: PT.number.isRequired,
  selectProject: PT.func.isRequired,
};
