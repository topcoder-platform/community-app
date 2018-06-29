/**
 * TCO Leaderboard Component
 */
import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';
import { PrimaryButton } from 'topcoder-react-ui-kit';

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
                        <div styleName="champion" key={champion.handle}>
                          <div styleName="photo">
                            <span styleName={`metal ${color}`}>
                              {num + 1}
                            </span>
                            <img src={champion.photo.file.url} alt={champion.handle} />
                          </div>
                          <div styleName="info">
                            <div styleName="handle">
                              { champion.handle}
                            </div>
                            <div styleName="stats">
                              { `${champion.challenges} challenges / ${champion.points} pts`}
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
  }
}

Leaderboard.propTypes = {
  data: PT.shape().isRequired,
};

export default Leaderboard;
