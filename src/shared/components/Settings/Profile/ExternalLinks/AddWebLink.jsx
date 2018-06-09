/**
 * Renders 'Add a Web Link' section.
 */
import React from 'react';
import PT from 'prop-types';

import { PrimaryButton } from 'topcoder-react-ui-kit';
import Styles from './styles.scss';

export default class AddWebLink extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      webLink: '',
    };

    this.onUpdateWebLink = this.onUpdateWebLink.bind(this);
    this.onAddWebLink = this.onAddWebLink.bind(this);
    this.isWebLinkValid = this.isWebLinkValid.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.profileState.addingWebLink && !nextProps.profileState.addingWebLink) {
      this.setState({ webLink: '' });
    }
  }

  // Set web link
  onUpdateWebLink(e) {
    e.preventDefault();
    this.setState({ webLink: e.target.value });
  }

  // Add web link
  onAddWebLink(e) {
    e.preventDefault();
    if (this.state.webLink && this.isWebLinkValid()) {
      this.props.addWebLink(this.props.handle, this.props.tokenV3, this.state.webLink);
    }
  }

  isWebLinkValid() {
    const { webLink } = this.state;
    return !webLink || /^(http(s?):\/\/)?(www\.)?[a-zA-Z0-9\.\-\_]+(\.[a-zA-Z]{2,15})+(\/[a-zA-Z0-9\_\-\s\.\/\?\%\#\&\=]*)?$/.test(webLink); /* eslint-disable-line no-useless-escape */
  }

  render() {
    const {
      profileState,
    } = this.props;

    const { addingWebLink } = profileState;

    const webLinkValid = this.isWebLinkValid();

    return (
      <div styleName="external-web-link">
        <div styleName="web-link">
          <form name="addWebLinkFrm" onSubmit={this.onAddWebLink} autoComplete="off">
            <div styleName={webLinkValid ? 'validation-bar url' : 'validation-bar url error-bar'}>
              <input id="web-link-input" name="url" type="text" styleName="url" value={this.state.webLink} onChange={this.onUpdateWebLink} placeholder="http://www.yourlink.com" required />
              {
                !webLinkValid &&
                (
                  <div styleName="form-input-error">
                    <p>Please enter a valid URL</p>
                  </div>
                )
              }
            </div>
            <PrimaryButton
              disabled={!this.state.webLink || !webLinkValid || addingWebLink}
              onClick={this.onAddWebLink}
              theme={{ button: Styles['add-button'] }}
            >
              {
                !addingWebLink && 'Add'
              }
              {
                addingWebLink && <i className="fa fa-spinner fa-spin" />
              }
            </PrimaryButton>
          </form>
        </div>
      </div>
    );
  }
}

AddWebLink.propTypes = {
  handle: PT.string.isRequired,
  tokenV3: PT.string.isRequired,
  profileState: PT.shape().isRequired,
  addWebLink: PT.func.isRequired,
};
