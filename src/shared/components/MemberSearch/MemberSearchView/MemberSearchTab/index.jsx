import React, { useState } from 'react';
import PT from 'prop-types';
import { useMediaQuery } from 'react-responsive';
import ArrowIcon from 'assets/images/ico-arrow-down.svg';
import cn from 'classnames';

import './styles.scss';

const MemberSearchTab = ({
  currentTab, setCurrentTab, userNameCount, skillsCount,
}) => {
  const tabs = ['USERNAMES MATCHING', 'SKILLS MATCHING'];
  const [isTabClosed, setIsTabClosed] = useState(true);

  const matchingResults = [userNameCount, skillsCount];

  const desktop = useMediaQuery({ minWidth: 1024 });

  const tabDetail = tabs.map(((tab, index) => (
    <span
      role="presentation"
      onClick={() => {
        setCurrentTab(index);
        setIsTabClosed(true);
      }}
      styleName={`tab ${index === currentTab ? 'active' : ''}`}
      key={tab}
    >
      {tab}
      {
        matchingResults[index] ? (
          <span styleName="count">{
            index ? `Top ${matchingResults[index]}` : matchingResults[index]
          }
          </span>
        ) : null
      }
    </span>
  )));

  return (
    <React.Fragment>
      {
        !desktop ? (
          <div styleName="mobile-member-search-tab">
            <div
              styleName="mobile-tab-container"
              role="presentation"
              onClick={() => setIsTabClosed(!isTabClosed)}
            >
              <div styleName="mobile-tab-left-content">
                <p styleName="title">
                  {tabs[currentTab]}
                  {
                    matchingResults[currentTab] ? (
                      <span styleName="count count-title">{
                        currentTab ? `Top ${matchingResults[currentTab]}` : matchingResults[currentTab]
                      }
                      </span>
                    ) : null
                  }
                </p>

              </div>

              <div
                role="presentation"
                styleName={cn('icon', { down: !isTabClosed })}
                onClick={() => setIsTabClosed(!isTabClosed)}
              >
                <ArrowIcon />
              </div>
            </div>
            {
              !isTabClosed && (
                <div styleName="mobile-tab-expanded">
                  {tabDetail}
                </div>
              )
            }
          </div>
        ) : (
          <div styleName="member-search-tab">
            {tabDetail}
          </div>
        )
      }
    </React.Fragment>
  );
};

MemberSearchTab.defaultProps = {
  userNameCount: 0,
  skillsCount: 0,
  currentTab: 0,
};

MemberSearchTab.propTypes = {
  userNameCount: PT.number,
  skillsCount: PT.number,
  currentTab: PT.number,
  setCurrentTab: PT.func.isRequired,
};

export default MemberSearchTab;
