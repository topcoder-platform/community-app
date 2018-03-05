/**
 * A standard carousel component.
 *
 * Currently this is a wrapper arround nuka-carousel, that improves its
 * responsiveness to the viewport size changes:
 * - Shows / hides scrolling buttons when necessary;
 * - Aligns the content in center when all cards can be shown at once.
 */

/* global window */

import Nuka from 'nuka-carousel';
import PT from 'prop-types';
import React from 'react';

/* We have to use state component, as we need to manipulate with DOM nodes to
 * access nuka-carousel state. */
export default class Carousel extends React.Component {
  constructor(props) {
    super(props);
    this.check = this.check.bind(this);
    this.state = {};
  }

  componentDidMount() {
    window.addEventListener('resize', this.check);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.check);
  }

  /**
   * Checks carousel state to determine, whether the left / right arrows should
   * be shown.
   */
  check() {
    if (!this.carousel) return;
    const st = this.carousel.state;
    const showNext = st.currentSlide < st.slideCount - st.slidesToScroll;
    const showPrev = st.left < 0;
    if (showNext !== this.state.showNext
    || showPrev !== this.state.showPrev) {
      this.setState({ showPrev, showNext });
    }
  }

  render() {
    const { children, NextButton, PrevButton } = this.props;
    const st = this.state;
    const decorators = [];
    if (st.showNext && NextButton) {
      decorators.push({
        component: () => (
          <NextButton
            onClick={() => this.carousel && this.carousel.nextSlide()}
          />
        ),
        position: 'CenterRight',
        style: {
          cursor: 'pointer',
          marginRight: 40,
        },
      });
    }
    if (st.showPrev && PrevButton) {
      decorators.push({
        component: () => (
          <PrevButton
            onClick={() => this.carousel && this.carousel.previousSlide()}
          />
        ),
        position: 'CenterLeft',
        style: {
          cursor: 'pointer',
          marginLeft: 40,
        },
      });
    }
    return (
      <Nuka
        {...this.props}
        afterSlide={() => setImmediate(() => this.check())}
        decorators={decorators}
        framePadding="0 100px"
        ref={(node) => {
          this.carousel = node;
          if (node) this.check();
        }}
        slidesToScroll="auto"
        style={{
          display: 'flex',
          justifyContent: 'center',
        }}
      >{children}</Nuka>
    );
  }
}

Carousel.defaultProps = {
  NextButton: null,
  PrevButton: null,
};

Carousel.propTypes = {
  children: PT.node.isRequired,
  NextButton: PT.func,
  PrevButton: PT.func,
};
