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
import RecruitCRMJobs from 'containers/Gigs/RecruitCRMJobs';
import EmailSubscribeForm from 'containers/EmailSubscribeForm';
import GSheet from 'containers/GSheet';
import PathSelector from 'components/MemberPath/PathSelector';


const { fireErrorMessage } = errors;

export function AppComponentSwitch(appComponent) {
  if (appComponent.fields.type === 'TCO-Leaderboard') {
    return (
      <Leaderboard
        id={appComponent.sys.id}
        apiUrl={appComponent.fields.props.leaderboardApiUrl}
        title={appComponent.fields.props.title}
        podiumSpots={appComponent.fields.props.podiumSpots}
        isCopilot={appComponent.fields.props.isCopilot}
        hasChallengeHistory={appComponent.fields.props.hasChallengeHistory}
        tcoPointsApiUrl={appComponent.fields.props.tcoPointsApiUrl}
        memberLimit={appComponent.fields.props.memberLimit}
        isAlgo={appComponent.fields.props.isAlgo}
        key={appComponent.sys.id}
        themeName={appComponent.fields.theme}
      />
    );
  }
  if (appComponent.fields.type === 'RecruitCRM-Jobs') {
    return <RecruitCRMJobs {...appComponent.fields.props} key={appComponent.sys.id} />;
  }
  if (appComponent.fields.type === 'EmailSubscribeForm') {
    return <EmailSubscribeForm {...appComponent.fields.props} key={appComponent.sys.id} />;
  }
  if (appComponent.fields.type === 'GSheet') {
    return <GSheet {...appComponent.fields.props} key={appComponent.sys.id} />;
  }
  if (appComponent.fields.type === 'MemberPath') {
    return (
      <PathSelector
        {...appComponent.fields.props}
        key={appComponent.sys.id}
      />
    );
  }
  fireErrorMessage(`Unsupported app component type ${appComponent.fields.type}`, '');
  return null;
}

export default function AppComponentLoader(props) {
  const {
    id,
    preview,
    spaceName,
    environment,
  } = props;

  const queries = [];

  if (id) {
    queries.push({ 'sys.id': id, content_type: 'appComponent' });
  }

  return (
    <ContentfulLoader
      entryQueries={queries}
      preview={preview}
      spaceName={spaceName}
      environment={environment}
      render={data => _.map(data.entries.items, AppComponentSwitch)}
      renderPlaceholder={LoadingIndicator}
    />
  );
}

AppComponentLoader.defaultProps = {
  id: null,
  preview: false,
  spaceName: null,
  environment: null,
};

AppComponentLoader.propTypes = {
  id: PT.string,
  preview: PT.bool,
  spaceName: PT.string,
  environment: PT.string,
};
