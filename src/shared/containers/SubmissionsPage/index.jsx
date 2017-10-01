import actions from 'actions/challenge';
import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import Header from 'components/SubmissionsPage/Header';
import Design from 'components/SubmissionsPage/Design';
import Develop from 'components/SubmissionsPage/Develop';
import './styles.scss';

/**
 * SubmissionsPage Container
 */
class SubmissionsPage extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(body) {
    const {
      tokenV2,
      tokenV3,
      onSubmit,
      challengeId,
      track,
    } = this.props;
    onSubmit(tokenV3, tokenV2, challengeId, body, track);
  }

  render() {
    const {
      challengeId,
      challengeName,
      challengesUrl,
    } = this.props;
    return (
      <div styleName="container">
        <div styleName="content">
          <Header
            challengeId={challengeId}
            challengesUrl={challengesUrl}
            title={challengeName}
          />
          {
            this.props.track === 'DEVELOP' &&
            this.props.status === 'ACTIVE' &&
            <Develop
              submitForm={this.handleSubmit}
              {...this.props}
            />
          }
          {
            this.props.track === 'DESIGN' &&
            this.props.status === 'ACTIVE' &&
            <Design
              submitForm={this.handleSubmit}
              {...this.props}
            />
          }
        </div>
      </div>
    );
  }
}

SubmissionsPage.defaultProps = {
  challengesUrl: '/challenges',
};

SubmissionsPage.propTypes = {
  challengesUrl: PT.string,
  tokenV2: PT.string.isRequired,
  tokenV3: PT.string.isRequired,
  onSubmit: PT.func.isRequired,
  challengeId: PT.number.isRequired,
  track: PT.string.isRequired,
  status: PT.string.isRequired,
  errorMsg: PT.string.isRequired,
  isSubmitting: PT.bool.isRequired,
  submitDone: PT.bool.isRequired,
  resetForm: PT.func.isRequired,
  challengeName: PT.string.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  const detailsV2 = state.challenge.detailsV2;
  return {
    challengeId: detailsV2 && detailsV2.challengeId,
    challengeName: detailsV2 && detailsV2.challengeName,
    challengesUrl: ownProps.challengesUrl,
    tokenV2: state.auth.tokenV2,
    tokenV3: state.auth.tokenV3,
    isSubmitting: state.challenge.isSubmitting,
    submitDone: state.challenge.submitDone,
    errorMsg: state.challenge.submitErrorMsg,
    track: state.challenge.details.track,
    status: state.challenge.details.status,
  };
};

function mapDispatchToProps(dispatch) {
  const a = actions.challenge;
  return {
    onSubmit: (tokenV3, tokenV2, submissionId, body, track) => {
      dispatch(a.submitInit());
      dispatch(a.submitDone(tokenV3, tokenV2, submissionId, body, track));
    },
    resetForm: () => {
      dispatch(a.submitReset());
    },
  };
}

const Container = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SubmissionsPage);

export default Container;
