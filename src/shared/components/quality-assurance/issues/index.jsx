
import React from 'react';
import PT from 'prop-types';
import { IntlProvider, FormattedRelative } from 'react-intl';
import './style.scss';

export default function QualityAssuranceIssues(props) {
  const issues = props.issues.map(issue => (
    <div styleName="flex-cell" key={issue.id}>
      <div styleName="flex-issue" key={`${issue.id}_issue`}>
        <div styleName="flex-issue-content-img" key={`${issue.id}_user`}>
          <img styleName="flex-issue-img" alt="" title={`${issue.user.login} opened this issue`} src={issue.user.avatar_url} />
        </div>
        <div styleName="flex-issue-content">
          <div styleName="flex-issue-title" key={`${issue.id}_title`}>{issue.title}</div>
          <div styleName="flex-issue-labels" key={`${issue.id}_labels`}>
            {issue.labels.map(label => <div styleName="flex-issue-label" key={`${label.id}_label`}>{label.name}</div>)}
          </div>
          <div styleName="flex-issue-updated" key={`${issue.id}_updated`}>
            {`#${issue.number} opened `}
            <IntlProvider locale="en">
              <FormattedRelative value={issue.created_at} />
            </IntlProvider>
            {` by ${issue.user.login} `}
            <svg styleName="flex-issue-updated-icons" aria-hidden="true" height="16" width="14" version="1.1" viewBox="0 0 14 16" >
              <path fillRule="evenodd" d="M8 8h3v2H7c-.55 0-1-.45-1-1V4h2v4zM7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 0 1 1.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7z" />
            </svg>
            {' updated '}
            <IntlProvider locale="en">
              <FormattedRelative value={issue.updated_at} />
            </IntlProvider>
          </div>
        </div>
        <div styleName="flex-issue-content-img" key={`${issue.id}_assignee`}>
          {issue.assignee ?
            <img styleName="flex-issue-img" alt="" title={`Assigned to ${issue.assignee.login}`} src={issue.assignee.avatar_url} />
            : ''
          }
        </div>
      </div>
    </div>
  ));

  return (
    <div styleName="flex-container">
      {issues}
    </div>
  );
}

QualityAssuranceIssues.defaultProps = {
  issues: [],
};

QualityAssuranceIssues.propTypes = {
  issues: PT.arrayOf(PT.shape),
};
