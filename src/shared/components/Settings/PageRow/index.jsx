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
  children, half = false, styleName, ...props
}) => (
  <div
    styleName={cn(
      'page-row',
      half ? 'page-row-half' : 'page-row-normal',
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
  styleName: {},
};

PageRow.propTypes = {
  children: PT.node,
  half: PT.bool,
  styleName: PT.shape(),
};

export default PageRow;
