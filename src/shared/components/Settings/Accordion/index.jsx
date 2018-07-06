/**
 * Accordion component
 *
 * Used to render the mobile view for the Settings pages.
 */
import React from 'react';
import PT from 'prop-types';

import ArrowDown from 'assets/images/arrow-down.svg';

import './styles.scss';

export default class Accordion extends React.Component {
  constructor(props) {
    super(props);

    this.isOpened = this.isOpened.bind(this);
    this.toggleItem = this.toggleItem.bind(this);

    this.state = {
      /*
       * hasToggled makes sure that the initial state for the Accordion
       * is completely closed. It will sync with the sidebar only after
       * the user has clicked the Accordion.
       */
      hasToggled: false,
      /*
       * the current Accordion item is different from this.props.currentSidebarTab
       * as it can be undefined, when the Accordion is completely closed.
       */
      currentItem: undefined,
    };
  }

  /*
   * Sync the state of the Accordion with the state of the Sidebar
   */
  componentWillReceiveProps(nextProps) {
    const {
      hasToggled,
      currentItem,
    } = this.state;
    const { currentSidebarTab } = nextProps;
    if (hasToggled && currentItem !== currentSidebarTab) {
      this.setState({ currentItem: currentSidebarTab });
    }
  }

  /*
   * Returns whether a tab is opened or closed.
   */
  isOpened(tab) {
    const { currentItem } = this.state;
    return currentItem === tab;
  }

  toggleItem(tab) {
    const { hasToggled, currentItem } = this.state;
    const { toggleSidebarTab } = this.props;
    // update hasToggled so the Accordion can be sync with the Sidebar
    if (!hasToggled) {
      this.setState({ hasToggled: true });
    }

    if (currentItem === tab) {
      // closing the current tab
      this.setState({ currentItem: undefined });
    } else {
      // opening a new tab, both on the Accordion and the Sidebar
      this.setState({ currentItem: tab });
      toggleSidebarTab(tab);
    }
  }

  render() {
    const {
      icons,
      names,
      renderTabContent,
    } = this.props;

    /*
     * Simple rendering function used to add the props (width & height)
     * only once instead of having to add them on each element
     */
    const renderSvgIcon = (svgIcon) => {
      const componentProps = {
        width: '30px',
        height: '26px',
      };
      return React.cloneElement(svgIcon, componentProps);
    };

    return (
      <div styleName="Accordion">
        {
          names.map((name, index) => (
            <div key={name}>
              <div
                role="menuitem"
                tabIndex={index}
                styleName="header"
                onClick={() => this.toggleItem(name)}
                onKeyPress={() => this.toggleItem(name)}
              >
                <span styleName="icon-container">
                  {renderSvgIcon(icons[name])}
                </span>
                <p styleName="name">
                  {name}
                </p>
                <span styleName="arrow-container">
                  <ArrowDown width="15px" height="15px" transform={`${this.isOpened(name) ? 'rotate(180)' : ''}`} />
                </span>
              </div>
              {
                this.isOpened(name) ? (
                  <div>
                    {renderTabContent(name)}
                  </div>
                ) : null
              }
            </div>
          ))
        }
      </div>
    );
  }
}

Accordion.propTypes = {
  currentSidebarTab: PT.string.isRequired,
  icons: PT.shape().isRequired,
  names: PT.arrayOf(PT.string).isRequired,
  renderTabContent: PT.func.isRequired,
  toggleSidebarTab: PT.func.isRequired,
};
