/**
* Render Email verification success page
*/

import React from 'react';
import PT from 'prop-types';
import { isomorphy } from 'topcoder-react-utils';
import { PrimaryButton } from 'topcoder-react-ui-kit';
import { services } from 'topcoder-react-lib';
import LoadingPagePlaceholder from 'components/LoadingPagePlaceholder';
import Failed from 'components/Settings/Account/MyAccount/EmailVerifiResult/Failed';
import Expired from 'components/Settings/Account/MyAccount/EmailVerifiResult/Expired';
import './styles.scss';

const { getApiV3 } = services.api;

class Success extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      statusCode: null,
    };
  }

  componentDidMount() {
    const { match } = this.props;
    setTimeout(() => getApiV3(match.params.jwtToken)
      .post(`/members/${match.params.handle}/verify?newEmail=${match.params.newEmail}&oldEmail=${match.params.oldEmail}&token=${match.params.token}`)
      .then(res => res.json())
      .then(res => this.setState({ statusCode: res.result.status, isLoading: false }))
      .catch(() => this.setState({ statusCode: 400, isLoading: false })), 2000);
  }

  render() {
    let assets;
    if (isomorphy.isClientSide()) {
      assets = require.context('assets/images/account/email', false, /svg/);
    }
    const { isLoading, statusCode } = this.state;
    if (isLoading) {
      return <LoadingPagePlaceholder />;
    }
    if (statusCode === 200) {
      return (
        <div styleName="outer-container">
          <div styleName="page">
            <div styleName="container">
              <img src={assets('./success.svg')} alt="success-icon" />
              <h1>
                Email Verification Success
              </h1>
              <div styleName="text">
            Congratulations! Your email verification has been completed.
              </div>
              <div styleName="button-back">
                <PrimaryButton
                  styleName="white"
                  to="/settings/account"
                >
                Back to My Account
                </PrimaryButton>
              </div>
            </div>
          </div>
        </div>
      );
    } if (statusCode === 401) {
      return (<Expired />);
    }
    return (<Failed />);
  }
}

Success.propTypes = {
  match: PT.shape({
    params: PT.shape({
      handle: PT.string.isRequired,
      token: PT.string.isRequired,
      newEmail: PT.string.isRequired,
      oldEmail: PT.string.isRequired,
      jwtToken: PT.string.isRequired,
    }),
  }).isRequired,
};

export default Success;
