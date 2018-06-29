/**
 * Tutorials component. Renders 3 random tutorials with accompanying photos.
 *
 */
/* eslint-disable react/no-danger */
import React from 'react';
import PT from 'prop-types';
import { getItems } from 'utils/track-homepages';
import showdown from 'showdown';

import './styles.scss';

const converter = new showdown.Converter();

class Tutorials extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tutorials: getItems(props.numTutorials, props.data.tutorials),
    };
  }

  render() {
    const { tutorials } = this.state;
    return (
      <div styleName="container">
        {
          tutorials.map(tutorial => (
            <a href={tutorial.linkUrl} key={tutorial.title} styleName="tutorial">
              <img styleName="photo" src={tutorial.image.file.url} alt="Tutorial" />
              <div styleName="content">
                <div styleName="title">
                  {tutorial.title}
                </div>
                <div
                  styleName="text"
                  dangerouslySetInnerHTML={
                    { __html: converter.makeHtml(tutorial.shortDescription) }
                  }
                />
              </div>
            </a>
          ))
        }
      </div>
    );
  }
}

/* eslint-enable react/no-danger */
Tutorials.defaultProps = {
  numTutorials: 3,
};

Tutorials.propTypes = {
  numTutorials: PT.number,
  data: PT.shape().isRequired,
};

export default Tutorials;
