import React, { useState } from 'react';
import PropTypes from 'prop-types';
import LoadingIndicator from 'components/LoadingIndicator';
import MemberSearchTab from './MemberSearchTab';
import MemberSearchItem from './MemberSearchItem';

import './style.scss';

const MemberSearchView = (props) => {
  const [currentTab, setCurrentTab] = useState(0);

  const {
    pageLoaded,
    usernameMatches,
    topMembers,
  } = props;
  const { previousSearchTerm: searchTerm } = props;

  const currentItems = currentTab ? topMembers : usernameMatches;

  return (
    <div styleName="member-search-wrapper">
      <div styleName="member-search">
        <h2 styleName="title">SEARCH RESULTS</h2>

        <p styleName="search-term">ITEMS MATCHING “{searchTerm}”</p>

        <MemberSearchTab
          userNameCount={usernameMatches.length}
          skillsCount={topMembers.length}
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
        />

        <div styleName="member-search-item-wrapper">
          {
            pageLoaded
              ? (
                <React.Fragment>
                  {
                    currentItems.length
                      ? currentItems.map((item, index) => (
                        <MemberSearchItem index={index} item={item} />
                      )) : <div styleName="no-items"><span>No items available</span></div>
                  }
                </React.Fragment>
              )
              : <LoadingIndicator />
          }
        </div>

      </div>
    </div>
  );
};

MemberSearchView.propTypes = {
  pageLoaded: PropTypes.bool.isRequired,
  usernameMatches: PropTypes.arrayOf(PropTypes.shape({
    handle: PropTypes.string,
  })).isRequired,
  topMembers: PropTypes.arrayOf(PropTypes.shape({})).isRequired,

  previousSearchTerm: PropTypes.string,
  searchTermTag: PropTypes.shape({}),
};

MemberSearchView.defaultProps = {
  previousSearchTerm: null,
  searchTermTag: null,
};

export default MemberSearchView;
