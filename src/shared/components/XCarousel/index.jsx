/* global cancelAnimationFrame, document, requestAnimationFrame, window */

import _ from 'lodash';
import PT from 'prop-types';
import React from 'react';

import DefaultNextButton from 'assets/images/arrow-next.svg';
import DefaultPrevButton from 'assets/images/arrow-prev.svg';

import './style.scss';

export const ALIGN = {
  CENTER: 'center',
  END: 'end',
  START: 'start',
};

/**
 * Gets DOM node size.
 * @param {Object} node DOM node.
 * @return {Object} Object with two fields, `h` and `w`, for node height and
 *  width, correspondingly.
 */
function getNodeSize(node) {
  if (!node) return { h: 0, w: 0 };
  const box = node.getBoundingClientRect();
  return { h: box.height, w: box.width };
}

function interpolate(a, b, t) {
  return ((a * (1 - t)) + (b * t));
}

function newZeroSize() {
  return { h: 0, w: 0 };
}

function isSameSize(a, b) {
  const aa = a || newZeroSize();
  const bb = b || newZeroSize();
  return aa.h === bb.h && aa.w === bb.w;
}

function isSameMetric(a, b) {
  if (a.itemSize.length !== b.itemSize.length
  || a.maxItemH !== b.maxItemH || a.totalItemsW !== b.totalItemsW
  || !isSameSize(a.containerSize, b.containerSize)
  || !isSameSize(a.nextButtonSize, b.nextButtonSize)
  || !isSameSize(a.prevButtonSize, b.prevButtonSize)) return false;
  for (let index = 0; index !== a.itemSize.length; index += 1) {
    if (!isSameSize(a.itemSize[index], b.itemSize[index])) return false;
  }
  return true;
}

