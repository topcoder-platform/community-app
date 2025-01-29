/**
 * PageUl
 *
 * page content row (flex -> row)
 */
import React from 'react';
import PT from 'prop-types';
import cn from 'classnames';
import './styles.scss';

const PageRow = ({
  children, half = false, row, styleName, ...props
}) => (
  <div
    styleName={cn(
      'page-row',
      (row && half) && 'page-row-half',
      row && 'page-row-normal',
      !row && 'page-col',
      styleName || '',
    )}
    {...props}
  >
    {children}
  </div>
);

PageRow.defaultProps = {
  children: null,
  half: false,
  row: true,
  styleName: {},
};

PageRow.propTypes = {
  children: PT.node,
  half: PT.bool,
  row: PT.bool,
  styleName: PT.shape(),
};

export default PageRow;
