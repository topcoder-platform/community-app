/**
 * Help Banner component
 */
import React, { useState } from 'react';
import cn from 'classnames';
import PT from 'prop-types';
import ArrowIcon from 'assets/images/icon-banner-selector.svg';
import styles from './styles.scss';
import PageRow from '../PageRow';

const SettingsBanner = ({
  title,
  description,
  children,
  defaultOpen,
  row,
}) => {
  const [open, setOpen] = useState(defaultOpen);
  const childrenArr = React.Children.toArray(children);

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
            { childrenArr.length > 1 && childrenArr[0] }
            <PageRow row={row}>
              <div>
                <p styleName="description">{description}</p>
              </div>
              {childrenArr.length > 1 ? childrenArr[1] : childrenArr[0] }
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

export function SettingBannerV2({ children }) {
  const [open, setOpen] = useState(true);

  const [heading, ...content] = React.Children.toArray(children);
  const header = React.cloneElement(heading, {
    onClick: () => setOpen(!open),
    className: `${heading.props.className} ${styles.collapse} ${open ? '' : styles.closed}`,
  });

  return (
    <React.Fragment>
      {header}
      {open && content}
    </React.Fragment>
  );
}

SettingBannerV2.propTypes = {
  children: PT.node.isRequired,
};

export default SettingsBanner;
