import React, { useState } from 'react';
import PT from 'prop-types';
import { Link } from 'react-router-dom';
import { get } from 'lodash';
import { Modal } from 'topcoder-react-ui-kit';
import IconClose from 'assets/images/tc-edu/icon-close-big.svg';
import FallBackAwardIcon from 'assets/images/default-award.svg';
import md from 'utils/markdown';
import AwardModal from '../ProfilePage/Awards/AwardModal';

import style from './styles.scss';

const ProfileBadges = ({ badges, handleParam }) => {
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({});

  return (
    <div styleName="outer-container">
      <Link
        to={`/members/${handleParam}`}
        styleName="memberPageBackLink"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="12"
          fill="none"
          viewBox="0 0 14 12"
        >
          <path
            fill="#137D60"
            fillRule="evenodd"
            d="M6.766 11.366a.8.8 0 01-1.132 0l-4.8-4.8a.8.8 0 010-1.132l4.8-4.8a.8.8 0 111.132 1.132L3.33 5.2h9.27a.8.8 0 010 1.6H3.33l3.435 3.434a.8.8 0 010 1.132z"
            clipRule="evenodd"
          />
        </svg>
        Return to Profile
      </Link>
      <div styleName="badgesWrap">
        <div styleName="seactionTitle">COMMUNITY AWARDS & HONORS</div>
        <div styleName="badgesGrid">
          {
            badges.rows.map((reward) => {
              const title = get(reward, 'org_badge.badge_name');
              const imageUrl = get(reward, 'org_badge.badge_image_url');
              let description = get(reward, 'org_badge.badge_description');
              if (description) {
                description = md(description);
              }

              return (
                <div
                  role="presentation"
                  styleName="awardBadge"
                  onClick={() => {
                    setShowModal(true);
                    setModalData({
                      title,
                      description,
                      imageUrl,
                    });
                  }}
                >
                  {
                    imageUrl ? (
                      <img src={imageUrl} alt="award-badge" styleName="image" />
                    ) : (
                      <FallBackAwardIcon styleName="image" />
                    )
                  }
                  <div styleName="title">
                    <span>
                      <div dangerouslySetInnerHTML={{ __html: title }} />
                    </span>
                  </div>
                </div>
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

              <AwardModal
                modalData={modalData}
              />
            </div>
          </Modal>
        )
      }
    </div>
  );
};

ProfileBadges.defaultProps = {
  badges: {},
};

ProfileBadges.propTypes = {
  badges: PT.shape(),
  handleParam: PT.string.isRequired,
};

export default ProfileBadges;
