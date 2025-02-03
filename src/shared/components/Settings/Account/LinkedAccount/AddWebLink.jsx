/**
 * Renders 'Add a Web Link' section.
 */
/* eslint-disable jsx-a11y/label-has-for */
import React from 'react';
import _ from 'lodash';
import PT from 'prop-types';
import { PrimaryButton } from 'topcoder-react-ui-kit';
import './styles.scss';

export default class AddWebLink extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      webLink: '',
      webLinkEmpty: false,
    };

    this.onUpdateWebLink = this.onUpdateWebLink.bind(this);
    this.onAddWebLink = this.onAddWebLink.bind(this);
    this.isWebLinkValid = this.isWebLinkValid.bind(this);
    this.webLinkExist = this.webLinkExist.bind(this);
    this.onAddWebLinkButton = this.onAddWebLinkButton.bind(this);
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
    if (e.target.value) {
      this.setState({
        webLinkEmpty: false,
      });
    }
    this.setState({ webLink: e.target.value });
  }

  // Add web link
  onAddWebLink(e) {
    if (e.keyCode === 13 && e.shiftKey === false) {
      e.preventDefault();
      e.stopPropagation();
      const {
        addWebLink,
        handle,
        tokenV3,
      } = this.props;
      const { webLink } = this.state;
      if (webLink && this.isWebLinkValid() && !this.webLinkExist()) {
        addWebLink(handle, tokenV3, webLink);
      }
    }
  }

  // Add web link
  onAddWebLinkButton(e) {
    e.preventDefault();
    e.stopPropagation();
    const {
      addWebLink,
      handle,
      tokenV3,
    } = this.props;
    const { webLink } = this.state;
    if (!webLink) {
      this.setState({
        webLinkEmpty: true,
      });
    }
    if (webLink && this.isWebLinkValid() && !this.webLinkExist()) {
      addWebLink(handle, tokenV3, webLink);
    }
  }

  isWebLinkValid() {
    const { webLink } = this.state;
    return !webLink
    || /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/.test(webLink); /* eslint-disable-line no-useless-escape */
  }

  webLinkExist() {
    const { webLink } = this.state;
    const {
      allLinks,
    } = this.props;
    return _.some(allLinks, link => link.URL && (link.URL.toLowerCase().replace(/https?:\/\//, '') === webLink.toLowerCase().replace(/https?:\/\//, '')));
  }

  render() {
    const { webLink, webLinkEmpty } = this.state;

    const webLinkValid = this.isWebLinkValid();
    const webLinkExist = this.webLinkExist();

    return (
      <div styleName="external-web-link">
        <div styleName="web-link">
          <div styleName="form-container-mobile">
            <form name="addlink-form" noValidate autoComplete="off">
              <div styleName="row">
                <div styleName="title-mobile">
                  Add Link
                </div>
              </div>
              <div styleName="row">
                <div styleName="field col-1">
                  <label htmlFor="name">
                    External link
                    <input type="hidden" />
                  </label>
                  <div styleName={webLinkValid ? 'validation-bar url' : 'validation-bar url error-bar'}>
                    <input
                      autoCapitalize="off"
                      id="web-link-input"
                      name="url"
                      type="text"
                      styleName="url"
                      value={webLink}
                      onChange={this.onUpdateWebLink}
                      placeholder="http://www.yourlink.com"
                      onKeyDown={this.onAddWebLink}
                      required
                    />
                    {
                      !webLinkValid && !webLinkExist
                      && (
                        <div styleName="form-input-error">
                          <p>
                            Please enter a valid URL
                          </p>
                        </div>
                      )
                    }
                    {
                      webLinkExist
                      && (
                        <div styleName="form-input-error">
                          <p>
                            {`The URL ${webLink} already exists`}
                          </p>
                        </div>
                      )
                    }
                  </div>
                </div>
              </div>
            </form>
            <div styleName="button-save">
              <PrimaryButton styleName="complete" onClick={this.onAddWebLinkButton}>
                Add Link
              </PrimaryButton>
            </div>
          </div>
          <div styleName="sub-title">
            Add a new external link
          </div>
          <form
            name="addWebLinkFrm"
            autoComplete="off"
            onSubmit={this.onAddWebLink}
            styleName="form-container-default"
          >
            <label htmlFor="external-link">
              External Link
              <input type="hidden" />
            </label>
            <div styleName={webLinkValid ? 'validation-bar url' : 'validation-bar url error-bar'}>
              <input
                id="web-link-input"
                autoCapitalize="off"
                name="url"
                type="text"
                styleName="url"
                value={webLink}
                onChange={this.onUpdateWebLink}
                placeholder="http://www.yourlink.com"
                onKeyDown={this.onAddWebLink}
                required
              />
              {
                webLinkEmpty && (
                <div styleName="form-input-error">
                  <p>
                    Please Enter External Link
                  </p>
                </div>
                )
              }
              {
                !webLinkValid && !webLinkExist
                && (
                  <div styleName="form-input-error">
                    <p>
                      Please enter a valid URL
                    </p>
                  </div>
                )
              }
              {
                webLinkExist
                && (
                  <div styleName="form-input-error">
                    <p>
                      {`The URL ${webLink} already exists`}
                    </p>
                  </div>
                )
              }
            </div>
            <PrimaryButton onClick={this.onAddWebLinkButton} theme={{ button: 'button-add-link' }}>Add Link</PrimaryButton>
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
