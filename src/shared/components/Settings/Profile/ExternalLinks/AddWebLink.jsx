/**
 * Renders 'Add a Web Link' section.
 */
import React from 'react';
import _ from 'lodash';
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
    this.webLinkExists = this.webLinkExists.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { profileState } = this.props;
    if (profileState.addingWebLink && !nextProps.profileState.addingWebLink) {
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
    const {
      addWebLink,
      handle,
      tokenV3,
    } = this.props;
    const { webLink } = this.state;
    if (webLink && this.isWebLinkValid() && !this.webLinkExists()) {
      addWebLink(handle, tokenV3, webLink);
    }
  }

  isWebLinkValid() {
    const { webLink } = this.state;
    return !webLink
    || (webLink.includes('www') && /^(http(s?):\/\/)?(www\.)[a-zA-Z0-9\.\-\_]+(\.[a-zA-Z]{2,15})+$/.test(webLink)) /* eslint-disable-line no-useless-escape */
    || (!webLink.includes('www') && /^(http(s?):\/\/)?[a-zA-Z0-9\.\-\_]+(\.[a-zA-Z]{2,15})+$/.test(webLink)); /* eslint-disable-line no-useless-escape */
  }

  webLinkExists() {
    const { webLink } = this.state;
    const {
      allLinks,
    } = this.props;
    return _.some(allLinks, link => link.URL.toLowerCase() === webLink.toLowerCase());
  }

  render() {
    const {
      profileState,
    } = this.props;

    const { addingWebLink } = profileState;
    const { webLink } = this.state;

    const webLinkValid = this.isWebLinkValid();
    const webLinkExists = this.webLinkExists();
    return (
      <div styleName="external-web-link">
        <div styleName="web-link">
          <form name="addWebLinkFrm" onSubmit={this.onAddWebLink} autoComplete="off">
            <div styleName={webLinkValid ? 'validation-bar url' : 'validation-bar url error-bar'}>
              <input id="web-link-input" name="url" type="text" styleName="url" value={webLink} onChange={this.onUpdateWebLink} placeholder="http://www.yourlink.com" required />
              {
                !webLinkValid && !webLinkExists
                && (
                  <div styleName="form-input-error">
                    <p>
Please enter a valid URL
                    </p>
                  </div>
                )
              }
              {
                webLinkExists
                && (
                  <div styleName="form-input-error">
                    <p>
                      {`The URL ${webLink} already exists`}
                    </p>
                  </div>
                )
              }
            </div>
            <PrimaryButton
              disabled={!webLink || !webLinkValid || addingWebLink}
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

AddWebLink.defaultProps = {
  allLinks: [],
};

AddWebLink.propTypes = {
  handle: PT.string.isRequired,
  tokenV3: PT.string.isRequired,
  profileState: PT.shape().isRequired,
  addWebLink: PT.func.isRequired,
  allLinks: PT.arrayOf(PT.shape),
};
