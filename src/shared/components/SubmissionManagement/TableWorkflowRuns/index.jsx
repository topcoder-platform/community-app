import React from 'react';
import PT from 'prop-types';
import moment from 'moment-timezone';
import { config } from 'topcoder-react-utils';

import './styles.scss';

const TABLE_DATE_FORMAT = 'MMM DD YYYY, HH:mm A';

const getRunStatusText = (run) => {
  if (!run) return '';

  if (run.status === 'IN_PROGRESS' || run.status === 'QUEUED') return 'Pending';
  if (run.status === 'FAILED') return 'Failed';
  if (run.status === 'SUCCESS') {
    const passingScore = run.workflow && run.workflow.scorecard
      ? run.workflow.scorecard.minimumPassingScore
      : 0;
    return run.score >= passingScore ? 'Passed' : 'Failed Score';
  }

  return run.status;
};

export default function TableWorkflowRuns(props) {
  const { workflowRuns } = props;
  if (!workflowRuns || Object.keys(workflowRuns).length === 0) {
    return null;
  }
  return (
    <div style={{ marginBottom: '15px' }}>
      <table styleName="workflow-table">
        <thead>
          <tr>
            <th>AI Reviewer</th>
            <th>Review Date</th>
            <th>Score</th>
            <th>Result</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(workflowRuns).map(([workflowId, run]) => (
            <tr key={workflowId}>
              <td>{run.workflow.name}</td>
              <td>{run.status === 'SUCCESS' && (
                moment(run.completedAt)
                  .local()
                  .format(TABLE_DATE_FORMAT)
              )}
              </td>
              <td>
                {(() => {
                  if (run.status !== 'SUCCESS') return '-';
                  if (run.workflow.id) {
                    return (
                      <a
                        href={`${config.REVIEW_APP_URL}/scorecard/${run.workflow.scorecard.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {run.score}
                      </a>
                    );
                  }
                  return run.score;
                })()}
              </td>
              <td>{getRunStatusText(run)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

TableWorkflowRuns.defaultProps = {
  workflowRuns: [],
};

TableWorkflowRuns.propTypes = {
  workflowRuns: PT.shape(),
};
