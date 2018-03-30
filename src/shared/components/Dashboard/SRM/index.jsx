import React from 'react';
import PT from 'prop-types';

import { utils } from 'topcoder-react-utils';

import SRMTile from './SRMTile';
import './styles.scss';

const SRM = (props) => {
  const { srms } = props;
  return (
    <div styleName="srms">
      <header>
        <h1 styleName="section-title">
          Single Round Matches
        </h1>
      </header>
      <section>
        <div styleName="srm-tiles">
          {
            srms.map(srm => (
              <div styleName="srm-tile" key={srm.id}>
                <SRMTile srm={srm} />
              </div>
            ))
          }
          <div styleName="srm-links-card">
            <div styleName="flex-wrapper">
              <h2>Practice on past problems</h2>
              <a href={`${utils.config.URL.ARENA}/#/u/practiceProblemList`} className="tc-btn tc-btn-s tc-btn-wide tc-btn-ghost" styleName="tc-btn">Practice Problems</a>
              <a href={`${utils.config.URL.COMMUNITY}/tc?module=ProblemArchive`} className="tc-btn tc-btn-s tc-btn-wide tc-btn-ghost" styleName="tc-btn">Problem Archive</a>
              <a href={`${utils.config.URL.BASE}/member-onboarding/learning-practicing-skills/`} className="tc-btn tc-btn-s tc-btn-wide tc-btn-ghost" styleName="tc-btn">Learn More</a>
            </div>
          </div>
        </div>
      </section>
      <div styleName="srms-links">
        <a href={`${utils.config.URL.BASE}/my-srms/`}>View Past SRMS</a>
        <a href={utils.config.URL.ARENA}>Launch Arena</a>
      </div>
    </div>
  );
};

SRM.propTypes = {
  srms: PT.arrayOf(PT.shape()),
};

SRM.defaultProps = {
  srms: [],
};

export default SRM;
