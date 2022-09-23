import React from 'react';
import PT from 'prop-types';
import ApprovalItem from './approval-item';

import './styles.scss';

function PendingApprovals({ className, events, removeEvent }) {
  return (
    <div className={className} styleName="container">
      <div styleName="reparator" />

      <div styleName="content">
        {events.map(item => (
          <ApprovalItem
            key={item.id}
            event={item}
            styleName="content-item"
            removeEvent={() => {
              removeEvent(item);
            }}
          />
        ))}
      </div>
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
};

/**
 * Prop Validation
 */
PendingApprovals.propTypes = {
  className: PT.string,
  events: PT.arrayOf(PT.shape()),
  removeEvent: PT.func,
};

export default PendingApprovals;
