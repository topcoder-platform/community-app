/**
 * Tutorials component. Renders 3 random tutorials with accompanying photos.
 *
 */
/* eslint-disable react/no-danger */
import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';
import { getItems } from 'utils/track-homepages';
import showdown from 'showdown';
import ContentfulLoader from 'containers/ContentfulLoader';

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
    const { data } = this.props;
    const { tutorials } = this.state;
    const entryIds = _.map(data.tutorials, item => (item.sys.id));
    return (
      <ContentfulLoader
        entryIds={entryIds}
        render={(result) => {
          for (let i = 0; i !== entryIds.length; i += 1) {
            data.tutorials[i].fields = result.entries.items[entryIds[i]].fields;
          }
          const assetIds = _.map(data.tutorials, item => (item.fields.image.sys.id));
          return (
            <ContentfulLoader
              assetIds={assetIds}
              render={(imageResult) => {
                for (let i = 0; i !== assetIds.length; i += 1) {
                  data.tutorials[i].fields.image.fields = imageResult
                    .assets.items[assetIds[i]].fields;
                }
                return (
                  <div styleName="container">
                    {
                      tutorials.map(tutorial => (
                        <a href={tutorial.fields.linkUrl} key={tutorial.fields.title} styleName="tutorial">
                          <img styleName="photo" src={tutorial.fields.image.fields.file.url} alt="Tutorial" />
                          <div styleName="content">
                            <div styleName="title">
                              {tutorial.fields.title}
                            </div>
                            <div
                              styleName="text"
                              dangerouslySetInnerHTML={
                                { __html: converter.makeHtml(tutorial.fields.shortDescription) }
                              }
                            />
                          </div>
                        </a>
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

/* eslint-enable react/no-danger */
Tutorials.defaultProps = {
  numTutorials: 3,
};

Tutorials.propTypes = {
  numTutorials: PT.number,
  data: PT.shape().isRequired,
};

export default Tutorials;
