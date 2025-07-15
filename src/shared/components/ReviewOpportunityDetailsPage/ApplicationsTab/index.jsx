/**
 * Tab that will display a list of the review opportunity applicants for the challenge
 */
import moment from 'moment';
import React from 'react';
import PT from 'prop-types';
import _ from 'lodash';

import './styles.scss';

/**
 * ApplicationsTab Component
 */
const ApplicationsTab = ({ applications }) => (
  <div styleName="container">
    <h3>
      Review Applications
    </h3>
    <div styleName="head">
      <div styleName="col-1">
        Handle
      </div>
      <div styleName="col-2">
        Role
      </div>
      <div styleName="col-3">
        Application Date
      </div>
    </div>
    <div styleName="body">
      {
        applications
        && applications.filter(app => app.status !== 'CANCELLED').map(app => (
          <div styleName="row" key={`${app.handle} ${app.role}`}>
            <div styleName="col-1">
              <a href={`${window.origin}/members/${app.handle}`} target={`${_.includes(window.origin, 'www') ? '_self' : '_blank'}`}>
                {app.handle}
              </a>
            </div>
            <div styleName="col-2">
              <div styleName="sm-only title">
                Role
              </div>
              {app.role}
            </div>
            <div styleName="col-3">
              <div styleName="sm-only title">
                Application Date
              </div>
              <div>
                <span>
                  {moment(app.applicationDate).format('MMM DD  HH:mm z')}
                </span>
              </div>
            </div>
          </div>
        ))
      }
    </div>
  </div>
);

/**
 * Default values for Props
 */
ApplicationsTab.defaultProps = {
  applications: [],
};

/**
 * Prop Validation
 */
ApplicationsTab.propTypes = {
  applications: PT.arrayOf(PT.shape()),
};

export default ApplicationsTab;
