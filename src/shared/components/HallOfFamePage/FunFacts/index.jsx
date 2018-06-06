/**
 * Fun Facts component.  Renders 3 random fun facts with accompanying photos.
 * Implements a carousel for mobile version, with very basic gesture support.
 */
import React from 'react';
import PT from 'prop-types';
import { getStories } from 'utils/hall-of-fame';
import showdown from 'showdown';

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
    if (Math.abs(this.startX - this.endX) > 50) {
      const direction = this.endX > this.startX ? -1 : 1;
      let nextFactIndex = this.state.activeMobileFact + direction;
      if (nextFactIndex >= this.props.numFacts) {
        nextFactIndex = 0;
      } else if (nextFactIndex < 0) {
        nextFactIndex = this.props.numFacts - 1;
      }
      this.setState({ activeMobileFact: nextFactIndex });
    }
  }

  render() {
    return (
      <div
        onTouchStart={(e) => { this.startX = e.touches[0].pageX; this.endX = this.startX; }}
        onTouchMove={(e) => { this.endX = e.touches[0].pageX; }}
        onTouchEnd={() => this.handleTouchEnd()}
        styleName="container"
      >
        {
          this.state.facts.map((fact, index) => (
            <div
              key={fact.text}
              styleName={`fact ${index === this.state.activeMobileFact ? 'mobile-active' : ''}`}
            >
              <img styleName="photo" src={fact.image.file.url} alt="Fun Fact" />
              <div
                styleName="text"
                dangerouslySetInnerHTML={{ __html: converter.makeHtml(fact.text) }}
              />
            </div>
          ))
        }
        <div styleName="mobile-buttons">
          {
            this.state.facts.map((fact, index) => (
              <span
                key={`${fact.text} button`}
                onClick={() => this.setState({ activeMobileFact: index })}
                onKeyPress={() => this.setState({ activeMobileFact: index })}
                role="button"
                styleName={`mobile-button ${index === this.state.activeMobileFact ? 'mobile-active' : ''}`}
                tabIndex="0"
              />
            ))
          }
        </div>
      </div>
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
