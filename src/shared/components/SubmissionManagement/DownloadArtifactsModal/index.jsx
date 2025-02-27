/**
 * Modal Component for Image Decorators
 */
import _ from 'lodash';
import PT from 'prop-types';
import React, { useEffect, useState } from 'react';

import { Modal } from 'topcoder-react-ui-kit';

import LoadingIndicator from 'components/LoadingIndicator';
import DownloadIcon from '../Icons/IconSquareDownload.svg';
import style from './style.scss';

const theme = {
  container: style.modalContainer,
  overlay: style.modalOverlay,
};

export default function DownloadArtifactsModal({
  submissionId,
  onCancel,
  getSubmissionArtifacts,
  onDownloadArtifacts,
}) {
  const [artifacts, setArtifacts] = useState([]);
  const [loading, setLoading] = useState(false);

  const getArtifacts = async () => {
    const { artifacts: resp } = await getSubmissionArtifacts(submissionId);
    setArtifacts(resp);
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    getArtifacts();
  }, [submissionId]);

  return (
    <div styleName="container">
      <Modal
        onCancel={() => onCancel()}
        theme={theme}
      >
        <div styleName="content-wrapper">
          <div styleName="artifacts-list">
            <div styleName="header">
              <div styleName="header-title">Artifact ID</div>
              <div>Action</div>
            </div>
            {
              !loading && artifacts.map(item => (
                <div styleName="list-item">
                  <div styleName="artifact-name">{item}</div>
                  <button
                    onClick={() => onDownloadArtifacts(item, submissionId)}
                    type="button"
                    styleName="icon-download"
                  >
                    <DownloadIcon />
                  </button>
                </div>
              ))
            }

            {
              !loading && artifacts.length === 0 && <div styleName="no-artifacts">No artifacts found</div>
            }
          </div>
          {loading && <LoadingIndicator />}
        </div>
      </Modal>
    </div>
  );
}

DownloadArtifactsModal.defaultProps = {
  onCancel: _.noop,
  submissionId: '',
  getSubmissionArtifacts: _.noop,
  onDownloadArtifacts: _.noop,
};

DownloadArtifactsModal.propTypes = {
  onCancel: PT.func,
  submissionId: PT.string,
  getSubmissionArtifacts: PT.func,
  onDownloadArtifacts: PT.func,
};
