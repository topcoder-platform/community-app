/**
 * Scoreboard Table
 *
 * Description:
 *   Table that displays challenge scoreboard
 *
 * Usage:
 *   <ScoreboardTable submissions={this.props.submissions} />
 *
 * Props:
 *   - submissions (required): Array of Top Coder user object, with
 *     the following properties:
 *      - rank: Number. User current ranking in the leaderboard
 *      - handle: String, required. User handle
 *      - score: Number, required. The user's current score
 *      - type: string, required. The submission type.
 *      - time: date, required. The submission time.
 *      - state: string, required. The submission state.
 */

import React from 'react';
import PT from 'prop-types';

import codeFields from 'shared/fields/submissionCodeFields.json';
import designFields from 'shared/fields/submissionDesignFields.json';

import { config } from 'topcoder-react-utils';

import styles from './styles.scss'; // eslint-disable-line no-unused-vars

export default function ScoreboardTable(props) {
  const {
    challenge,
  } = props;

  const fields = challenge.type === 'Code' ? codeFields.fields : designFields.fields;

  const getTemplateValues = (fields2, submission) => (
    /* eslint-disable react/no-array-index-key */
    fields2.map((field, index) => (
      <td key={index}>
        {submission ? submission[field.fieldName] : 'test'}
      </td>
    ))
    /* eslint-enable react/no-array-index-key */
  );

  const renderTableRows = subs => (
    subs.map((submission, index) => { // eslint-disable-line
      return (
        <tr key={submission.id}>
          <td styleName="styles.col-rank">
            {index + 1}
          </td>
          <td styleName="styles.col-handle">
            <a href={`${config.URL.BASE}/members/${submission.handle}/`}>
              {submission.handle}
            </a>
          </td>
          {getTemplateValues(fields, challenge.type === 'Code' ? submission.submissionCode : submission.submissionDesign)}
        </tr>
      );
    })
  );

  /* eslint-disable react/no-array-index-key */
  const getTemplateHeader = fields2 => (
    fields2.map((field, index) => (
      <th key={index}>
        {field.fieldText}
      </th>
    ))
  );
  /* eslint-enable react/no-array-index-key */

  return (
    <table styleName="styles.LeaderboardTable">
      <thead>
        <tr>
          <th styleName="styles.col-rank">
Rank
          </th>
          <th styleName="styles.col-handle">
Handle
          </th>
          {getTemplateHeader(fields)}
        </tr>
      </thead>
      <tbody>
        {renderTableRows(challenge.submissions)}
      </tbody>
    </table>
  );
}

ScoreboardTable.propTypes = {
  challenge: PT.shape({
    id: PT.number,
  }).isRequired,
};
