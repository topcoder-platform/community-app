/**
 * This component should render the entire page assembly,
 * but not yet implement the logic behind user actions.
 * It still receives submissions and challenge data, all callbacks, etc. from its parent container
 *
 * Namely, it receives via props: the mock data object (provided along with this specs),
 * the showDetails set, and config object holding all necessary callbacks:
 * onBack() - to trigger when user clicks Back button under the challenge name;
 * onDelete(submissionId);
 * onDownload() (to be triggered by download icon)
 * onOpenOnlineReview(submissionId); onHelp(submissionId);
 * onShowDetails(submissionId);
 * onSubmit() - to trigger when user clicks Add Submission button.
 */

import _ from 'lodash';
import LoadingIndicator from 'components/LoadingIndicator';
import React from 'react';
import PT from 'prop-types';
import moment from 'moment';
import { Link } from 'topcoder-react-utils';
import LeftArrow from 'assets/images/arrow-prev-green.svg';
import { PrimaryButton } from 'topcoder-react-ui-kit';
import { phaseEndDate } from 'utils/challenge-listing/helper';
import { getTrackName } from 'utils/challenge';
import SubmissionsTable from '../SubmissionsTable';

import style from './styles.scss';

export default function SubmissionManagement(props) {
  const {
    challenge,
    submissions,
    loadingSubmissions,
    showDetails,
    submissionWorkflowRuns,
    onDelete,
    helpPageUrl,
    onDownload,
    onShowDetails,
    challengeUrl,
    onlineReviewUrl,
    submissionPhaseStartDate,
    onDownloadArtifacts,
    getSubmissionArtifacts,
    getSubmissionScores,
  } = props;

  const { track } = challenge;
  const trackName = getTrackName(track);

  const challengeType = (trackName || '').toLowerCase();

  const isDesign = challengeType === 'design';
  const isDevelop = challengeType === 'development';
  const currentPhase = challenge.phases
    .filter(p => p.name !== 'Registration' && p.isOpen)
    .sort((a, b) => moment(a.scheduledEndDate).diff(b.scheduledEndDate))[0];
  const submissionPhase = challenge.phases.filter(p => p.name === 'Submission')[0];
  const submissionEndDate = submissionPhase && phaseEndDate(submissionPhase);
  const isSubmissionPhaseOpen = Boolean(submissionPhase && submissionPhase.isOpen);

  const now = moment();
  const end = moment(currentPhase && currentPhase.scheduledEndDate);
  const diff = end.isAfter(now) ? end.diff(now) : 0;
  const timeLeft = moment.duration(diff);

  const [days, hours, minutes] = [
    timeLeft.get('days'),
    timeLeft.get('hours'),
    timeLeft.get('minutes'),
  ];

  const componentConfig = {
    helpPageUrl,
    onDelete,
    onDownload: onDownload.bind(0, challengeType),
    onlineReviewUrl,
    onShowDetails,
    onDownloadArtifacts,
    getSubmissionArtifacts,
    getSubmissionScores,
  };
  return (
    <div styleName="submission-management">
      <div styleName="submission-management-header">
        <div styleName="left-col">
          <Link
            to={challengeUrl}
            aria-label="Back to challenge list"
            styleName="back-btn"
          >
            <LeftArrow />
          </Link>

          <h4 styleName="name">
            {challenge.name}
          </h4>
        </div>
      </div>
      <div styleName="submission-management-content">
        <div styleName="content-head">
          <p styleName="title">
            Manage your submissions
          </p>

          {/* {
             isDesign && currentPhase && (
               <p styleName="round-ends">
                 <span styleName="ends-label">
                   {currentPhase.name}
                   {' '}
                   Ends:
                 </span>
                 {' '}
                 {end.format('dddd MM/DD/YY hh:mm A')}
               </p>
             )
           } */}
        </div>
        <div styleName="subTitle">
          {
             currentPhase && (
             <p styleName="round">
               Current Deadline:{' '}
               <span>{currentPhase.name}</span>
             </p>
             )
           }
          <span styleName="seperator" />
          {
             challenge.status !== 'COMPLETED' ? (
               <div>
                 <p styleName="round">
                   Current Deadline Ends: {' '}
                   <span>
                     {days > 0 && (`${days}D`)}
                     {' '}
                     {hours}
                     H
                     {' '}
                     {minutes}
                     M
                   </span>
                 </p>
               </div>
             ) : (
               <p styleName="time-left">
                 The challenge has ended
               </p>
             )
           }
        </div>
        {
           isDesign && (
             <p styleName="recommend-info">
               {/* eslint-disable-next-line max-len */}
               We always recommend to download your submission to check you uploaded the correct .zip files&nbsp;
               {/* eslint-disable-next-line max-len */}
               and also to verify your declarations file is accurate. If you don’t want to see a submission&nbsp;
               {/* eslint-disable-next-line max-len */}
               simply delete it. If you have a new submissions, use the “Add Submission” button to add one&nbsp;
               to the top of the list.
             </p>
           )
         }
        {
           isDevelop && (
             <p styleName="recommend-info">
               {/* eslint-disable-next-line max-len */}
               We always recommend to download your submission to check you uploaded the correct .zip files&nbsp;
               {/* eslint-disable-next-line max-len */}
               and also to verify your declarations file is accurate. If you don’t want to see a submission&nbsp;
               {/* eslint-disable-next-line max-len */}
               simply delete it. If you have a new submissions, use the “Add Submission” button to add one&nbsp;
               to the top of the list.
             </p>
           )
         }
        {loadingSubmissions && <LoadingIndicator />}
        {!loadingSubmissions
           && (
           <SubmissionsTable
             challenge={challenge}
             submissionObjects={submissions}
             submissionWorkflowRuns={submissionWorkflowRuns}
             showDetails={showDetails}
             track={trackName}
             status={challenge.status}
             submissionPhaseStartDate={submissionPhaseStartDate}
             {...componentConfig}
           />
           )
         }
      </div>
      {isSubmissionPhaseOpen && now.isBefore(submissionEndDate) && (
      <div styleName="btn-wrap">
        <PrimaryButton
          theme={{
            button: style['add-sub-btn'],
          }}
          to={`${challengeUrl}/submit`}
        >
          {
               (!isDevelop || !submissions || submissions.length === 0)
                 ? 'Add Submission' : 'Update Submission'
             }
        </PrimaryButton>
      </div>
      )}
    </div>
  );
}

SubmissionManagement.defaultProps = {
  onDelete: _.noop,
  onShowDetails: _.noop,
  onDownload: _.noop,
  onDownloadArtifacts: _.noop,
  getSubmissionArtifacts: _.noop,
  getSubmissionScores: _.noop,
  onlineReviewUrl: '',
  helpPageUrl: '',
  loadingSubmissions: false,
  challengeUrl: '',
  submissions: [],
};

SubmissionManagement.propTypes = {
  challenge: PT.shape().isRequired,
  showDetails: PT.shape().isRequired,
  submissionWorkflowRuns: PT.shape().isRequired,
  onDelete: PT.func,
  onlineReviewUrl: PT.string,
  helpPageUrl: PT.string,
  onDownload: PT.func,
  onShowDetails: PT.func,
  onDownloadArtifacts: PT.func,
  getSubmissionArtifacts: PT.func,
  getSubmissionScores: PT.func,
  submissions: PT.arrayOf(PT.shape()),
  loadingSubmissions: PT.bool,
  challengeUrl: PT.string,
  submissionPhaseStartDate: PT.string.isRequired,
};
