/* eslint jsx-a11y/no-static-element-interactions:0 */

import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';
import cn from 'classnames';
import Modal from 'components/Modal';
import { PrimaryButton } from 'components/buttons';
import LoadingIndicator from 'components/LoadingIndicator';
import TermDetails from './TermDetails';

import CheckMark from '../../icons/check-mark.svg';
import styles from './styles.scss';

export default class TermsModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedTerm: null,
    };

    this.selectTerm = this.selectTerm.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(nextProps.agreedTerms, this.props.agreedTerms)) {
      this.setState({
        selectedTerm: null,
      });
      this.props.loadTerms();
    }
  }

  selectTerm(term) {
    this.setState({
      selectedTerm: term,
    });
    this.props.loadDetails(term.termsOfUseId);
  }

  render() {
    const { onCancel, title, terms, details, loadingTermId, docuSignUrl,
      getDocuSignUrl, register, agreeTerm, agreeingTerm,
      isLoadingTerms, registering, loadingDocuSignUrl } = this.props;
    const selectedTerm = this.state.selectedTerm;

    return (
      <div styleName="container">
        <Modal
          onCancel={onCancel}
          theme={{ container: styles['modal-container'] }}
        >
          {
            isLoadingTerms &&
            <LoadingIndicator />
          }
          {
            !isLoadingTerms && !selectedTerm &&
            <div>
              <div styleName="title">{title}</div>
              <div styleName="desc">
                The following groups of terms apply to this challenge.
                You need to agree to all of the terms within the group before you can register.
              </div>

              <table styleName="terms-table">
                <thead>
                  <tr>
                    <th>Terms</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    terms.map(t => (
                      <tr key={t.termsOfUseId}>
                        <td>
                          <span>{t.title}</span>
                          {
                            !t.agreed &&
                              <span>
                                (<span onClick={() => this.selectTerm(t)} styleName="view-agree">
                                  view and agree
                                </span>)
                              </span>
                          }
                        </td>
                        <td>
                          <CheckMark styleName={cn(['status-img', { required: !t.agreed }])} />
                          {t.agreed ? 'Completed' : 'Required'}
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>

              {
                terms && terms.length > 0 &&
                  <div styleName="button-container">
                    <PrimaryButton
                      disabled={registering || !_.every(this.props.terms, 'agreed')}
                      onClick={() => { register(); onCancel(); }}
                    >
                      Register
                    </PrimaryButton>
                  </div>
              }
            </div>
          }
          {
            !isLoadingTerms && selectedTerm &&
            <div>
              {
                loadingTermId === _.toString(selectedTerm.termsOfUseId) &&
                <LoadingIndicator />
              }
              {
                loadingTermId !== _.toString(selectedTerm.termsOfUseId) && details &&
                <TermDetails
                  details={details}
                  docuSignUrl={docuSignUrl}
                  getDocuSignUrl={getDocuSignUrl}
                  agreeTerm={agreeTerm}
                  agreeingTerm={agreeingTerm}
                  deselectTerm={() => this.setState({ selectedTerm: null })}
                  loadingDocuSignUrl={loadingDocuSignUrl}
                />
              }
            </div>
          }

        </Modal>
      </div>
    );
  }
}

TermsModal.defaultProps = {
  terms: [],
  title: '',
  details: {},
  loadingTermId: '',
  docuSignUrl: '',
  agreeingTerm: '',
  isLoadingTerms: false,
  registering: false,
  loadingDocuSignUrl: '',
  agreedTerms: {},
};

TermsModal.propTypes = {
  onCancel: PT.func.isRequired,
  title: PT.string,
  terms: PT.arrayOf(PT.shape()),
  loadDetails: PT.func.isRequired,
  details: PT.shape(),
  loadingTermId: PT.string,
  docuSignUrl: PT.string,
  getDocuSignUrl: PT.func.isRequired,
  register: PT.func.isRequired,
  agreeTerm: PT.func.isRequired,
  agreeingTerm: PT.string,
  loadTerms: PT.func.isRequired,
  isLoadingTerms: PT.bool,
  registering: PT.bool,
  loadingDocuSignUrl: PT.string,
  agreedTerms: PT.shape(),
};
