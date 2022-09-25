import React, { useState } from 'react';
import PT from 'prop-types';

import InputField from '../InputField';
import GuestCard from '../GuestCard';
import AdminNavigation from '../AdminNavigation';
import Form from '../Form';

import './styles.scss';

const TimelineHeader = ({
  userLoggedIn, isAdmin, currentTab, setCurrentTab, numOfPendingApprovals,
}) => {
  const [openForm, setOpenForm] = useState(false);

  const onSubmit = () => {};

  return (
    <div styleName="header">
      <div styleName="wave" />

      <div styleName="header-content">
        {
          isAdmin ? (
            <AdminNavigation
              currentTab={currentTab}
              setCurrentTab={setCurrentTab}
              numOfPendingApprovals={numOfPendingApprovals}
            />
          ) : (
            <h1 styleName="title">Topcoder Timeline Wall</h1>
          )
        }
        {
          currentTab ? null
            : (
              <React.Fragment>
                {
              userLoggedIn ? (
                <React.Fragment>
                  {
                    openForm ? (
                      <Form onCancel={() => setOpenForm(false)} onSubmit={onSubmit} />
                    ) : (
                      <InputField onClick={() => setOpenForm(true)} />
                    )
                  }
                </React.Fragment>
              ) : <GuestCard />
            }
              </React.Fragment>
            )
        }
      </div>
    </div>
  );
};

TimelineHeader.defaultProps = {
  currentTab: 0,
  userLoggedIn: false,
  isAdmin: false,
  numOfPendingApprovals: 0,
};

TimelineHeader.propTypes = {
  userLoggedIn: PT.bool,
  isAdmin: PT.bool,
  setCurrentTab: PT.func.isRequired,
  numOfPendingApprovals: PT.number,
  currentTab: PT.number,
};

export default TimelineHeader;
