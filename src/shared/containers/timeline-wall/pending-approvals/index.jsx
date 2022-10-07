import React from 'react';
import PT from 'prop-types';
import ApprovalItem from './approval-item';

import './styles.scss';

function PendingApprovals({
  className, events, removeEvent, userAvatars, deleteEvent, onApproveEvent,
}) {
  return (
    <div className={className} styleName="container">
      <div styleName="reparator" />

      <div styleName="content">
        {events.map(item => (
          <ApprovalItem
            key={item.id}
            event={item}
            styleName="content-item"
            removeEvent={removeEvent}
            userAvatars={userAvatars}
            deleteEvent={deleteEvent}
            onApproveEvent={onApproveEvent}
          />
        ))}
      </div>
      {!events.length ? (
        <span styleName="text-empty-result">No pending events.</span>
      ) : null}
    </div>
  );
}

/**
 * Default values for Props
 */
PendingApprovals.defaultProps = {
  className: '',
  events: [],
  removeEvent: () => { },
  userAvatars: {},
};

/**
 * Prop Validation
 */
PendingApprovals.propTypes = {
  className: PT.string,
  events: PT.arrayOf(PT.shape()),
  removeEvent: PT.func,
  userAvatars: PT.shape(),
  deleteEvent: PT.func.isRequired,
  onApproveEvent: PT.func.isRequired,
};

export default PendingApprovals;
