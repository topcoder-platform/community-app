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

const ITEMS_ON_LEFT_SIDE = 3;
const ITEMS_ON_RIGHT_SIDE = 2;

const MIN_MARGIN_TOP = 0;
const MAX_MARGIN_TOP = 100;
const MIN_MARGIN_LEFT = -10;
const MAX_MARGIN_LEFT = 60;

const getRandomMargin = _.once(() => ({
  marginTop: _.random(MIN_MARGIN_TOP, MAX_MARGIN_TOP, false),
  marginLeft: _.random(MIN_MARGIN_LEFT, MAX_MARGIN_LEFT, false),
}));

export class MemberTalkCloud extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedMember: 0,
    };

    this.onSelect = this.onSelect.bind(this);
    this.getData = this.getData.bind(this);
  }

  onSelect(selectedMember) {
    this.setState({ selectedMember });
  }

  getData(newActiveIndex) {
    const { content } = this.props;
    const temp = content[newActiveIndex];
    content[newActiveIndex] = content[0];
    content[0] = temp;

    const [activeBlob] = content;
    const leftSide = content.slice(1, ITEMS_ON_LEFT_SIDE + 1);
    const rightSide = content
      .slice(ITEMS_ON_LEFT_SIDE + 1, ITEMS_ON_LEFT_SIDE + 1 + ITEMS_ON_RIGHT_SIDE);
    return {
      activeBlob,
      leftSide,
      rightSide,
    };
  }

  render() {
    const { theme } = this.props;
    const { selectedMember } = this.state;
    const { activeBlob, leftSide, rightSide } = this.getData(selectedMember);
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
          {_.map(leftSide, (item, index) => {
            const { marginTop, marginLeft } = getRandomMargin();
            return (
              <div className={entry} key={index}>
                <img
                  alt={item.text}
                  src={item.imageURL}
                  onClick={() => this.onSelect(index + 1)}
                  style={{
                    marginTop: `${marginTop}px`,
                    marginLeft: `${marginLeft}px`,
                  }}
                />
              </div>
            );
          })}
        </div>
        <div className={`${entry} ${active}`}>
          <img
            alt={activeBlob.text}
            src={activeBlob.imageURL}
          />
          <div className={blob}>
            <svg viewBox="0 0 350 350" xmlns="http://www.w3.org/2000/svg">
              <path fill="#F4F4F4" d="M46.3,-62.4C60.7,-53.3,73.5,-40.7,79.5,-25.2C85.4,-9.7,84.5,8.7,77.8,24C71.1,39.3,58.7,51.5,44.8,60.9C30.8,70.3,15.4,76.9,0.2,76.6C-15,76.3,-30.1,69.2,-45.8,60.4C-61.6,51.6,-78,41.2,-84.7,26.2C-91.3,11.3,-88.2,-8.2,-80,-23.8C-71.9,-39.4,-58.8,-51.1,-44.6,-60.4C-30.5,-69.6,-15.2,-76.4,0.4,-76.9C16,-77.3,31.9,-71.6,46.3,-62.4Z" transform="scale(1.75 1.75) translate(100 100)" />
            </svg>
            {activeBlob.text}
            {activeBlob.ReadMoreURL && <a href={activeBlob.ReadMoreURL}>Read More</a>}
          </div>
        </div>
        <div className={right}>
          {_.map(rightSide, (item, index) => {
            const { marginTop, marginLeft } = getRandomMargin();
            return (
              <div className={entry} key={index}>
                <img
                  alt={item.text}
                  src={item.imageURL}
                  onClick={() => this.onSelect(index + ITEMS_ON_LEFT_SIDE + 1)}
                  style={{
                    marginTop: `${marginTop}px`,
                    marginLeft: `${marginLeft}px`,
                  }}
                />
              </div>
            );
          })}
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
