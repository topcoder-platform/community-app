import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import actions from 'actions/newsletterPreferences';
import LoadingIndicator from 'components/LoadingIndicator';
import Email from 'components/Settings/Preferences/Email';

class NewsletterPreferencesContainer extends React.Component {
  constructor(props) {
    super(props);
    this.save = this.save.bind(this);
  }

  componentDidMount() {
    const {
      loading,
      email,
      getNewsletterPreferencesDone,
    } = this.props;
    if (!loading) {
      getNewsletterPreferencesDone(email);
    }
  }

  save() {
    const { saveEmailPreferences } = this.props;
    saveEmailPreferences();
  }

  render() {
    const {
      loading, error, preferences, saveEmailPreferences, email, updated, status,
    } = this.props;
    if (loading || !preferences) return <LoadingIndicator />;
    if (error) {
      return <span><strong>Error loading Newsletter Preferences :-(</strong> {error.message}</span>;
    }
    return (
      <Email
        email={email}
        preferences={preferences}
        saveEmailPreferences={saveEmailPreferences}
        updated={updated}
        status={status}
      />
    );
  }
}

NewsletterPreferencesContainer.defaultProps = {
  loading: false,
  error: null,
  preferences: null,
  updated: null,
  status: null,
};

NewsletterPreferencesContainer.propTypes = {
  loading: PT.bool,
  getNewsletterPreferencesDone: PT.func.isRequired,
  saveEmailPreferences: PT.func.isRequired,
  error: PT.bool,
  preferences: PT.shape(),
  email: PT.string.isRequired,
  updated: PT.shape(),
  status: PT.string,
};

function mapStateToProps(state) {
  const { newsletterPreferences } = state;
  if (newsletterPreferences) {
    return {
      loading: newsletterPreferences.loading,
      error: newsletterPreferences.error,
      preferences: newsletterPreferences.preferences,
      status: newsletterPreferences.status,
      updated: newsletterPreferences.updated,
    };
  }

  return state;
}

function mapDispatchToProps(dispatch) {
  return {
    getNewsletterPreferencesDone: (email) => {
      dispatch(actions.newsletterPreferences.fetchDataDone(email));
    },
    saveEmailPreferences: (email, id, checked) => {
      dispatch(actions.newsletterPreferences.updateTagInit());
      dispatch(actions.newsletterPreferences.updateTagDone(email, id, checked));
    },
  };
}

const Container = connect(
  mapStateToProps,
  mapDispatchToProps,
  null, { withRef: true },
)(NewsletterPreferencesContainer);

export default Container;
