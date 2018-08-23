/**
 * AccordionItem component
 */
import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';
import { themr } from 'react-css-super-themr';
import Sticky from 'react-stickynode';
import IconTickDown from 'assets/images/tc-communities/tick_down_big.svg';
import defaultStyle from './style.scss';

function AccordionItem(props) {
  const {
    title, children, onTitleClick, isOpen, theme,
  } = props;

  const content = (
    <div className={`${theme.container} ${isOpen ? theme.containerOpen : ''}`}>
      <h3 className={theme.title}>
        <div
          className="accordion-title-button"
          onClick={onTitleClick}
          onKeyPress={onTitleClick}
          role="button"
          tabIndex={0}
        >
          <span className={theme.titleText}>
            {title}
          </span>
          <span className={theme.titleArrow}>
            <IconTickDown />
          </span>
        </div>
      </h3>
      <div className={theme.content}>
        {children}
      </div>
    </div>
  );

  return (
    <div>
      <Sticky
        bottomBoundary="#accordion"
        enableTransforms={false}
        styleName="desktop"
      >
        {content}
      </Sticky>
      <div styleName="mobile">
        {content}
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

export default themr('Contentful-AccordionItem', defaultStyle)(AccordionItem);
