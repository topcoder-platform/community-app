/**
 * Container for thrive articles feed.
 */

import ThriveArticlesFeed from 'components/Dashboard/ThriveArticlesFeed';
import PT from 'prop-types';
import React from 'react';
import actions from 'actions/contentful';
import { connect } from 'react-redux';


class ThriveArticlesFeedContainer extends React.Component {
  componentDidMount() {
    const {
      getArticles,
      articles,
      itemCount,
    } = this.props;

    // This gets articles.
    if (!articles || articles.length === 0) {
      getArticles({
        limit: itemCount,
      });
    }
  }

  render() {
    const {
      articles,
      theme,
      loading,
    } = this.props;

    return (
      <ThriveArticlesFeed articles={articles} theme={theme} loading={loading} />
    );
  }
}

ThriveArticlesFeedContainer.defaultProps = {
  itemCount: 5,
  articles: [],
  loading: true,
  theme: 'light',
};

ThriveArticlesFeedContainer.propTypes = {
  articles: PT.oneOfType([PT.arrayOf(PT.shape()), PT.shape]),
  itemCount: PT.number,
  getArticles: PT.func.isRequired,
  loading: PT.bool,
  theme: PT.oneOf(['dark', 'light']),
};

function mapStateToProps(state) {
  const data = state.thrive;
  return {
    articles: data ? data.articles : [],
    loading: data ? data.loading : true,
  };
}

function mapDispatchToProps(dispatch) {
  const a = actions.contentful;
  return {
    getArticles: (ownProps) => {
      dispatch(a.getThriveArticlesInit());
      dispatch(a.getThriveArticlesDone(ownProps));
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ThriveArticlesFeedContainer);
