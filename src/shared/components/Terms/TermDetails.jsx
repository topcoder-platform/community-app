/**
 * Terms details component which display text of an agreement
 */
/* eslint react/no-danger:0 */

import React from 'react';
import PT from 'prop-types';
import LoadingIndicator from 'components/LoadingIndicator';
import { getDocuSignTemplateIdForTerm } from 'utils/terms';

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
    const { details, getDocuSignUrl } = this.props;
    const docusignTemplateId = getDocuSignTemplateIdForTerm(details);
    if (docusignTemplateId) {
      getDocuSignUrl(docusignTemplateId);
      this.setState({ loadingFrame: true });
    }
  }

  frameLoaded() {
    this.setState({
      loadingFrame: false,
    });
  }

  render() {
    const {
      details, docuSignUrl,
      loadingDocuSignUrl,
    } = this.props;
    const { loadingFrame } = this.state;
    const docusignTemplateId = getDocuSignTemplateIdForTerm(details);
    const isDocuSignTerm = Boolean(docusignTemplateId);

    return (
      <div>
        {
          details.agreeabilityType === 'Electronically-agreeable'
          && !isDocuSignTerm
          && (
          <div>
            <div
              dangerouslySetInnerHTML={{ __html: details.text.replace(/topcoder/gi, 'Topcoder') }}
              styleName="body"
            />
          </div>
          )
        }
        {
          isDocuSignTerm
          && `${docusignTemplateId}` === loadingDocuSignUrl
          && <LoadingIndicator />
        }
        {
          isDocuSignTerm && !loadingDocuSignUrl && docuSignUrl
          && (
          <div>
            {
              loadingFrame
              && <LoadingIndicator />
            }
            <iframe
              onLoad={this.frameLoaded}
              src={docuSignUrl}
              styleName={loadingFrame ? 'hidden' : 'frame'}
              title={details.title}
            />
          </div>
          )
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
