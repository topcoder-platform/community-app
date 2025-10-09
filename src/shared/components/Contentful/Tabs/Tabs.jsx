/**
 * Renders Tabs
 */
import _ from 'lodash';
import ContentfulLoader from 'containers/ContentfulLoader';
import LoadingIndicator from 'components/LoadingIndicator';
import MarkdownRenderer from 'components/MarkdownRenderer';
import { AppComponentSwitch } from 'components/Contentful/AppComponent';
import ContentBlockLoader from 'components/Contentful/ContentBlock';
import Viewport from 'components/Contentful/Viewport';
import PT from 'prop-types';
import React, { Component } from 'react';
import {
  Tabs,
  TabList,
  Tab,
  TabPanel,
} from 'react-tabs';
import { fixStyle } from 'utils/contentful';
import { getQuery, updateQuery } from 'utils/url';
import defaultTheme from './themes/style.scss';
import zurichTheme from './themes/zurich.scss';
import tabsGroup from './themes/tabsGroup.scss';
import tabsGroupChildren from './themes/tabsGroupChildren.scss';
import underlineTheme from './themes/underline.scss';
import underlineDarkTheme from './themes/underline-dark.scss';
import verticalTheme from './themes/vertical.scss';
import pillsTheme from './themes/pills.scss';
import underlineBoxTheme from './themes/underline-box.scss';
import bracketsTheme from './themes/brackets.scss';

export const TAB_THEMES = {
  Default: defaultTheme,
  Zurich: zurichTheme,
  'Tabs Group': tabsGroup,
  'Tabs Group Children': tabsGroupChildren,
  Underline: underlineTheme,
  'Underline dark': underlineDarkTheme,
  Vertical: verticalTheme,
  Pills: pillsTheme,
  'Underline box': underlineBoxTheme,
  Brackets: bracketsTheme,
};

