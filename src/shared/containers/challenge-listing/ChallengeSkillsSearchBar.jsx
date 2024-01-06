/* eslint-disable jsx-a11y/label-has-for */
/**
 * Dropdown skills component.
 */
import React, { useMemo } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import challengeListingActions from 'actions/challenge-listing';
import PT from 'prop-types';
import DropdownSkills from 'components/GUIKit/DropdownSkills';
import { getSkills } from 'utils/skills';
import './ChallengeSkillsSearchBar.scss';

function ChallengeSkillsSearchBar({
  setFilterState,
  filterState,
  auth,
}) {
  const skills = useMemo(() => (filterState.searchSkills || []).map(skill => ({
    label: getSkills(skill),
    value: skill,
    selected: true,
  })), [filterState.searchSkills]);

  return (
    <div styleName="container">
      <DropdownSkills
        terms={skills}
        onChange={(newSkill) => {
          const skillStrings = (newSkill || []).map(skill => skill.value);
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
};

ChallengeSkillsSearchBar.propTypes = {
  setFilterState: PT.func.isRequired,
  filterState: PT.shape().isRequired,
  auth: PT.shape({
    profile: PT.shape(),
    tokenV3: PT.string,
    user: PT.shape(),
  }).isRequired,
};

function mapDispatchToProps(dispatch) {
  const cla = challengeListingActions.challengeListing;
  return {
    setFilterState: s => dispatch(cla.setFilter(s)),
  };
}

function mapStateToProps(state) {
  const cl = state.challengeListing;
  return {
    auth: state.auth,
    filterState: cl.filter,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ChallengeSkillsSearchBar);
