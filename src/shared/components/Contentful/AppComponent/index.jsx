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
  const {
    fields: {
      type,
      theme,
      props,
      props: {
        leaderboardApiUrl,
        title,
        podiumSpots,
        isCopilot,
        hasChallengeHistory,
        tcoPointsApiUrl,
        memberLimit,
        isAlgo,
      } = {},
    },
    sys: { id },
  } = appComponent;
  if (type === 'TCO-Leaderboard') {
    return (
      <Leaderboard
        id={id}
        apiUrl={leaderboardApiUrl}
        title={title}
        podiumSpots={podiumSpots}
        isCopilot={isCopilot}
        hasChallengeHistory={hasChallengeHistory}
        tcoPointsApiUrl={tcoPointsApiUrl}
        memberLimit={memberLimit}
        isAlgo={isAlgo}
        key={id}
        themeName={theme}
      />
    );
  }
  if (type === 'RecruitCRM-Jobs') {
    return <RecruitCRMJobs {...props} key={id} />;
  }
  if (type === 'EmailSubscribeForm') {
    return <EmailSubscribeForm {...props} key={id} />;
  }
  if (type === 'GSheet') {
    return <GSheet {...props} key={id} />;
  }
  if (type === 'MemberPath') {
    return (
      <PathSelector
        {...props}
        key={id}
      />
    );
  }
  fireErrorMessage(`Unsupported app component type ${type}`, '');
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