export default class XCarousel extends React.Component {
  constructor(props) {
    super(props);

    /* Current state of the carousel. */
    this.state = {
      containerSize: newZeroSize(),
      itemSize: props.children.map(() => newZeroSize()),
      maxItemH: 0,

      /* Positions of prev/next buttons, as the horizontal size of the visible
       * button piece (i.e. 0 means that the button is shifted out of the sight,
       * and button width means that the button is fully visible at its side of
       * the container). */
      nextButtonPos: 0,
      prevButtonPos: 0,

      nextButtonSize: newZeroSize(),
      prevButtonSize: newZeroSize(),

      nextState: null,
      prevState: null,

      pos: 0,
      totalItemsW: 0,
    };

    /* References to all important DOM nodes of the carousel. */
    this.nodes = {
      container: null,
      nextButton: null,
      prevButton: null,
      viewport: null,
    };

    /* Holds the grab anchor data. */
    this.anchor = null;

    /* During the grabbing, it holds the current cursor position. */
    this.cursor = null;

    this.nextAnimationFrameId = 0;

    this.animateGrabbing = this.animateGrabbing.bind(this);
    this.animateRolling = this.animateRolling.bind(this);
    this.onGrabEnd = this.onGrabEnd.bind(this);
    this.onGrabMove = this.onGrabMove.bind(this);
    this.onGrabStart = this.onGrabStart.bind(this);
    this.onResize = this.onResize.bind(this);
    this.rollToNext = this.rollToNext.bind(this);
    this.rollToPrev = this.rollToPrev.bind(this);
    this.setContainer = this.setContainer.bind(this);
    this.setNextButton = this.setNextButton.bind(this);
    this.setPrevButton = this.setPrevButton.bind(this);
    this.setViewport = this.setViewport.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this.onResize);
    document.addEventListener('mousemove', this.onGrabMove);
    document.addEventListener('mouseup', this.onGrabEnd);
  }

  componentDidUpdate() {
    if (!this.nextAnimationFrameId) this.updateMetric();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
    document.removeEventListener('mousemove', this.onGrabMove);
    document.removeEventListener('mouseup', this.onGrabEnd);
    this.stopAnimation();
  }

  onGrabEnd() {
    if (!this.anchor) return;
    document.body.style.cursor = this.previousBodyCursor;
    this.anchor = null;
    this.stopAnimation();
    this.initAnimation(this.normalizeState(this.state));
    this.animateRolling();
  }

  onGrabMove(event) {
    if (!this.anchor) return;
    const e = event.changedTouches ? event.changedTouches[0] : event;
    this.cursor = { x: e.screenX, y: e.screenY };
  }

  onGrabStart(event) {
    const e = event.changedTouches ? event.changedTouches[0] : event;
    this.anchor = { pos: this.state.pos, x: e.screenX, y: e.screenY };
    this.cursor = { x: e.screenX, y: e.screenY };
    this.previousBodyCursor = document.body.style.cursor;
    document.body.style.cursor = '-webkit-grabbing';
    if (e.preventDefault) e.preventDefault();
    this.stopAnimation();
    this.animateGrabbing();
  }

  onResize() {
    this.updateMetric();
  }

  /**
   * Records reference to the root DOM node of the carousel. As it is the root
   * node, this callback will be fired last (compared to the similar callbacks
   * set for important inner nodes of the carousel), thus at this point we'll
   * have recorded the references to all important inner nodes, and thus can
   * measure them all in one point.
   * @param {Object} node DOM node.
   */
  setContainer(node) {
    this.nodes.container = node;
    this.updateMetric();
  }

  setNextButton(node) {
    this.nodes.nextButton = node;
  }

  setPrevButton(node) {
    this.nodes.prevButton = node;
  }

  setViewport(node) {
    this.nodes.viewport = node;
  }

  animateGrabbing() {
    const pos = this.anchor.pos - (this.cursor.x - this.anchor.x);
    this.nextAnimationFrameId = requestAnimationFrame(this.animateGrabbing);
    if (this.state.pos !== pos) this.setState({ pos });
  }

  animateRolling() {
    const next = this.nextState;
    const prev = this.prevState;

    let t = (Date.now() - prev.timestamp) / this.props.speed;
    if (t > 1) t = 1;
    else if (t) t = Math.sqrt(t);
    this.setState({
      pos: interpolate(prev.pos, next.pos, t),
      nextButtonPos: interpolate(prev.nextButtonPos, next.nextButtonPos, t),
      prevButtonPos: interpolate(prev.prevButtonPos, next.prevButtonPos, t),
    });
    if (t < 1) {
      this.nextAnimationFrameId = requestAnimationFrame(this.animateRolling);
    } else this.updateMetric();
  }

  initAnimation(nextState) {
    const now = Date.now();
    this.prevState = _.clone(this.state);
    this.prevState.timestamp = now;
    this.nextState = nextState;
    this.nextState.timestamp = now + this.props.speed;
  }

  /**
   * Normalizes the given component state.
   * @param {Object} state Input state.
   * @return {Object} Resulting state.
   */
  normalizeState(state) {
    const {
      justifyUnderflow,
    } = this.props;

    const res = _.clone(state);
    if (state.totalItemsW < state.containerSize.w) {
      res.nextButtonPos = 0;
      res.prevButtonPos = 0;
      res.pos = justifyUnderflow === ALIGN.START ? 0 :
        res.totalItemsW - res.containerSize.w;
      if (justifyUnderflow === ALIGN.CENTER) res.pos /= 2;
    } else if (res.pos <= 0) {
      res.pos = 0;
      res.nextButtonPos = res.nextButtonSize.w;
      res.prevButtonPos = 0;
    } else if (res.pos > 0) {
      res.nextButtonPos = res.nextButtonSize.w;
      res.prevButtonPos = res.prevButtonSize.w;
      let alt = 0;
      let pos = 0;
      let index = 0;
      let old = res.pos;
      while (index < res.itemSize.length - 1) {
        alt += res.itemSize[index].w;
        const neu = Math.abs(res.pos - alt);
        if (old <= neu) break;
        index += 1;
        pos = alt;
        old = neu;
      }
      const maxPos = res.totalItemsW -
        (res.containerSize.w - res.prevButtonPos);
      if (res.pos >= maxPos) {
        res.pos = maxPos;
        res.nextButtonPos = 0;
      } else res.pos = pos;
    }
    return res;
  }

  measure() {
    this.stopAnimation();
    const res = {
      itemSize: [],
      maxItemH: 0,
      totalItemsW: 0,
    };
    if (this.nodes.viewport) {
      this.nodes.viewport.childNodes.forEach((item) => {
        const size = getNodeSize(item);
        if (res.maxItemH < size.h) res.maxItemH = size.h;
        res.totalItemsW += size.w;
        res.itemSize.push(size);
      });
    }
    res.nextButtonSize = getNodeSize(this.nodes.nextButton);
    res.prevButtonSize = getNodeSize(this.nodes.prevButton);
    res.containerSize = getNodeSize(this.nodes.container);
    return res;
  }

  rollToNext() {
    const state = _.clone(this.state);
    state.pos += state.containerSize.w
      - state.nextButtonPos - state.prevButtonPos;
    this.initAnimation(this.normalizeState(state));
    this.animateRolling();
  }

  rollToPrev() {
    const state = _.clone(this.state);
    state.pos -= state.containerSize.w
      - state.nextButtonPos - state.prevButtonPos;
    this.initAnimation(this.normalizeState(state));
    this.animateRolling();
  }

  stopAnimation() {
    if (!this.nextAnimationFrameId) return;
    cancelAnimationFrame(this.nextAnimationFrameId);
    this.nextAnimationFrameId = 0;
  }

  updateMetric() {
    const metric = this.measure();
    if (isSameMetric(metric, this.state)) return;
    const state = { ...this.state, ...metric };
    this.stopAnimation();
    setImmediate(() => this.setState(this.normalizeState(state)));
  }

  render() {
    const {
      alignItems,
      children,
    } = this.props;

    const st = this.state;
    let layoutPos = -st.pos;

    return (
      <div
        ref={this.setContainer}
        style={{
          height: st.maxItemH,
        }}
        styleName="container"
      >
        <div
          onMouseDown={this.rollToPrev}
          ref={this.setPrevButton}
          role="button"
          style={{
            left: st.prevButtonPos - st.prevButtonSize.w,
            top: (st.maxItemH - st.prevButtonSize.h) / 2,
            opacity: st.prevButtonPos ? 1 : 0,
          }}
          styleName="rollButton"
          tabIndex={0}
        ><DefaultPrevButton styleName="defaultRollButtonIcon" />
        </div>
        <div
          onTouchEnd={this.onGrabEnd}
          onTouchMove={this.onGrabMove}
          onTouchStart={this.onGrabStart}
          onMouseDown={this.onGrabStart}
          ref={this.setViewport}
          role="button"
          style={{
            cursor: this.anchor && '-webkit-grabbing',
            left: st.prevButtonPos,
            width: st.containerSize.w - st.nextButtonPos - st.prevButtonPos,
          }}
          styleName="viewport"
          tabIndex={0}
        >
          {
            children.map((item, index) => {
              let top = alignItems === ALIGN.START
                ? 0 : st.maxItemH - st.itemSize[index].h;
              if (alignItems === ALIGN.CENTER) top /= 2;

              const res = (
                <div
                  key={index} // eslint-disable-line react/no-array-index-key
                  style={{
                    left: layoutPos,
                    top,
                  }}
                  styleName="item"
                >{item}
                </div>
              );
              layoutPos += st.itemSize[index].w;
              return res;
            })
          }
        </div>
        <div
          onMouseDown={this.rollToNext}
          ref={this.setNextButton}
          role="button"
          style={{
            opacity: st.nextButtonPos ? 1 : 0,
            right: st.nextButtonPos - st.nextButtonSize.w,
            top: (st.maxItemH - st.nextButtonSize.h) / 2,
          }}
          styleName="rollButton"
          tabIndex={0}
        ><DefaultNextButton styleName="defaultRollButtonIcon" />
        </div>
      </div>
    );
  }
}

XCarousel.defaultProps = {
  alignItems: ALIGN.CENTER,
  justifyUnderflow: ALIGN.CENTER,
  speed: 300,
};

const VALID_ALIGNMENTS = _.values(ALIGN);

XCarousel.propTypes = {
  alignItems: PT.oneOf(VALID_ALIGNMENTS),
  children: PT.arrayOf(PT.node).isRequired,
  justifyUnderflow: PT.oneOf(VALID_ALIGNMENTS),
  speed: PT.number,
};
