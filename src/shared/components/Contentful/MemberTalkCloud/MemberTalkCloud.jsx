/**
 * Member talk cloud component
 */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable prefer-destructuring */
import _ from 'lodash';
import PT from 'prop-types';
import React from 'react';
import { themr } from 'react-css-super-themr';
import { fixStyle } from 'utils/contentful';
import getSecureRandomIndex from 'utils/secureRandom';
import defaultTheme from './themes/default.scss';

const MAX_MARGIN_TOP = 0;
const MIN_MARGIN_LEFT = -20;
const MAX_MARGIN_LEFT = 30;

const getRandomTranslate = () => ({
  y: MAX_MARGIN_TOP,
  x: getSecureRandomIndex(MIN_MARGIN_LEFT, MAX_MARGIN_LEFT),
});

export class MemberTalkCloud extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedMember: 0,
      context: _.map(props.content, item => ({ ...item, margins: getRandomTranslate() })),
    };

    this.onSelect = this.onSelect.bind(this);
    this.getData = this.getData.bind(this);
  }

  onSelect(selectedMember) {
    this.setState({ selectedMember });
  }

  getData(newActiveIndex) {
    const { context } = this.state;
    const temp = context[newActiveIndex];
    context[newActiveIndex] = context[0];
    context[0] = temp;
    const ITEMS_ON_LEFT_SIDE = Math.floor(context.length / 2);

    const [activeBlob] = context;
    const leftSide = context.slice(1, ITEMS_ON_LEFT_SIDE + 1);
    const rightSide = context
      .slice(ITEMS_ON_LEFT_SIDE + 1);
    return {
      activeBlob,
      leftSide,
      rightSide,
    };
  }

  render() {
    const { theme, extraStylesForContainer, id } = this.props;
    const { selectedMember, context } = this.state;
    const { activeBlob, leftSide, rightSide } = this.getData(selectedMember);
    const ITEMS_ON_LEFT_SIDE = Math.floor(context.length / 2);
    const {
      entry,
      active,
      blob,
      left,
      right,
    } = theme;

    return (
      <div id={id} className={theme.container} style={fixStyle(extraStylesForContainer)}>
        <div className={left}>
          {_.map(leftSide, (item, index) => (
            <div
              className={entry}
              key={index}
              style={{
                transform: `translate(${item.margins.x}px, ${item.margins.y}px)`,
              }}
            >
              <img
                alt={item.handle}
                src={item.smallImageURL}
                onClick={() => this.onSelect(index + 1)}
              />
              <button onClick={() => this.onSelect(index + 1)} type="button" style={{ color: item.handleColor }}>{item.handle}</button>
            </div>
          ))}
        </div>
        <div className={`${entry} ${active}`}>
          <img
            alt={activeBlob.handle}
            src={activeBlob.imageURL}
            key={getSecureRandomIndex(0, 1000)}
          />
          <span className={theme.activeHandle}>{activeBlob.handle}</span>
          <div className={blob}>
            <span>{`"${activeBlob.text}"`}</span>
            {activeBlob.ReadMoreURL && <a href={activeBlob.ReadMoreURL}>{activeBlob.ReadMoreText || 'Read More'}</a>}
          </div>
        </div>
        <div className={right}>
          {_.map(rightSide, (item, index) => (
            <div
              className={entry}
              key={index}
              style={{
                transform: `translate(${item.margins.x}px, ${item.margins.y}px)`,
              }}
            >
              <img
                alt={item.handle}
                src={item.smallImageURL}
                onClick={() => this.onSelect(index + ITEMS_ON_LEFT_SIDE + 1)}
              />
              <button onClick={() => this.onSelect(index + ITEMS_ON_LEFT_SIDE + 1)} type="button" style={{ color: item.handleColor }}>{item.handle}</button>
            </div>
          ))}
        </div>
      </div>
    );
  }
}


MemberTalkCloud.defaultProps = {
  content: [],
  extraStylesForContainer: null,
};

MemberTalkCloud.propTypes = {
  theme: PT.shape({
    container: PT.string.isRequired,
    entry: PT.string.isRequired,
    active: PT.string.isRequired,
    blob: PT.string.isRequired,
    left: PT.string.isRequired,
    right: PT.string.isRequired,
    activeHandle: PT.string.isRequired,
  }).isRequired,
  content: PT.arrayOf(PT.shape({
    smllImageURL: PT.string.isRequired,
    imageURL: PT.string.isRequired,
    text: PT.string.isRequired,
    ReadMoreURL: PT.string,
    ReadMoreText: PT.string,
    handle: PT.string.isRequired,
    handleColor: PT.string.isRequired,
  })),
  extraStylesForContainer: PT.shape(),
  id: PT.string.isRequired,
};

export default themr('Member-Talk-Cloud', defaultTheme)(MemberTalkCloud);
