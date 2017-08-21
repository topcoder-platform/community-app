/* eslint react/no-danger:0 */

import React from 'react';
import PT from 'prop-types';
import { PrimaryButton } from 'components/buttons';
import LoadingIndicator from 'components/LoadingIndicator';

import './TermDetails.scss';

export default class TermDetails extends React.Component {
  componentDidMount() {
    const { details } = this.props;
    if (details.agreeabilityType !== 'Electronically-agreeable' && details.docusignTemplateId) {
      this.props.getDocuSignUrl(details.docusignTemplateId);
    }
  }

  render() {
    const { details, docuSignUrl, agreeingTerm, agreeTerm,
      deselectTerm, loadingDocuSignUrl } = this.props;
    return (
      <div>
        <div styleName="title">{details.title}</div>
        {
          details.agreeabilityType === 'Electronically-agreeable' &&
          <div>
            <div styleName="body" dangerouslySetInnerHTML={{ __html: details.text }} />
            <div styleName="buttons">
              <PrimaryButton onClick={deselectTerm}>Back</PrimaryButton>
              <PrimaryButton
                disabled={agreeingTerm === details.termsOfUseId}
                onClick={() => agreeTerm(details.termsOfUseId)}
              >Agree</PrimaryButton>
            </div>
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
            <iframe title={details.title} src={docuSignUrl} styleName="frame" />
            <div styleName="buttons">
              <PrimaryButton onClick={deselectTerm}>Back</PrimaryButton>
            </div>
          </div>
        }
      </div>
    );
  }
}

TermDetails.defaultProps = {
  details: {},
  docuSignUrl: '',
  agreeingTerm: '',
  loadingDocuSignUrl: '',
};

TermDetails.propTypes = {
  details: PT.shape(),
  docuSignUrl: PT.string,
  agreeTerm: PT.func.isRequired,
  agreeingTerm: PT.string,
  deselectTerm: PT.func.isRequired,
  loadingDocuSignUrl: PT.string,
  getDocuSignUrl: PT.func.isRequired,
};
