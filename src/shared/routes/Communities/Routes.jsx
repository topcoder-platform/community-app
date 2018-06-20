/**
 * Auxiliary wrapper, which returns routes for the specified community.
 */

import PT from 'prop-types';
import React from 'react';

import Blockchain from './Blockchain';
import Community2 from './Community2';
import CS from './CS';
import DemoExpert from './DemoExpert';
import QA from './QA';
import SRMx from './SRMx';
import TaskForce from './TaskForce';
import TcProdDev from './TcProdDev';
import Veterans from './Veterans';
import Wipro from './Wipro';
import Cognitive from './Cognitive';
import IoT from './iot';
import TCO19 from './TCO19';
import Mobile from './Mobile';

export default function Communities({
  base, communityId, member, meta,
}) {
  switch (communityId) {
    case 'blockchain':
      return <Blockchain base={base} member={member} meta={meta} />;
    case 'community-2': return <Community2 base={base} meta={meta} />;
    case 'cs': return <CS base={base} meta={meta} />;
    case 'demo-expert': return <DemoExpert base={base} meta={meta} />;
    case 'qa': return <QA base={base} member={member} meta={meta} />;
    case 'srmx': return <SRMx base={base} meta={meta} />;
    case 'taskforce': return <TaskForce base={base} meta={meta} />;
    case 'tc-prod-dev': return <TcProdDev base={base} meta={meta} />;
    case 'veterans':
      return <Veterans base={base} member={member} meta={meta} />;
    case 'wipro': return <Wipro base={base} meta={meta} />;
    case 'cognitive': return <Cognitive base={base} member={member} meta={meta} />;
    case 'iot': return <IoT base={base} meta={meta} />;
    case 'tco19': return <TCO19 base={base} meta={meta} />;
    case 'mobile': return <Mobile base={base} />;
    default: throw new Error('Unknown community ID!');
  }
}

Communities.defaultProps = {
  base: '',
};

Communities.propTypes = {
  base: PT.string,
  communityId: PT.string.isRequired,
  member: PT.bool.isRequired,
  meta: PT.shape().isRequired,
};
