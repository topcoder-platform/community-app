/* eslint-env browser */
import React from 'react';
import PT from 'prop-types';
import styles from './styles.scss';

const percentageFunc = n => `${(n * 100).toFixed(0)}%`;

const SRMStats = ({ subTrackDetails }) => {
  const { challenges } = subTrackDetails;
  return (
    <ul styleName="divisions">
      {
        [subTrackDetails.division1, subTrackDetails.division2]
          .map((division, i) => ({ division, i }))
          .filter(({ division: { levels } }) => levels && levels.length)
          .map(({ division, i }) => (
            <li key={`division${i + 1}`} styleName="division">
              <ul>
                <li styleName="totals">
                  <ul styleName="row">
                    <li styleName="left">
                      <h3>
                        {`division ${i + 1}`}
                      </h3>
                      <span>
TOTAL
                      </span>
                    </li>
                    <li>
                      <h3>
                        {percentageFunc(division.total.percentSuccessful)}
                      </h3>
                      <span>
SUCCESS
                      </span>
                    </li>
                    <li>
                      <h3>
                        {division.total.problemsSubmitted}
                      </h3>
                      <span>
SUBMITTED
                      </span>
                    </li>
                    <li>
                      <h3>
                        {division.total.problemsFailed}
                      </h3>
                      <span>
FAILED CHALLENGES
                      </span>
                    </li>
                    <li>
                      <h3>
                        {division.total.problemsSysByTest}
                      </h3>
                      <span>
FAILED SYS. TEST
                      </span>
                    </li>
                  </ul>
                </li>
                {
                  division.levels.map(level => (
                    <li styleName="level" key={level.levelName}>
                      <ul styleName="row">
                        <li styleName="left" className={styles.level}>
                          <h3 styleName="level">
                            {level.levelName}
                          </h3>
                        </li>
                        <li>
                          <h3>
                            {percentageFunc(level.percentSuccessful)}
                          </h3>
                          <span>
SUCCESS
                          </span>
                        </li>
                        <li>
                          <h3>
                            {level.problemsSubmitted}
                          </h3>
                          <span>
SUBMITTED
                          </span>
                        </li>
                        <li>
                          <h3>
                            {level.problemsFailed}
                          </h3>
                          <span>
FAILED CHALLENGES
                          </span>
                        </li>
                        <li>
                          <h3>
                            {level.problemsSysByTest}
                          </h3>
                          <span>
FAILED SYS. TEST
                          </span>
                        </li>
                      </ul>
                    </li>
                  ))
                }
              </ul>
            </li>
          ))
      }
      {
        challenges.levels && challenges.levels.length
        && (
        <li styleName="division">
          <ul>
            <li styleName="totals">
              <ul styleName="row">
                <li styleName="left" className={styles.wide}>
                  <h3>
CHALLENGES
                  </h3>
                  <span>
TOTAL
                  </span>
                </li>
                <li>
                  <h3>
                    {percentageFunc(challenges.total.percentSuccessful)}
                  </h3>
                  <span>
SUCCESS
                  </span>
                </li>
                <li>
                  <h3>
                    {challenges.total.problemsSubmitted}
                  </h3>
                  <span>
CREATED
                  </span>
                </li>
                <li>
                  <h3>
                    {challenges.total.problemsFailed}
                  </h3>
                  <span>
FAILED
                  </span>
                </li>
              </ul>
            </li>
            {
              challenges.levels.map(level => (
                <li styleName="level" key={level.levelName}>
                  <ul styleName="row">
                    <li styleName="left" className={`${styles.level}  ${styles.wide}`}>
                      <h3 styleName="level">
                        {level.levelName}
                      </h3>
                    </li>
                    <li>
                      <h3>
                        {percentageFunc(level.percentSuccessful)}
                      </h3>
                      <span>
SUCCESS
                      </span>
                    </li>
                    <li>
                      <h3>
                        {level.problemsSubmitted}
                      </h3>
                      <span>
CREATED
                      </span>
                    </li>
                    <li>
                      <h3>
                        {level.problemsFailed}
                      </h3>
                      <span>
FAILED
                      </span>
                    </li>
                  </ul>
                </li>
              ))
            }
          </ul>
        </li>
        )
      }
    </ul>
  );
};

SRMStats.defaultProps = {};

SRMStats.propTypes = {
  subTrackDetails: PT.shape().isRequired,
};

export default SRMStats;
