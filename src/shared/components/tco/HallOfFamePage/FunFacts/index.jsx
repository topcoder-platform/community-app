/**
 * Fun Facts component.  Renders 3 random fun facts with accompanying photos.
 */
import React from 'react';
import PT from 'prop-types';
import { getFunFacts } from 'utils/hall-of-fame';

import './styles.scss';

// The HTML is from a trusted local source and is not dangerous.  It is
// also required for the flexible dynamic styling needed for Fun Facts.
/* eslint-disable react/no-danger */

class FunFacts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      facts: getFunFacts(props.numFacts),
    };
  }

  render() {
    return (
      <div styleName="container">
        {
          this.state.facts.map(fact => (
            <div styleName="fact" key={fact.fact}>
              <img styleName="photo" src={fact.photo} alt="Fun Fact" />
              <div
                styleName="text"
                dangerouslySetInnerHTML={{ __html: fact.fact }}
              />
            </div>
          ))
        }
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
};

export default FunFacts;
