/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useState } from 'react';
import PT from 'prop-types';

import VerifiedIconWhite from 'assets/images/profile/verified-icon-white.svg';

import './styles.scss';

const List = ({
  skills,
  isVerified,
  isMobile,
}) => {
  const MAX_VISIBLE = isMobile ? 3 : 5;

  const [isWrapped, setIsWrapped] = useState(false);
  const [visibleSkills, setVisibleSkills] = useState([]);

  useEffect(() => {
    if (skills.length > MAX_VISIBLE) {
      setIsWrapped(true);
      setVisibleSkills(skills.slice(0, MAX_VISIBLE));
    } else {
      setIsWrapped(false);
      setVisibleSkills(skills);
    }
  }, []);

  const showHiddenSkills = () => {
    setVisibleSkills(skills);
    setIsWrapped(false);
  };

  return (
    <div styleName="list">
      {
      visibleSkills.map(({
        tagId, tagName, hidden,
      }) => (
        !hidden
        && (
        <div key={tagId}>
          <div styleName="skill">
            {
              isVerified && <div styleName="verified-icon"><VerifiedIconWhite /></div>
            }
            <span>{tagName}</span>
          </div>
        </div>
        )
      ))
    }
      {
      isWrapped && (
        <div
          styleName="add-button"
          onClick={showHiddenSkills}
          role="button"
          tabIndex={0}
        >
          <span>+{skills.length - visibleSkills.length}</span>
        </div>
      )
    }
    </div>
  );
};

List.propTypes = {
  skills: PT.arrayOf(PT.shape()).isRequired,
  isVerified: PT.bool.isRequired,
  isMobile: PT.bool.isRequired,
};

export default List;
