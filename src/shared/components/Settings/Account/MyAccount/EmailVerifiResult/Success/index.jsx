/**
 * Render Email verification success page
 */

import React from 'react';
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
        this.state = {isLoading:true};
    }

    componentDidMount() {
        const {handle,token,newEmail,oldEmail,jwtToken} = this.props.match.params;
        setTimeout(() =>
        getApiV3(jwtToken)
        .post(`/members/${handle}/verify?newEmail=${newEmail}&oldEmail=${oldEmail}&token=${token}`)
        .then(res => res.json())
        .then(res => this.setState({ statusCode: res.result.status, isLoading: false }))
        .catch(err =>this.setState({ statusCode: 400 , isLoading: false})
        ),2000);
    }

    render() {
        let assets;
        if (isomorphy.isClientSide()) {
            assets = require.context('assets/images/account/email', false, /svg/);
        }
        const { isLoading } = this.state;
        if (isLoading) {
            return  <LoadingPagePlaceholder />;
        }
        const {handle,token,newEmail,oldEmail,jwtToken} = this.props.match.params;
        //console.log(`${handle} ${token} ${newEmail} ${oldEmail} ${jwtToken}`);
        if (this.state.statusCode == 200) {
            return (<div styleName="outer-container">
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
            </div>)
        } else if (this.state.statusCode == 401) {
            return (<Expired/>)
        } else {
            return (<Failed/>)
        }
    }
}
export default Success;
