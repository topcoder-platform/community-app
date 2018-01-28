/**
 * Terms details component which display text of an agreement
 */
/* eslint react/no-danger:0 */

import React from 'react';
import PT from 'prop-types';
import LoadingIndicator from 'components/LoadingIndicator';

import './TermDetails.scss';

export default class TermDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingFrame: false,
    };
    this.frameLoaded = this.frameLoaded.bind(this);
  }

  componentWillMount() {
    const { details } = this.props;
    if (details.agreeabilityType !== 'Electronically-agreeable' && details.docusignTemplateId) {
      this.props.getDocuSignUrl(details.docusignTemplateId);
      this.setState({ loadingFrame: true });
    }
  }

  frameLoaded() {
    this.setState({
      loadingFrame: false,
    });
  }

  render() {
    const { details, docuSignUrl,
      loadingDocuSignUrl } = this.props;

    return (
      <div>
        {
          details.agreeabilityType === 'Electronically-agreeable' &&
          <div>
            <div
              dangerouslySetInnerHTML={{ __html: details.text.replace(/topcoder/gi, 'Topcoder') }}
              styleName="body"
            />
          </div>
        }
        {
          details.agreeabilityType !== 'Electronically-agreeable' &&
          details.docusignTemplateId === loadingDocuSignUrl &&
          <LoadingIndicator />
        }
        {
          details.agreeabilityType !== 'Electronically-agreeable' && details.docusignTemplateId &&
          !loadingDocuSignUrl && docuSignUrl &&
          <div>
            {
              this.state.loadingFrame &&
              <LoadingIndicator />
            }
            <iframe
              onLoad={this.frameLoaded}
              src={docuSignUrl}
              styleName={this.state.loadingFrame ? 'hidden' : 'frame'}
              title={details.title}
            />
          </div>
        }
      </div>
    );
  }
}

TermDetails.defaultProps = {
  details: {},
  docuSignUrl: '',
  loadingDocuSignUrl: '',
};

TermDetails.propTypes = {
  details: PT.shape(),
  docuSignUrl: PT.string,
  loadingDocuSignUrl: PT.string,
  getDocuSignUrl: PT.func.isRequired,
};
