/**
 * App component re-use from Contentful
 * @type {[type]}
 */
import _ from 'lodash';
import ContentfulLoader from 'containers/ContentfulLoader';
import LoadingIndicator from 'components/LoadingIndicator';
import PT from 'prop-types';
import React from 'react';
import { errors } from 'topcoder-react-lib';
import Leaderboard from 'containers/tco/Leaderboard';

const { fireErrorMessage } = errors;

export function AppComponentSwitch(appComponent) {
  if (appComponent.fields.type === 'TCO-Leaderboard') {
    return (
      <Leaderboard
        apiUrl={appComponent.fields.props.leaderboardApiUrl}
        title={appComponent.fields.props.title}
        podiumSpots={appComponent.fields.props.podiumSpots}
        isCopilot={appComponent.fields.props.isCopilot}
        key={appComponent.sys.id}
      />
    );
  }
  fireErrorMessage('Unsupported app component type from contentful', '');
  return null;
}

export default function AppComponentLoader(props) {
  const {
    id,
    preview,
  } = props;

  const queries = [];

  if (id) {
    queries.push({ 'sys.id': id, content_type: 'appComponent' });
  }

  return (
    <ContentfulLoader
      entryQueries={queries}
      preview={preview}
      render={data => _.map(data.entries.items, AppComponentSwitch)}
      renderPlaceholder={LoadingIndicator}
    />
  );
}

AppComponentLoader.defaultProps = {
  id: null,
  preview: false,
};

AppComponentLoader.propTypes = {
  id: PT.string,
  preview: PT.bool,
};
