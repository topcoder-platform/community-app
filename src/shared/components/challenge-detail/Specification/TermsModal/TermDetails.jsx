/* eslint react/no-danger:0 */

import React from 'react';
import PT from 'prop-types';
import cn from 'classnames';
import { PrimaryButton, Button } from 'components/buttons';
import LoadingIndicator from 'components/LoadingIndicator';

import style from './TermDetails.scss';

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
    const { details, docuSignUrl, agreeingTerm, agreeTerm, closeModal,
      loadingDocuSignUrl, viewOnly, agreed, nextTerm } = this.props;

    return (
      <div>
        {
          details.agreeabilityType === 'Electronically-agreeable' &&
          <div>
            <div styleName="body" dangerouslySetInnerHTML={{ __html: details.text }} />
            {
              !viewOnly &&
              <div styleName="buttons">
                {
                  agreed ?
                    (<PrimaryButton
                      theme={style}
                      onClick={nextTerm}
                    >Next</PrimaryButton>) :
                    (<div>
                      <PrimaryButton
                        disabled={agreeingTerm === details.termsOfUseId}
                        onClick={() => agreeTerm(details.termsOfUseId)}
                        theme={style}
                      >I Agree</PrimaryButton>
                      <Button
                        onClick={closeModal}
                        theme={style}
                      >I Disagree</Button>
                    </div>)
                }
              </div>
            }
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
            <iframe title={details.title} src={docuSignUrl} styleName={cn(['frame', { loading: this.state.loadingFrame }])} onLoad={this.frameLoaded} />
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
  closeModal: PT.func.isRequired,
  loadingDocuSignUrl: PT.string,
  getDocuSignUrl: PT.func.isRequired,
  viewOnly: PT.bool.isRequired,
  agreed: PT.bool.isRequired,
  nextTerm: PT.func.isRequired,
};
