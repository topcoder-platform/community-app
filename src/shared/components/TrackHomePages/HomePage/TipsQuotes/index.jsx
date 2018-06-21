/**
* Tips & Quotes Component
 */
/* eslint-disable react/no-danger */
import React from 'react';
import PT from 'prop-types';
import showdown from 'showdown';
import { getItems } from 'utils/track-homepages';

import './styles.scss';

const converter = new showdown.Converter();

class TipsQuotes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tipsQuotes: getItems(props.numTipsQuotes, props.data.tipsQuotes),
    };
  }
  render() {
    return (
      <div styleName="container">
        {
          this.state.tipsQuotes.map(tipQuote => (
            <div key={tipQuote.text} styleName="tip-quote">
              <div
                styleName="text"
                dangerouslySetInnerHTML={
                  { __html: converter.makeHtml(tipQuote.text) }
                }
              />
              <div styleName="member">
                <div styleName="member-photo">
                  <img src={tipQuote.memberPhoto.file.url} alt={tipQuote.memberHandle} />
                </div>
                <div styleName="member-info">
                  <a href={tipQuote.memberProfileLink} target="_blank" rel="noopener noreferrer" styleName="member-handle">{ tipQuote.memberHandle}</a>
                  <div styleName="member-date">{`Topcoder member since ${tipQuote.memberSince}`}</div>
                </div>
              </div>
            </div>
          ))
        }
      </div>
    );
  }
}

TipsQuotes.defaultProps = {
  numTipsQuotes: 4,
};

TipsQuotes.propTypes = {
  numTipsQuotes: PT.number,
  data: PT.shape().isRequired,
};

export default TipsQuotes;
