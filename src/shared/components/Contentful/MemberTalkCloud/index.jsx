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
import defaultTheme from './themes/default.scss';

const MAX_MARGIN_TOP = 0;
const MIN_MARGIN_LEFT = -20;
const MAX_MARGIN_LEFT = 20;

const getRandomTranslate = () => ({
  y: MAX_MARGIN_TOP,
  x: _.random(MIN_MARGIN_LEFT, MAX_MARGIN_LEFT, false),
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
    const { theme } = this.props;
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
      <div className={theme.container}>
        <div className={left}>
          {_.map(leftSide, (item, index) => (
            <div className={entry} key={index}>
              <img
                alt={item.text}
                src={item.imageURL}
                onClick={() => this.onSelect(index + 1)}
                style={{
                  transform: `translate(${item.margins.x}px, ${item.margins.y}px)`,
                }}
              />
            </div>
          ))}
        </div>
        <div className={`${entry} ${active}`}>
          <img
            alt={activeBlob.text}
            src={activeBlob.imageURL}
            key={Math.random()}
          />
          <div className={blob}>
            <span>{`"${activeBlob.text}"`}</span>
            {activeBlob.ReadMoreURL && <a href={activeBlob.ReadMoreURL}>Read More</a>}
          </div>
        </div>
        <div className={right}>
          {_.map(rightSide, (item, index) => (
            <div className={entry} key={index}>
              <img
                alt={item.text}
                src={item.imageURL}
                onClick={() => this.onSelect(index + ITEMS_ON_LEFT_SIDE + 1)}
                style={{
                  transform: `translate(${item.margins.x}px, ${item.margins.y}px)`,
                }}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }
}


MemberTalkCloud.defaultProps = {
  content: [],
};

MemberTalkCloud.propTypes = {
  theme: PT.shape({
    container: PT.string.isRequired,
    entry: PT.string.isRequired,
    active: PT.string.isRequired,
    blob: PT.string.isRequired,
    left: PT.string.isRequired,
    right: PT.string.isRequired,
  }).isRequired,
  content: PT.arrayOf(PT.shape({
    imageURL: PT.string.isRequired,
    text: PT.string.isRequired,
    ReadMoreURL: PT.string,
  })),
};

export default themr('Member-Talk-Cloud', defaultTheme)(MemberTalkCloud);
