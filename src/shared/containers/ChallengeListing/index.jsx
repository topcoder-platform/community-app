/**
 * This is a container component for ChallengeFiltersExample.
 * It represents community-challenge-listing page.
 *
 * ChallengeFiltersExample component was brought from another project with different approach
 * and it takes care about everything it needs by itself.
 * So this container components almost doing nothing now.
 * Though this component defines a master filter function
 * which is used to define which challenges should be listed for the certain community.
 */

import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import ChallengeFiltersExample from 'components/ChallengeFilters/ChallengeFiltersExample';
import './styles.scss';

// The container component
class ChallengeListingPageContainer extends React.Component {

  constructor(props) {
    super(props);

    this.masterFilterFunc = this.masterFilterFunc.bind(this);
  }

  /**
   * It takes one challenge object and check if it passes master filter
   * which defines which challenges should be displayed for the current community
   *
   * @param  {Object}  challenge object
   * @return {boolean} whether the item pass filter or not
   */
  masterFilterFunc(item) {
    const keyword = this.props.match.params.keyword;
    const techs = ` ${item.technologies.join(' ').toLowerCase()} `;

    return !!(techs.indexOf(` ${keyword.toLowerCase()} `) >= 0);
  }

  render() {
    return (
      <div>
        <ChallengeFiltersExample
          filterFromUrl={this.props.location.hash}
          masterFilterFunc={this.masterFilterFunc}
          onSaveFilterToUrl={(filter) => {
            this.props.history.replace(`#${encodeURI(filter)}`);
          }}
          isAuth={!!this.props.auth.user}
          auth={this.props.auth}
        />
      </div>
    );
  }
}

ChallengeListingPageContainer.defaultProps = {
};

ChallengeListingPageContainer.propTypes = {
  match: PT.shape({
    params: PT.shape({
      keyword: PT.string.isRequired,
    }).isRequired,
  }).isRequired,
  history: PT.shape({
    replace: PT.func.isRequired,
  }).isRequired,
  location: PT.shape({
    hash: PT.string,
  }).isRequired,
  auth: PT.shape({
    user: PT.shape(),
  }).isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
});

const ChallengeListingContainer = connect(
  mapStateToProps,
)(ChallengeListingPageContainer);

export default ChallengeListingContainer;
