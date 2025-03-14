/**
 * Modal Component for Image Decorators
 */
import _ from 'lodash';
import PT from 'prop-types';
import React, { useEffect, useState } from 'react';

import { Modal, PrimaryButton } from 'topcoder-react-ui-kit';
import tc from 'components/buttons/themed/tc.scss';

import LoadingIndicator from 'components/LoadingIndicator';
import IconClose from 'assets/images/icon-close-green.svg';
import DownloadIcon from '../Icons/IconSquareDownload.svg';
import style from './style.scss';

const theme = {
  container: style.modalContainer,
  overlay: style.modalOverlay,
};

const buttonThemes = {
  tc,
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
    <div className={style.container}>
      <Modal
        onCancel={() => onCancel()}
        theme={theme}
      >
        <div className={style["content-wrapper"]}>
          <div className={style["modal-header"]}>
            <h2 className={style["modal-title"]}>Artifacts</h2>
            <div className={style["icon"]}role="presentation" onClick={() => onCancel()}>
              <IconClose />
            </div>
          </div>
          <hr className={style["hr"]} />
          <div className={style["artifacts-list"]}>
            <div className={style["header"]}>
              <div className={style["header-title"]}>Artifact ID</div>
              <div>Action</div>
            </div>
            {
              !loading && artifacts.map(item => (
                <div className={style["list-item"]}>
                  <div className={style["artifact-name"]}>{item}</div>
                  <button
                    onClick={() => onDownloadArtifacts(item, submissionId)}
                    type="button"
                    className={style["icon-download"]}
                  >
                    <DownloadIcon />
                  </button>
                </div>
              ))
            }

            {
              !loading && artifacts.length === 0 && <div className={style["no-artifacts"]}>No artifacts found</div>
            }
          </div>
          {loading && <LoadingIndicator />}
        </div>
        <div className={style["buttons-container"]}>
          <PrimaryButton
            onClick={() => onCancel()}
            theme={{
              button: buttonThemes.tc['primary-green-md'],
            }}
          >
            Close
          </PrimaryButton>
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
