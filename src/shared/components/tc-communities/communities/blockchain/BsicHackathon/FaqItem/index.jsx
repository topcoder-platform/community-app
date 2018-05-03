import PT from 'prop-types';
import React from 'react';

import Carret from 'assets/images/communities/cognitive/resources/carret.svg';

import './style.scss';

export default function FaqItem({
  children,
  open,
  question,
  toggle,
}) {
  return (
    <div styleName="container">
      <div
        onClick={() => toggle(!open)}
        onKeyDown={() => toggle(!open)}
        role="button"
        styleName="question"
        tabIndex={0}
      >
        {question}
        <Carret
          transform={open ? null : 'scale(1, -1)'}
        />
      </div>
      { open ? <div styleName="answer">{children}</div> : null }
    </div>
  );
}

FaqItem.defaultProps = {
  children: null,
  open: false,
  question: '',
};

FaqItem.propTypes = {
  children: PT.node,
  open: PT.bool,
  question: PT.string,
  toggle: PT.func.isRequired,
};