export default class TabsItemsLoader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabIndex: props.selected || 0,
      mobileTabsShow: false,
    };

    this.updatePageUrl.bind(this);
  }

  componentDidMount() {
    const q = getQuery();
    const { tabId } = this.props;
    const { tabIndex } = this.state;
    if (q.tracks && q.tracks[tabId] && Number(q.tracks[tabId]) !== tabIndex) {
      this.setState({ tabIndex: Number(q.tracks[tabId]) });
    }
  }

  componentDidUpdate() {
    this.updatePageUrl();
  }

  updatePageUrl() {
    this.setState((state) => {
      const q = getQuery();
      const { tabId } = this.props;
      const { tabIndex } = state;
      updateQuery({
        tabs: {
          ...q.tracks,
          [tabId]: tabIndex || 0,
        },
      });
    });
  }

  render() {
    const {
      ids,
      preview,
      spaceName,
      environment,
      theme,
      tabId,
      themeName,
      forceRenderTabPanel,
    } = this.props;
    const { tabIndex, mobileTabsShow } = this.state;

    // Helper to hide deprecated/unsupported statistics options
    const shouldHideTab = (label) => {
      if (!label) return false;
      const t = String(label).toLowerCase();
      return (
        t.includes('wireframe')
        || t.includes(' lux') || t.startsWith('lux') || t.includes('lux ')
        || t.includes(' rux') || t.startsWith('rux') || t.includes('rux ')
      );
    };

    return (
      <ContentfulLoader
        entryIds={ids}
        preview={preview}
        spaceName={spaceName}
        environment={environment}
        render={(data) => {
          // Convert to array to safely filter/map in a stable order
          const allTabItems = _.toArray(data.entries.items);
          const tabItems = allTabItems.filter(ti => !shouldHideTab(_.get(ti, 'fields.tab', '')));
          // Ensure selected index is within bounds after filtering
          const safeTabIndex = Math.min(tabIndex, Math.max(0, tabItems.length - 1));

          if (!tabItems.length) return null;

          return (
            <Tabs
            className={theme.container}
            selectedIndex={safeTabIndex}
            selectedTabClassName={theme.selected}
            onSelect={(tIndx) => this.setState({ tabIndex: tIndx, mobileTabsShow: false })}
            forceRenderTabPanel={forceRenderTabPanel}
          >
            <div className={theme.tabListWrap}>
              {
                themeName === 'Underline box' ? (
                  <button type="button" className={theme.tabListMobileTrigger} onClick={() => this.setState({ mobileTabsShow: !mobileTabsShow })}>
                    {
                      tabItems[safeTabIndex] && (
                        <MarkdownRenderer
                          markdown={tabItems[safeTabIndex].fields.tab}
                        />
                      )
                    }
                    <svg className={mobileTabsShow ? theme.tabListMobileTriggerSVGOpen : theme.tabListMobileTriggerSVG} width="16px" height="10px" viewBox="0 0 16 10" version="1.1" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <polygon id="path-1" points="7.7 9.2 0 1.5 1.4 0 7.7 6.3 14 0 15.4 1.5" />
                      </defs>
                      <g id="Mobile" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                        <g id="01" transform="translate(-228.000000, -315.000000)">
                          <g id="Group-6" transform="translate(16.000000, 289.000000)">
                            <g id="Group-4" transform="translate(126.000000, 21.000000)">
                              <g id="icons/arrow/minimal-down" transform="translate(86.300000, 5.400000)">
                                <mask id="mask-2" fill="white">
                                  <use xlinkHref="#path-1" />
                                </mask>
                                <use id="icon-color" fill="#2A2A2A" xlinkHref="#path-1" />
                              </g>
                            </g>
                          </g>
                        </g>
                      </g>
                    </svg>
                  </button>
                ) : null
              }
              <TabList className={[theme.tablist, mobileTabsShow ? theme.visible : null]}>
                {
                  _.map(tabItems, tabItem => (
                    <Tab
                      className={theme.tab}
                      style={fixStyle(tabItem.fields.extraStyles)}
                      key={tabItem.sys.id}
                    >
                      <MarkdownRenderer markdown={tabItem.fields.tab} />
                    </Tab>
                  ))
                }
              </TabList>
            </div>
            {
              _.map(tabItems, tabItem => (
                <TabPanel
                  className={theme.tabpannel}
                  key={tabItem.sys.id}
                  selectedClassName={theme.selectedTabPanel}
                >
                  {
                    tabItem.fields.panelDescription ? (
                      <div className={theme.panelDescription}>
                        <MarkdownRenderer markdown={tabItem.fields.panelDescription} />
                      </div>
                    ) : null
                  }
                  {
                    _.map(tabItem.fields.panel, panelItemLink => (
                      <ContentfulLoader
                        entryIds={panelItemLink.sys.id}
                        preview={preview}
                        spaceName={spaceName}
                        environment={environment}
                        render={(panelItem) => {
                          const { id } = panelItemLink.sys;
                          const entryType = panelItem.entries.items[id].sys.contentType.sys.id;
                          if (entryType === 'appComponent') {
                            return AppComponentSwitch(panelItem.entries.items[id]);
                          }
                          if (entryType === 'contentBlock') {
                            return (
                              <ContentBlockLoader
                                id={id}
                                preview={preview}
                                spaceName={spaceName}
                                environment={environment}
                              />
                            );
                          }
                          if (entryType === 'tabs') {
                            const { fields } = panelItem.entries.items[id];
                            return (
                              <TabsItemsLoader
                                ids={_.map(fields.tabsList, 'sys.id')}
                                preview={preview}
                                spaceName={spaceName}
                                environment={environment}
                                selected={fields.selected}
                                theme={TAB_THEMES[fields.theme || 'Default']}
                                tabId={tabId}
                              />
                            );
                          }

                          if (entryType === 'viewport') {
                            return (
                              <Viewport
                                id={id}
                                preview={preview}
                                spaceName={spaceName}
                                environment={environment}
                              />
                            );
                          }
                          return null;
                        }}
                        key={tabItem.sys.id}
                      />
                    ))
                  }
                </TabPanel>
              ))
            }
          </Tabs>
          );
        }}
        renderPlaceholder={LoadingIndicator}
      />
    );
  }
}

TabsItemsLoader.defaultProps = {
  selected: 0,
  spaceName: null,
  environment: null,
  forceRenderTabPanel: true,
};

TabsItemsLoader.propTypes = {
  ids: PT.arrayOf(PT.string).isRequired,
  preview: PT.bool.isRequired,
  spaceName: PT.string,
  environment: PT.string,
  selected: PT.number,
  theme: PT.shape().isRequired,
  tabId: PT.string.isRequired,
  themeName: PT.string.isRequired,
  forceRenderTabPanel: PT.bool,
};
