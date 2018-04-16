/**
 * components.MemberSearchInput
 * <MemberSearchInput> Component
 *
 * Description:
 *   Component for autocompleting member names when connected to the
 *   members API
 *
 * Adapted from connect-app-dev / AutoCompleteInput
 */
/* eslint-env browser */
import React from 'react';
import PT from 'prop-types';
import { Avatar } from 'topcoder-react-ui-kit';

import './style.scss';

export const AUTOCOMPLETE_TRIGGER_LENGTH = 3;

class MemberSearchInput extends React.Component {
  constructor(props) {
    super(props);
    this.onClickOutside = this.onClickOutside.bind(this);
  }

  componentDidMount() {
    document.addEventListener('click', this.onClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.onClickOutside);
  }

  onClickOutside(e) {
    const { onToggleSearchPopup } = this.props;
    if (e.target === this.input) {
      return;
    }
    onToggleSearchPopup(false, e);
  }

  render() {
    const {
      disabled,
      isPopupVisible,
      searchMembers,
      keyword,
      onKeywordChange,
      onSelectNewMember,
      onToggleSearchPopup,
      selectedNewMember,
      placeholder,
    } = this.props;

    const renderMember = (member, i) => {
      const onClick = (e) => {
        this.input.focus();
        onSelectNewMember(member, e);
      };
      return (
        <div
          onClick={onClick}
          onKeyPress={onClick}
          styleName="dropdown-cell"
          key={i}
          role="menuitem"
          tabIndex={i}
        >
          <Avatar size={30} url={member.photoURL} />
          <div styleName="handle">{member.handle}</div>
        </div>
      );
    };

    return (
      <div styleName="container">
        {isPopupVisible &&
          keyword.length >= AUTOCOMPLETE_TRIGGER_LENGTH &&
          searchMembers.length > 0 &&
          <div styleName="member-dropdown">
            {searchMembers.map(renderMember)}
          </div>
        }
        <div styleName="avatarPrefix">
          <Avatar url={selectedNewMember && selectedNewMember.photoURL} />
        </div>
        <input
          disabled={disabled}
          ref={(c) => { this.input = c; }}
          value={keyword}
          type="text"
          placeholder={placeholder}
          onChange={e => onKeywordChange(e.target.value)}
          onClick={() => onToggleSearchPopup(true)}
          onKeyUp={() => onToggleSearchPopup(true)}
        />
      </div>
    );
  }
}

MemberSearchInput.defaultProps = {
  disabled: false,
  placeholder: 'username',
};

MemberSearchInput.propTypes = {
  disabled: PT.bool,
  placeholder: PT.string,
  searchMembers: PT.arrayOf(PT.shape()).isRequired,
  selectedNewMember: PT.shape().isRequired,
  keyword: PT.string.isRequired,
  isPopupVisible: PT.bool.isRequired,
  onKeywordChange: PT.func.isRequired,
  onSelectNewMember: PT.func.isRequired,
  onToggleSearchPopup: PT.func.isRequired,
};

export default MemberSearchInput;
