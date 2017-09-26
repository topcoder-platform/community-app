import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Header from 'components/SubmissionsPage/Header';
import Design from 'components/SubmissionsPage/Design';
import Develop from 'components/SubmissionsPage/Develop';
import actions from 'actions/submit';
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
    return (
      <div styleName="container">
        <div styleName="content">
          <Header
            title={this.props.challengeName}
            challengeId={this.props.challengeId}
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

SubmissionsPage.propTypes = {
  tokenV2: PropTypes.string.isRequired,
  tokenV3: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  challengeId: PropTypes.number.isRequired,
  track: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  errorMsg: PropTypes.string.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  submitDone: PropTypes.bool.isRequired,
  resetForm: PropTypes.func.isRequired,
  challengeName: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => {
  const detailsV2 = state.challenge.detailsV2;
  return {
    tokenV2: state.auth.tokenV2,
    tokenV3: state.auth.tokenV3,
    isSubmitting: state.submit.isSubmitting,
    submitDone: state.submit.submitDone,
    challengeId: detailsV2 && detailsV2.challengeId,
    challengeName: detailsV2 && detailsV2.challengeName,
    errorMsg: state.submit.errorMsg,
    track: state.challenge.details.track,
    status: state.challenge.details.status,
  };
};

const mapDispatchToProps = dispatch => ({
  onSubmit: (tokenV3, tokenV2, submissionId, body, track) => {
    dispatch(actions.submit.submitInit());
    dispatch(actions.submit.submitDone(tokenV3, tokenV2, submissionId, body, track));
  },
  resetForm: () => {
    dispatch(actions.submit.reset());
  },
});

const Container = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SubmissionsPage);

export default Container;
