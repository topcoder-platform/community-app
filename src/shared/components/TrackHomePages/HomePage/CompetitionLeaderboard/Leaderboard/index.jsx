/**
 * TCO Leaderboard Component
 */
import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';
import { PrimaryButton } from 'topcoder-react-ui-kit';
import ContentfulLoader from 'containers/ContentfulLoader';

import './styles.scss';

class Leaderboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeIndex: 0,
    };
  }

  toggleActive(index) {
    this.setState({
      activeIndex: index,
    });
  }

  render() {
    const { data } = this.props;
    const { activeIndex: currentIndex } = this.state;
    const stage1Ids = _.map(data.stages[0].fields.champions, item => (item.sys.id));
    const stage2Ids = _.map(data.stages[1].fields.champions, item => (item.sys.id));
    const stage3Ids = _.map(data.stages[2].fields.champions, item => (item.sys.id));
    const stage4Ids = _.map(data.stages[3].fields.champions, item => (item.sys.id));
    const entryIds = stage1Ids.concat(stage2Ids, stage3Ids, stage4Ids);
    return (
      <ContentfulLoader
        entryIds={entryIds}
        render={(stageResult) => {
          const stage1 = _.filter(
            stageResult.entries.items,
            item => stage1Ids.includes(item.sys.id),
          );
          const stage2 = _.filter(
            stageResult.entries.items,
            item => stage2Ids.includes(item.sys.id),
          );
          const stage3 = _.filter(
            stageResult.entries.items,
            item => stage3Ids.includes(item.sys.id),
          );
          const stage4 = _.filter(
            stageResult.entries.items,
            item => stage4Ids.includes(item.sys.id),
          );
          const stage1PhotoIds = _.map(stage1, c => (c.fields.photo.sys.id));
          const stage2PhotoIds = _.map(stage2, c => (c.fields.photo.sys.id));
          const stage3PhotoIds = _.map(stage3, c => (c.fields.photo.sys.id));
          const stage4PhotoIds = _.map(stage4, c => (c.fields.photo.sys.id));
          const assetIds = stage1PhotoIds.concat(stage2PhotoIds, stage3PhotoIds, stage4PhotoIds);
          return (
            <ContentfulLoader
              assetIds={assetIds}
              render={(photoResult) => {
                for (let i = 0; i !== stage1PhotoIds.length; i += 1) {
                  const photos = _.filter(
                    photoResult.assets.items,
                    item => stage1PhotoIds.includes(item.sys.id),
                  );
                  for (let j = 0; j !== photos.length; j += 1) {
                    stage1[j].fields.photo.fields = photos[j].fields;
                  }
                }
                for (let i = 0; i !== stage2PhotoIds.length; i += 1) {
                  const photos = _.filter(
                    photoResult.assets.items,
                    item => stage2PhotoIds.includes(item.sys.id),
                  );
                  for (let j = 0; j !== photos.length; j += 1) {
                    stage2[j].fields.photo.fields = photos[j].fields;
                  }
                }
                for (let i = 0; i !== stage3PhotoIds.length; i += 1) {
                  const photos = _.filter(
                    photoResult.assets.items,
                    item => stage3PhotoIds.includes(item.sys.id),
                  );
                  for (let j = 0; j !== photos.length; j += 1) {
                    stage3[j].fields.photo.fields = photos[j].fields;
                  }
                }
                for (let i = 0; i !== stage4PhotoIds.length; i += 1) {
                  const photos = _.filter(
                    photoResult.assets.items,
                    item => stage4PhotoIds.includes(item.sys.id),
                  );
                  for (let j = 0; j !== photos.length; j += 1) {
                    stage4[j].fields.photo.fields = photos[j].fields;
                  }
                }

                data.stages[0].champions = stage1;
                data.stages[1].champions = stage2;
                data.stages[2].champions = stage3;
                data.stages[3].champions = stage4;
                return (
                  <div styleName="container">
                    <h1>
TCO Leaderboard
                    </h1>
                    <div styleName="button-bar">
                      {
                        _.map(data.stages, (stage, index) => (
                          <a
                            key={`stage${index}`}
                            onKeyPress={() => this.toggleActive(index)}
                            tabIndex={0}
                            role="button"
                            styleName={`button-stage ${index === currentIndex ? 'active' : ''}`}
                            onClick={() => this.toggleActive(index)}
                          >
                            { `Stage ${index + 1}`}
                          </a>
                        ))
                      }
                    </div>
                    {
                      _.map(data.stages, (stage, index) => (
                        <div styleName={`leaderboard ${index === currentIndex ? 'active' : ''}`} key={`stage${index}`}>
                          <div styleName="title">
                            { `Top 3 ${data.stageTitle} in Stage ${index + 1}`}
                          </div>
                          <div styleName="champions">
                            {
                              _.map(stage.champions, (champion, num) => {
                                let color = '';
                                switch (num) {
                                  case 0:
                                    color = 'gold';
                                    break;
                                  case 1:
                                    color = 'silver';
                                    break;
                                  case 2:
                                    color = 'bronze';
                                    break;
                                  default:
                                    break;
                                }
                                return (
                                  <div styleName="champion" key={champion.fields.handle}>
                                    <div styleName="photo">
                                      <span styleName={`metal ${color}`}>
                                        {num + 1}
                                      </span>
                                      <img
                                        src={champion.fields.photo.fields.file.url}
                                        alt={champion.fields.handle}
                                      />
                                    </div>
                                    <div styleName="info">
                                      <div styleName="handle">
                                        { champion.fields.handle}
                                      </div>
                                      <div styleName="stats">
                                        { `${champion.fields.challenges} challenges / ${champion.fields.points} pts`}
                                      </div>
                                    </div>
                                  </div>
                                );
                              })
                            }
                          </div>
                        </div>
                      ))
                    }
                    <div styleName="button-wrapper-learn-more">
                      <PrimaryButton to={data.tcoLink} openNewTab>
Learn More about TCO
                      </PrimaryButton>
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

Leaderboard.propTypes = {
  data: PT.shape().isRequired,
};

export default Leaderboard;
