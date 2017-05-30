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
import Banner from 'components/tc-communities/Banner';
import NewsletterSignup from 'components/tc-communities/NewsletterSignup';
import style from './styles.scss';

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
    let keyword;

    // if there is tag in props, use it as keyword
    if (this.props.tag) {
      keyword = this.props.tag;

    // if there is defined keyword param in the route, use it as keyword
    } else if (this.props.match && this.props.match.params && this.props.match.params.keyword) {
      keyword = this.props.match.params.keyword;

    // if keyword is not defined at all, don't filter
    } else {
      return true;
    }

    const techs = ` ${item.technologies.join(' ').toLowerCase()} `;

    return !!(techs.indexOf(` ${keyword.toLowerCase()} `) >= 0);
  }

  render() {
    return (
      <div>
        {/* For demo we hardcode banner properties so we can disable max-len linting */}
        {/* eslint-disable max-len */}
        <Banner
          title="Challenges"
          text="Browse our available challenges and compete. Vestibulum rutrum quam vitae fringilla tincidunt. Suspendisse nec tortor urna. Ut laoreet sodales nisi, quis iaculis nulla iaculis vitae. Donec sagittis faucibus lacus eget blandit. "
          theme={{
            container: style.bannerContainer,
            content: style.bannerContent,
            contentInner: style.bannerContentInner,
          }}
          imageSrc="/themes/wipro2/challenges/banner.jpg"
        />
        {/* eslint-enable max-len */}
        <ChallengeFiltersExample
          filterFromUrl={this.props.location.hash}
          masterFilterFunc={this.masterFilterFunc}
          onSaveFilterToUrl={(filter) => {
            this.props.history.replace(`#${encodeURI(filter)}`);
          }}
          isAuth={!!this.props.auth.user}
          auth={this.props.auth}
        />
        <NewsletterSignup
          title="Sign up for our newsletter"
          text="Don’t miss out on the latest Topcoder IOS challenges and information!"
          imageSrc="/themes/wipro2/subscribe-bg.jpg"
        />
      </div>
    );
  }
}

ChallengeListingPageContainer.defaultProps = {
  match: null,
  tag: null,
};

ChallengeListingPageContainer.propTypes = {
  match: PT.shape({
    params: PT.shape({
      keyword: PT.string,
    }),
  }),
  tag: PT.string,
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
