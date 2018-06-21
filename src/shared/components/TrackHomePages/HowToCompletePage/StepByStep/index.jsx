/**
 Step By Step  Component
 */
/* eslint-disable react/no-danger */
import React from 'react';
import PT from 'prop-types';
import showdown from 'showdown';
import Sticky from 'react-stickynode';

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

    return (
      <div styleName="container">
        <div styleName="button-menu">
          <Sticky top={20} bottomBoundary="#steps">
            {
              steps.map((menu, index) => {
                const isActive = currentIndex === index;
                return (
                  <StepButton
                    menu={menu}
                    key={menu.title}
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
              <div styleName="step" key={menu.title} id={menu.title}>
                <div styleName="big-icon">
                  <img src={menu.icon.file.url} alt={menu.title} />
                </div>
                <div styleName="content">
                  <div styleName="title">
                    {index + 1}. { menu.title}
                  </div>
                  <div
                    styleName="text"
                    dangerouslySetInnerHTML={
                      { __html: converter.makeHtml(menu.text) }
                    }
                  />
                </div>
              </div>
            ))
          }
        </div>
      </div>
    );
  }
}


StepByStep.propTypes = {
  data: PT.shape().isRequired,
};

export default StepByStep;
