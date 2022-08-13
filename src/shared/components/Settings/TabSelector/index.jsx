import React, { useState } from 'react';
import cn from 'classnames';
import { useMediaQuery } from 'react-responsive';
import ArrowIcon from 'assets/images/ico-arrow-down.svg';
import PT from 'prop-types';

import './styles.scss';
import _ from 'lodash';

const TabSelector = ({
  activeTab,
  tabs,
  selectTab,
}) => {
  const desktop = useMediaQuery({ minWidth: 1024 });
  const [currentSelected, setCurrentSelected] = useState(activeTab);
  const [isTabClosed, setIsTabClosed] = useState(true);

  const onActiveClick = (tab) => {
    setCurrentSelected(tab.link);
    setIsTabClosed(true);
    setImmediate(() => {
      selectTab(tab.link);
    });
  };

  const desktopTab = (
    <ul styleName="tab">
      {
        tabs.map(tab => (
          <li
            key={tab.title}
            styleName={cn('item', { active: tab.link === currentSelected })}
            onClick={() => onActiveClick(tab)}
            onKeyDown={(e) => {
              if (e.key !== 'Enter') {
                return;
              }
              onActiveClick(tab);
            }}
            role="presentation"
          >
            {tab.title}
          </li>
        ))
      }
    </ul>
  );

  const mobileTab = (
    <React.Fragment>
      <div
        styleName="mobile-tab-container"
        role="presentation"
        onClick={() => setIsTabClosed(!isTabClosed)}
      >
        <p styleName="title">{_.find(tabs, { link: currentSelected }).title}</p>
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
            {
              tabs.map(tab => (
                <div
                  key={tab.title}
                  role="presentation"
                  onClick={() => onActiveClick(tab)}
                  styleName={cn('item', { active: tab.link === currentSelected })}
                >
                  <p>{tab.title}</p>
                </div>
              ))
            }
          </div>
        )
      }
    </React.Fragment>
  );

  return desktop ? desktopTab : mobileTab;
};

TabSelector.defaultProps = {
  activeTab: 0,
  tabs: [],
};

TabSelector.propTypes = {
  activeTab: PT.number,
  tabs: PT.arrayOf(PT.string),
  selectTab: PT.func.isRequired,
};

export default TabSelector;
