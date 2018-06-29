/**
 Step By Step  Component
 */
/* eslint-disable react/no-danger */
import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';
import showdown from 'showdown';
import Sticky from 'react-stickynode';
import ContentfulLoader from 'containers/ContentfulLoader';
import StepButton from './StepButton';


import './styles.scss';

const converter = new showdown.Converter();

class StepByStep extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: -1,
    };
  }
  toggleActive(index) {
    this.setState({
      activeIndex: index,
    });
  }
  render() {
    const { data } = this.props;
    const steps = data.Steps;
    const currentIndex = this.state.activeIndex;
    const iconIds = _.map(steps, item => (item.fields.icon.sys.id));
    return (
      <ContentfulLoader
        assetIds={iconIds}
        render={(result) => {
          for (let i = 0; i !== iconIds.length; i += 1) {
            steps[i].fields.icon.fields = result.assets.items[iconIds[i]].fields;
          }
          return (
            <div styleName="container">
              <div styleName="button-menu">
                <Sticky top={20} bottomBoundary="#steps">
                  {
                    steps.map((menu, index) => {
                      const isActive = currentIndex === index;
                      return (
                        <StepButton
                          menu={menu.fields}
                          key={menu.fields.title}
                          active={isActive}
                          onClick={() => this.toggleActive(index)}
                        />
                      );
                    })
                  }
                </Sticky>
              </div>
              <div styleName="steps">
                {
                  steps.map((menu, index) => (
                    <div styleName="step" key={menu.fields.title} id={menu.fields.title}>
                      <div styleName="big-icon">
                        <img src={menu.fields.icon.fields.file.url} alt={menu.fields.title} />
                      </div>
                      <div styleName="content">
                        <div styleName="title">
                          {index + 1}. { menu.fields.title}
                        </div>
                        <div
                          styleName="text"
                          dangerouslySetInnerHTML={
                            { __html: converter.makeHtml(menu.fields.text) }
                          }
                        />
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
          );
        }}
      />
    );
  }
}


StepByStep.propTypes = {
  data: PT.shape().isRequired,
};

export default StepByStep;
