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
import tco01 from './TCO01';
import tco02 from './TCO02';
import tco03 from './TCO03';
import tco04 from './TCO04';
import tco05 from './TCO05';
import tco06 from './TCO06';
import tco07 from './TCO07';
import tco08 from './TCO08';
import tco09 from './TCO09';
import tco10 from './TCO10';
import tco11 from './TCO11';
import tco12 from './TCO12';
import tco13 from './TCO13';
import tco14 from './TCO14';
import tco15 from './TCO15';
import tco16 from './TCO16';
import tco17 from './TCO17';
import tco18 from './TCO18';
import tco19 from './TCO19';
import tco20 from './TCO20';
import tco21 from './TCO21';
import tco22 from './TCO22';
import tco23 from './TCO23';
import Mobile from './Mobile';
import Zurich from './Zurich';

const TCOs = {
  tco01,
  tco02,
  tco03,
  tco04,
  tco05,
  tco06,
  tco07,
  tco08,
  tco09,
  tco10,
  tco11,
  tco12,
  tco13,
  tco14,
  tco15,
  tco16,
  tco17,
  tco18,
  tco19,
  tco20,
  tco21,
  tco22,
  tco23,
};

export default function Communities({
  base, communityId, member, meta,
}) {
  switch (communityId) {
    case 'blockchain': return <Blockchain base={base} member={member} meta={meta} />;
    case 'community-2': return <Community2 base={base} meta={meta} />;
    case 'cs': return <CS base={base} meta={meta} />;
    case 'zurich': return <Zurich base={base} meta={meta} />;
    case 'demo-expert': return <DemoExpert base={base} meta={meta} />;
    case 'qa': return <QA base={base} member={member} meta={meta} />;
    case 'srmx': return <SRMx base={base} meta={meta} />;
    case 'taskforce': return <TaskForce base={base} meta={meta} />;
    case 'tc-prod-dev': return <TcProdDev base={base} meta={meta} />;
    case 'veterans': return <Veterans base={base} member={member} meta={meta} />;
    case 'wipro': return <Wipro base={base} meta={meta} />;
    case 'cognitive': return <Cognitive base={base} member={member} meta={meta} />;
    case 'iot': return <IoT base={base} meta={meta} />;
    case 'mobile': return <Mobile base={base} meta={meta} />;
    default:
      // to avoid listing all TCOs we use defaut switch with a check
      if (TCOs[communityId]) {
        const TCOCommunity = TCOs[communityId];
        return <TCOCommunity base={base} meta={meta} />;
      }
      throw new Error('Unknown community ID!');
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
