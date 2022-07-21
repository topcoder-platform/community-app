/**
 * Help Banner component
 */
import React, { useState } from 'react';
import cn from 'classnames';
import PT from 'prop-types';
import ArrowIcon from 'assets/images/icon-banner-selector.svg';
import './styles.scss';
import PageRow from '../PageRow';

const SettingsBanner = ({
  title,
  description,
  children,
  defaultOpen,
  row,
}) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div styleName="settings-banner">
      <div styleName="header">
        <div styleName="title">
          <span>{title}</span>
        </div>
        <div
          onClick={() => setOpen(!open)}
          role="presentation"
          styleName={cn('arrowIcon', open ? null : 'down')}
        >
          <ArrowIcon />
        </div>
      </div>

      {
        open ? (
          <div styleName="page-row">
            <PageRow row={row}>
              <div>
                <p styleName="description">{description}</p>
              </div>
              {children}
            </PageRow>
          </div>
        ) : null
      }
    </div>
  );
};

SettingsBanner.defaultProps = {
  title: '',
  description: '',
  children: null,
  defaultOpen: true,
  row: true,
};

SettingsBanner.propTypes = {
  title: PT.string,
  description: PT.string,
  children: PT.node,
  defaultOpen: PT.bool,
  row: PT.bool,
};

export default SettingsBanner;
