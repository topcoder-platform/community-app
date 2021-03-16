import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import actions from 'actions/newsletterArchive';
import LoadingIndicator from 'components/LoadingIndicator';
import NewsletterArchive from 'components/NewsletterArchive';

class NewsletterArchiveContainer extends React.Component {
  componentDidMount() {
    const {
      loading,
      name,
      getNewsletterArchiveDone,
    } = this.props;
    if (!loading) {
      getNewsletterArchiveDone(name);
    }
  }

  render() {
    const {
      loading, error, archive, limit,
    } = this.props;
    if (loading) return <LoadingIndicator />;
    if (error) {
      return <span><strong>Error loading MailChimp archive:</strong> {error.message}</span>;
    }
    if (!archive || !archive.campaigns) return null;
    if (limit > 1) archive.campaigns = _.take(archive.campaigns, limit);
    return <NewsletterArchive archive={archive} />;
  }
}

NewsletterArchiveContainer.defaultProps = {
  loading: false,
  archive: null,
  error: null,
  limit: null,
};

NewsletterArchiveContainer.propTypes = {
  loading: PT.bool,
  name: PT.string.isRequired,
  getNewsletterArchiveDone: PT.func.isRequired,
  archive: PT.shape(),
  error: PT.shape(),
  limit: PT.string,
};

function mapStateToProps(state, ownProps) {
  const { newsletterArchive } = state;
  if (newsletterArchive[ownProps.name]) {
    return {
      loading: newsletterArchive[ownProps.name].loading,
      error: newsletterArchive[ownProps.name].error,
      archive: newsletterArchive[ownProps.name].archive,
    };
  }

  return state;
}

function mapDispatchToProps(dispatch) {
  return {
    getNewsletterArchiveDone: (name) => {
      dispatch(actions.newsletterArchive.fetchDataInit(name));
      dispatch(actions.newsletterArchive.fetchDataDone(name));
    },
  };
}

const Container = connect(
  mapStateToProps,
  mapDispatchToProps,
)(NewsletterArchiveContainer);

export default Container;
