/**
 * A generic Topcoder Community page, which cotains header, footer and content.
 */

/* TODO: I believe, we don't need separate Content and Header containers,
 * they should be just merged into this page container! */

import Content from 'containers/tc-communities/Content';
import Footer from 'components/TopcoderFooter';
import Header from 'containers/tc-communities/Header';
import LoadingIndicator from 'components/LoadingIndicator';
import PT from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import TopcoderLogo from '../../../../assets/images/logo_topcoder.svg';

import './style.scss';

function Page(props) {
  if (props.user) {
    return (
      <div>
        <Header {...props} />
        <Content {...props} />
        <Footer />
      </div>
    );
  } else if (props.authenticating) {
    return (
      <div styleName="auth-check">
        <LoadingIndicator />
      </div>
    );
  }
  return (
    <div styleName="auth-check">
      <TopcoderLogo />
      <div styleName="msg">You must be authenticated to access this page.</div>
    </div>
  );
}

Page.defaultProps = {
  authenticating: false,
  user: null,
};

Page.propTypes = {
  authenticating: PT.bool,
  user: PT.shape({}),
};

export default connect(
  state => state.auth,
)(Page);
