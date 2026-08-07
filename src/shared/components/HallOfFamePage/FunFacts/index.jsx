/**
 * Fun Facts component.  Renders 3 random fun facts with accompanying photos.
 * Implements a carousel for mobile version, with very basic gesture support.
 */
import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';
import { getStories } from 'utils/hall-of-fame';
import showdown from 'showdown';
import ContentfulLoader from 'containers/ContentfulLoader';

import './styles.scss';

const converter = new showdown.Converter();

// The HTML is from Contentful and is not dangerous.  It is
// also required for the flexible dynamic styling needed for Fun Facts.
/* eslint-disable react/no-danger */

class FunFacts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      facts: getStories(props.numFacts, props.data.list),
      activeMobileFact: 0,
    };
    this.startX = 0;
  }

  handleTouchEnd() {
    const {
      numFacts,
    } = this.props;
    const {
      activeMobileFact,
    } = this.state;
    if (Math.abs(this.startX - this.endX) > 50) {
      const direction = this.endX > this.startX ? -1 : 1;
      let nextFactIndex = activeMobileFact + direction;
      if (nextFactIndex >= numFacts) {
        nextFactIndex = 0;
      } else if (nextFactIndex < 0) {
        nextFactIndex = numFacts - 1;
      }
      this.setState({ activeMobileFact: nextFactIndex });
    }
  }

  render() {
    const { data } = this.props;
    const { activeMobileFact, facts } = this.state;
    const storyIds = _.map(data.list, item => (item.sys.id));
    return (
      <ContentfulLoader
        entryIds={storyIds}
        render={(result) => {
          for (let i = 0; i !== storyIds.length; i += 1) {
            data.list[i].fields = result.entries.items[storyIds[i]].fields;
          }
          // process image
          const imageIds = [];
          data.list.forEach((item) => {
            const id = _.get(item, 'fields.image.sys.id');
            if (id) imageIds.push(id);
          });
          return (
            <ContentfulLoader
              assetIds={imageIds}
              render={(imageResult) => {
                for (let i = 0; i !== imageIds.length; i += 1) {
                  data.list[i].fields.image.fields = imageResult.assets.items[imageIds[i]].fields;
                }
                return (
                  <div
                    onTouchStart={(e) => {
                      this.startX = e.touches[0].pageX;
                      this.endX = this.startX;
                    }}
                    onTouchMove={(e) => { this.endX = e.touches[0].pageX; }}
                    onTouchEnd={() => this.handleTouchEnd()}
                    styleName="container"
                  >
                    {
                      facts.map((fact, index) => (
                        <div
                          key={fact.fields.text}
                          styleName={`fact ${index === activeMobileFact ? 'mobile-active' : ''}`}
                        >
                          <img styleName="photo" src={_.get(fact, 'fields.image.fields.file.url')} alt="Fun Fact" />
                          <div
                            styleName="text"
                            dangerouslySetInnerHTML={{
                              __html: converter.makeHtml(fact.fields.text),
                            }}
                          />
                        </div>
                      ))
                    }
                    <div styleName="mobile-buttons">
                      {
                        facts.map((fact, index) => (
                          <span
                            key={`${fact.fields.text} button`}
                            onClick={() => this.setState({ activeMobileFact: index })}
                            onKeyPress={() => this.setState({ activeMobileFact: index })}
                            role="button"
                            styleName={`mobile-button ${index === activeMobileFact ? 'mobile-active' : ''}`}
                            tabIndex="0"
                          />
                        ))
                      }
                    </div>
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

/* eslint-enable react/no-danger */

FunFacts.defaultProps = {
  numFacts: 3,
};

FunFacts.propTypes = {
  numFacts: PT.number,
  data: PT.shape().isRequired,
};

export default FunFacts;
