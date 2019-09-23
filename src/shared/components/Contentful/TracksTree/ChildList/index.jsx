/**
 * The child list rendering.
 */
import _ from 'lodash';
import PT from 'prop-types';
import React from 'react';
import { themr } from 'react-css-super-themr';

import ChildListRow from '../ChildListRow';
import defaultTheme from './themes/default.scss';


export function ChildListInner(props) {
  const {
    theme,
    list,
    onSelected,
  } = props;

  return (
    <div className={theme['child-list']}>
      {
        _.map(list, option => (
          <ChildListRow
            onSelected={onSelected}
            key={option.id}
            list={option}
            selected={!!option.selected}
          >
            {(option.items.length > 0) && (
              <ChildListInner
                list={option.items}
                theme={theme}
                onSelected={onSelected}
              />
            )}
          </ChildListRow>
        ))
      }
    </div>
  );
}

ChildListInner.defaultProps = {
  onSelected: () => {},
};

ChildListInner.propTypes = {
  theme: PT.shape({
    'child-list': PT.string.isRequired,
  }).isRequired,
  list: PT.arrayOf(PT.shape({
    id: PT.number.isRequired,
    title: PT.string.isRequired,
    selected: PT.bool,
    items: PT.array.isRequired, // the structruct same as list,
  })).isRequired,
  onSelected: PT.func,
};

export default themr('Contentful-Blog', defaultTheme)(ChildListInner);
