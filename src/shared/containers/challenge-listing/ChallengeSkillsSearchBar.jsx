/* eslint-disable jsx-a11y/label-has-for */
/**
 * Dropdown skills component.
 */
import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import actions from 'actions/challenge-listing/filter-panel';
import challengeListingActions from 'actions/challenge-listing';
import PT from 'prop-types';
import DropdownSkills from 'components/GUIKit/DropdownSkills';
import './ChallengeSkillsSearchBar.scss';

function ChallengeSkillsSearchBar({
  setSearchSkills,
  setFilterState,
  searchSkills,
  filterState,
  auth,
}) {
  return (
    <div styleName="container">
      <DropdownSkills
        terms={searchSkills.map(skill => ({
          label: skill,
          selected: true,
        }))}
        onChange={(newSkill) => {
          const skillStrings = (newSkill || []).map(skill => skill.label);
          setSearchSkills(skillStrings);
          setFilterState({ ..._.clone(filterState), searchSkills: skillStrings });
        }}
        placeholder="Search Skills"
        addNewOptionPlaceholder="Type to add another skill..."
        cacheOptions
        auth={auth}
      />
    </div>
  );
}

ChallengeSkillsSearchBar.defaultProps = {
  searchSkills: [],
};

ChallengeSkillsSearchBar.propTypes = {
  setFilterState: PT.func.isRequired,
  filterState: PT.shape().isRequired,
  setSearchSkills: PT.func.isRequired,
  auth: PT.shape({
    profile: PT.shape(),
    tokenV3: PT.string,
    user: PT.shape(),
  }).isRequired,
  searchSkills: PT.arrayOf(PT.string),
};

function mapDispatchToProps(dispatch) {
  const a = actions.challengeListing.filterPanel;
  const cla = challengeListingActions.challengeListing;
  return {
    setSearchSkills: text => dispatch(a.setSearchSkills(text)),
    setFilterState: s => dispatch(cla.setFilter(s)),
  };
}

function mapStateToProps(state) {
  const cl = state.challengeListing;
  return {
    auth: state.auth,
    filterState: cl.filter,
    searchSkills: state.challengeListing.filterPanel.searchSkills,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ChallengeSkillsSearchBar);
