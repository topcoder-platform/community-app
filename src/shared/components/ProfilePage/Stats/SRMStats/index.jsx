/* eslint-env browser */
import React from 'react';
import PT from 'prop-types';
import './styles.scss';

const percentageFunc = n => `${(n * 100).toFixed(0)}%`;

const SRMStats = ({ subTrackDetails }) => {
  const { challenges } = subTrackDetails;
  return (
    <div styleName="divisions-container">
      {
        [subTrackDetails.division1, subTrackDetails.division2]
          .map((division, i) => ({ division, i }))
          .filter(({ division: { levels } }) => levels && levels.length)
          .map(({ division, i }) => (
            <React.Fragment>
              <table key={`division${i + 1}`} styleName="division">
                <thead>
                  <tr>
                    <th>
                      <h5>
                        {`Division ${i + 1}`}
                      </h5>
                    </th>
                    <th>
                      <h5>
                        SUCCESS
                      </h5>
                    </th>
                    <th>
                      <h5>
                        CREATED
                      </h5>
                    </th>
                    <th>
                      <h5>
                        FAILED CHALLENGES
                      </h5>
                    </th>
                    <th>
                      <h5>
                        FAILED SYS TEST
                      </h5>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <h5>
                        TOTAL
                      </h5>
                    </td>
                    <td>
                      <h5>
                        {percentageFunc(division.total.percentSuccessful)}
                      </h5>
                    </td>
                    <td>
                      <h5>
                        {division.total.problemsSubmitted}
                      </h5>
                    </td>
                    <td>
                      <h5>
                        {division.total.problemsFailed}
                      </h5>
                    </td>
                    <td>
                      <h5>
                        {division.total.problemsSysByTest}
                      </h5>
                    </td>
                  </tr>
                  { division.levels.map(level => (
                    <tr key={level.levelName}>
                      <td>
                        <h5>
                          {level.levelName}
                        </h5>
                      </td>
                      <td>
                        <h5>
                          {percentageFunc(level.percentSuccessful)}
                        </h5>
                      </td>
                      <td>
                        <h5>
                          {level.problemsSubmitted}
                        </h5>
                      </td>
                      <td>
                        <h5>
                          {level.problemsFailed}
                        </h5>
                      </td>
                      <td>
                        <h5>
                          {level.problemsSysByTest}
                        </h5>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <hr />
            </React.Fragment>
          ))
      }
      {
        challenges.levels && challenges.levels.length
        && (
        <table styleName="division">
          <thead styleName="wide">
            <tr>
              <th>
                <h5>
                  Challenges
                </h5>
              </th>
              <th>
                <h5>
                  SUCCESS
                </h5>
              </th>
              <th>
                <h5>
                  CREATED
                </h5>
              </th>
              <th>
                <h5>
                  FAILED
                </h5>
              </th>
            </tr>
          </thead>
          <tbody styleName="wide">
            <tr>
              <td>
                <h5>
                  TOTAL
                </h5>
              </td>
              <td>
                <h5>
                  {percentageFunc(challenges.total.percentSuccessful)}
                </h5>
              </td>
              <td>
                <h5>
                  {challenges.total.problemsSubmitted}
                </h5>
              </td>
              <td>
                <h5>
                  {challenges.total.problemsFailed}
                </h5>
              </td>
            </tr>
            { challenges.levels.map(level => (
              <tr key={level.levelName}>
                <td>
                  <h5>
                    {level.levelName}
                  </h5>
                </td>
                <td>
                  <h5>
                    {percentageFunc(level.percentSuccessful)}
                  </h5>
                </td>
                <td>
                  <h5>
                    {level.problemsSubmitted}
                  </h5>
                </td>
                <td>
                  <h5>
                    {level.problemsFailed}
                  </h5>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        )}
    </div>
  );
};

SRMStats.defaultProps = {};

SRMStats.propTypes = {
  subTrackDetails: PT.shape().isRequired,
};

export default SRMStats;
