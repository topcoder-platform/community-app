/* global
  JSON
*/

import React from 'react';
import PT from 'prop-types';

import SidebarRow from './SidebarRow';
import './style.scss';

export default function ChallengesSidebar({ SidebarMock }) {
  const all = () => (
    <SidebarRow>
      <p styleName={'l-row'}>{SidebarMock.all.name}</p>
      <p styleName={'r-row'}>{/* SidebarMock.all.value */ ''}</p>
    </SidebarRow>
  );

  const myChallenges = () => (
    <SidebarRow>
      <p styleName={'l-row'}>{SidebarMock.myChallenges.name}</p>
      <p styleName={'r-row'}>{/* SidebarMock.myChallenges.value */ ''}</p>
    </SidebarRow>
  );

  const others = SidebarMock.others.map(other => (
    <SidebarRow key={JSON.stringify(other)}>
      <p styleName={'l-row'}>{other.name}</p>
      <p styleName={'r-row'}>{/* other.value */ ''}</p>
    </SidebarRow>
  ));

  const myFilters = SidebarMock.myFilters.map(other => (
    <SidebarRow key={JSON.stringify(other)}>
      <p styleName={'l-row'}>{other.name}</p>
      <p styleName={'r-row'}>{/* other.value */ ''}</p>
    </SidebarRow>
  ));

  return (
    <div>
      <div styleName="challenges-sidebar">
        <div styleName="header">
          {all()}
        </div>

        <div styleName="challenges">
          {myChallenges()}
        </div>

        <div styleName="challenges">
          {others}
        </div>

        <div styleName="challenges">
          <div styleName="filters">
            <SidebarRow>
              <p styleName={'l-row'}>MY FILTERS</p>
              <p styleName={'r-row'}><a styleName="clickable">edit</a></p>
            </SidebarRow>
          </div>
          {myFilters}
        </div>
      </div>
      <div styleName="sidebar-footer">
        <ul>
          <li><a href="/about">About</a>&nbsp;•&nbsp;</li>
          <li><a href="https://help.topcoder.com/hc/en-us/articles/219069687-Contact-Support">Contact</a>&nbsp;•&nbsp;</li>
          <li><a href="https://help.topcoder.com/">Help</a>&nbsp;•&nbsp;</li>
          <li><a href="/community/how-it-works/privacy-policy/">Privacy</a>&nbsp;•&nbsp;</li>
          <li><a href="/community/how-it-works/terms/">Terms</a>&nbsp;•&nbsp;</li>
        </ul>
        <p styleName="copyright">Topcoder © 2017.</p>
      </div>
    </div>
  );
}

ChallengesSidebar.defaultProps = {
  SidebarMock: undefined,
};

ChallengesSidebar.propTypes = {
  SidebarMock: PT.shape(),
};
