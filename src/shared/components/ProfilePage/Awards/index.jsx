import React, { useState } from 'react';
import PT from 'prop-types';
import { Modal } from 'topcoder-react-ui-kit';
import IconClose from 'assets/images/tc-edu/icon-close-big.svg';
import _ from 'lodash';

import style from './styles.scss';
import AwardBadge from './AwardBadge';
import AwatarModal from './AwardModal';

const Awards = ({ badges }) => {
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({});

  return (
    <React.Fragment>
      <div styleName="awards">
        <div styleName="header">
          <span>Community Awards & Honors</span>
        </div>

        <div styleName="badgesContainer">
          {
            badges.map((reward) => {
              const title = _.get(reward, 'org_badge.badge_name');
              const description = _.get(reward, 'org_badge.badge_description');
              const imageUrl = _.get(reward, 'org_badge.badge_image_url');

              return (
                <AwardBadge
                  title={title}
                  imageUrl={imageUrl}
                  onSelectBadge={() => {
                    setShowModal(true);
                    setModalData({
                      title,
                      description,
                      imageUrl,
                    });
                  }}
                />
              );
            })
          }
        </div>
      </div>
      {
        showModal && (
          <Modal onCancel={() => setShowModal(false)} theme={style}>
            <div styleName="award-modal">
              <div styleName="header">
                <h2 styleName="title">Community Awards & Honors</h2>
                <div styleName="icon" role="presentation" onClick={() => setShowModal(false)}>
                  <IconClose />
                </div>
              </div>
              <hr />

              <AwatarModal
                modalData={modalData}
              />
            </div>
          </Modal>
        )
      }
    </React.Fragment>
  );
};

Awards.defaultProps = {
  badges: [],
};

Awards.propTypes = {
  badges: PT.arrayOf(PT.shape()),
};

export default Awards;
