/**
 * The child list row rendering.
 */
import PT from 'prop-types';
import React, { Component } from 'react';
import { themr } from 'react-css-super-themr';

import IconArrowUpSmall from 'assets/images/tc-edu/icon-arrow-up-small.svg';
import defaultTheme from './themes/default.scss';

export class ChildListRowInner extends Component {
  constructor(props) {
    super(props);

    const { selected } = props;
    this.state = {
      isOpenChild: !!selected,
    };
  }

  render() {
    const {
      theme,
      list,
      children,
      selected,
      onSelected,
    } = this.props;

    const { isOpenChild } = this.state;

    return (
      <div
        className={`${theme['child-list-row']} ${isOpenChild ? theme.expanded : ''} ${selected ? theme.selected : ''}`}
      >
        <button
          type="button"
          onClick={() => {
            if (children) {
              this.setState({ isOpenChild: !isOpenChild });
            }
            onSelected(list);
          }}
          className={theme['child-list-row-item']}
        >
          <span>{list.title}</span>
          {children && (<IconArrowUpSmall />)}
        </button>
        {isOpenChild && children}
      </div>
    );
  }
}

ChildListRowInner.defaultProps = {
  children: null,
  selected: false,
  onSelected: () => {},
  list: [],
};

ChildListRowInner.propTypes = {
  theme: PT.shape({
    'child-list-row': PT.string.isRequired,
    'child-list-row-item': PT.string.isRequired,
    expanded: PT.string.isRequired,
    selected: PT.string.isRequired,
  }).isRequired,
  list: PT.shape({
    id: PT.number.isRequired,
    title: PT.string.isRequired,
  }),
  children: PT.node,
  selected: PT.bool,
  onSelected: PT.func,
};

export default themr('Contentful-Blog', defaultTheme)(ChildListRowInner);
