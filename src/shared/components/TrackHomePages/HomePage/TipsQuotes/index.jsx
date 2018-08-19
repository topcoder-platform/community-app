/**
 * Tips & Quotes Component
 */
/* eslint-disable react/no-danger */
import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';
import showdown from 'showdown';
import { getItems } from 'utils/track-homepages';
import ContentfulLoader from 'containers/ContentfulLoader';

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
    const { data } = this.props;
    const { tipsQuotes } = this.state;
    const entryIds = _.map(data.tipsQuotes, item => (item.sys.id));
    return (
      <ContentfulLoader
        entryIds={entryIds}
        render={(result) => {
          for (let i = 0; i !== entryIds.length; i += 1) {
            data.tipsQuotes[i].fields = result.entries.items[entryIds[i]].fields;
          }
          const assetIds = _.map(data.tipsQuotes, item => (item.fields.memberPhoto.sys.id));
          return (
            <ContentfulLoader
              assetIds={assetIds}
              render={(photoResult) => {
                for (let i = 0; i !== assetIds.length; i += 1) {
                  data.tipsQuotes[i].fields.memberPhoto.fields = photoResult
                    .assets.items[assetIds[i]].fields;
                }
                return (
                  <div styleName="container">
                    {
                      tipsQuotes.map(tipQuote => (
                        <div key={tipQuote.fields.text} styleName="tip-quote">
                          <div
                            styleName="text"
                            dangerouslySetInnerHTML={
                              { __html: converter.makeHtml(tipQuote.fields.text) }
                            }
                          />
                          <div styleName="member">
                            <div styleName="member-photo">
                              <img
                                src={tipQuote.fields.memberPhoto.fields.file.url}
                                alt={tipQuote.fields.memberHandle}
                              />
                            </div>
                            <div styleName="member-info">
                              <a href={tipQuote.fields.memberProfileLink} target="_blank" rel="noopener noreferrer" styleName="member-handle">
                                { tipQuote.fields.memberHandle}
                              </a>
                              <div styleName="member-date">
                                {`Topcoder member since ${tipQuote.fields.memberSince}`}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                );
              }}
            />
          );
        }}
      />
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
