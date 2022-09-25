import React from 'react';
import PT from 'prop-types';
import { v4 as uuidv4 } from 'uuid';

import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';

import BulletIcon from 'assets/images/timeline/bullet-point.svg';

import './styles.scss';
import AdminCard from '../AdminCard';

const AdminTimeline = ({ pendingApprovals, onSelectAsset }) => (
  <VerticalTimeline
    layout="1-columns"
    animate={false}
    className="admin-timeline"
  >
    {
        pendingApprovals.map(pendingApproval => (
          <VerticalTimelineElement
            key={uuidv4()}
            icon={<BulletIcon />}
          >
            <AdminCard pendingApproval={pendingApproval} onSelectAsset={onSelectAsset} />
          </VerticalTimelineElement>
        ))
      }
  </VerticalTimeline>
);

AdminTimeline.defaultProps = {
  pendingApprovals: [],
};

AdminTimeline.propTypes = {
  pendingApprovals: PT.arrayOf(PT.shape()),
  onSelectAsset: PT.func.isRequired,
};

export default AdminTimeline;
