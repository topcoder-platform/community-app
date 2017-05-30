/* eslint-disable jsx-a11y/no-static-element-interactions */
/* I've disabled this rule because of false positive
   there is a known bug in eslint-plugin-jsx-a11y which is fixed in version 5.0
   https://github.com/evcohen/eslint-plugin-jsx-a11y/issues/214 */

/**
 * AccordionItem component
 */

import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';
import { themr } from 'react-css-themr';
import cn from 'classnames';
import IconTickDown from '../../../../../assets/images/tc-communities/tick_down_big.svg';
import defaultStyle from './style.scss';

function AccordionItem(props) {
  const { title, children, onTitleClick, isOpen, theme } = props;

  return (
    <div className={cn(theme.container, { [theme.containerOpen]: isOpen })}>
      <h3 className={theme.title} onClick={onTitleClick} role="button">
        <span className={theme.titleText}>{title}</span>
        <span className={theme.titleArrow}><IconTickDown /></span>
      </h3>
      <div className={theme.content}>
        {children}
      </div>
    </div>
  );
}

AccordionItem.defaultProps = {
  onTitleClick: _.noop,
  isOpen: false,
  theme: {},
};

AccordionItem.propTypes = {
  title: PT.string.isRequired,
  children: PT.node.isRequired,
  onTitleClick: PT.func,
  isOpen: PT.bool,
  theme: PT.shape({
    container: PT.string,
    containerOpen: PT.string,
    titleText: PT.string,
    titleArrow: PT.string,
    content: PT.string,
  }),
};

export default themr('tcCommunities-AccordionItem', defaultStyle)(AccordionItem);
