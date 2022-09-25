import React from 'react';

import PT from 'prop-types';

import './styles.scss';

const AdminNavigation = ({ currentTab, setCurrentTab, numOfPendingApprovals }) => {
  const tabs = [
    { id: 0, title: 'TIMELINE VIEW' },
    { id: 1, title: 'PENDING APPROVALS' },
  ];

  return (
    <div styleName="admin-nav">
      {
          tabs.map(tab => (
            <p
              role="presentation"
              onClick={() => setCurrentTab(tab.id)}
              key={tab.id}
              styleName={`tab-item ${currentTab === tab.id ? 'current' : ''}`}
            >{tab.title}
              {
              tab.id === 1 && numOfPendingApprovals > 0 ? (
                <span styleName="pending">{numOfPendingApprovals}</span>
              ) : null
            }
            </p>
          ))
        }
    </div>
  );
};

AdminNavigation.defaultProps = {
  currentTab: 0,
  numOfPendingApprovals: 0,
};

AdminNavigation.propTypes = {
  currentTab: PT.number,
  setCurrentTab: PT.func.isRequired,
  numOfPendingApprovals: PT.number,
};

export default AdminNavigation;
