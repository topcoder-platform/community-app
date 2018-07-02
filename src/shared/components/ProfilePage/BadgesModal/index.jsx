/**
 * Badges Modal Component.  Displays badge categories and earned badges.
 */
import React from 'react';
import PT from 'prop-types';
import { noop } from 'lodash';

import Modal from 'components/Modal';
import Tooltip from 'components/Tooltip';

import CloseButton from 'assets/images/profile/x-mark-gray.svg';

import Popup from './Popup';

import {
  normalizeAchievements,
  getGroupAchievements,
  getSingleAchievements,
} from './achievementMap';

// These need to be named imports for the css-modules to work
/* eslint-disable no-unused-vars */
import badges from './badges.scss';
import modal from './modal.scss';
import styles from './styles.scss';
/* eslint-enable no-unused-vars */

const BadgesModal = ({
  achievements, handle, isMobile, onClose, photoURL,
}) => {
  const normalized = normalizeAchievements(achievements);
  const trigger = isMobile ? ['click'] : ['hover'];

  return (
    <Modal onCancel={onClose} theme={modal}>
      <header styleName="styles.head">
        <div>
          <div>
            { photoURL && <img src={photoURL} styleName="styles.profile-circle" alt="Member Portrait" /> }
            <span>
              {handle}
            </span>
            <span styleName="styles.divider">
              {' '}
              {'//'}
              {' '}
            </span>
            <span styleName="styles.title">
BADGES
            </span>
          </div>
        </div>
      </header>
      <aside styleName="styles.badges">
        <CloseButton onClick={onClose} styleName="styles.close-button" />
        <div styleName="styles.content">
          <div styleName="styles.badgeGroups">
            {
              getGroupAchievements(normalized).map(group => (
                <div key={group.id} styleName={`badges.groupBadge badges.${group.groupClass}`}>
                  { group.groupClass.substring(0, 9) === 'HP-Badges' && <span styleName="badges.subBadge badges.hpLogo" /> }
                  {
                    group.specificAchievements.map(achievement => (
                      <Tooltip
                        className={styles.tooltip}
                        content={
                          <Popup date={achievement.date} name={achievement.name} />
                        }
                        key={achievement.name}
                        suppressDiv
                        trigger={trigger}
                      >
                        <span styleName={`badges.subBadge badges.${achievement.specificClass} ${achievement.active ? 'badges.selected' : ''}`} />
                      </Tooltip>
                    ))
                  }
                </div>
              ))
            }
          </div>
          <div styleName="styles.footer-badges">
            {
              getSingleAchievements(normalized).map(achievement => (
                <Tooltip
                  className={styles.tooltip}
                  content={
                    <Popup date={achievement.date} name={achievement.name} />
                  }
                  key={achievement.id}
                  suppressDiv
                  trigger={trigger}
                >
                  <div styleName={`badges.singleBadge badges.${achievement.groupClass} ${achievement.active ? 'badges.selected' : ''}`} />
                </Tooltip>
              ))
            }
          </div>
        </div>
      </aside>
    </Modal>
  );
};

BadgesModal.defaultProps = {
  achievements: [],
  isMobile: false,
  onClose: noop,
  photoURL: '',
};

BadgesModal.propTypes = {
  achievements: PT.arrayOf(PT.shape()),
  handle: PT.string.isRequired,
  isMobile: PT.bool,
  photoURL: PT.string,
  onClose: PT.func,
};

export default BadgesModal;
