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

export const TAB_THEMES = {
  Default: defaultTheme,
  Zurich: zurichTheme,
  'Tabs Group': tabsGroup,
  'Tabs Group Children': tabsGroupChildren,
  Underline: underlineTheme,
  'Underline dark': underlineDarkTheme,
  Vertical: verticalTheme,
  Pills: pillsTheme,
};

export default class TabsItemsLoader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabIndex: props.selected || 0,
    };

    this.updatePageUrl.bind(this);
  }

  componentDidMount() {
    const q = getQuery();
    const { tabId } = this.props;
    const { tabIndex } = this.state;
    if (q.tabs && q.tabs[tabId] && Number(q.tabs[tabId]) !== tabIndex) {
      this.setState({ tabIndex: Number(q.tabs[tabId]) });
    } else {
      this.updatePageUrl();
    }
  }

  componentDidUpdate() {
    this.updatePageUrl();
  }

  updatePageUrl() {
    const q = getQuery();
    const { tabId } = this.props;
    const { tabIndex } = this.state;
    updateQuery({
      tabs: {
        ...q.tabs,
        [tabId]: tabIndex || 0,
      },
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
    } = this.props;
    const { tabIndex } = this.state;

    return (
      <ContentfulLoader
        entryIds={ids}
        preview={preview}
        spaceName={spaceName}
        environment={environment}
        render={data => (
          <Tabs
            className={theme.container}
            selectedIndex={tabIndex}
            selectedTabClassName={theme.selected}
            onSelect={tIndx => this.setState({ tabIndex: tIndx })}
            forceRenderTabPanel
          >
            <div className={theme.tabListWrap}>
              <TabList className={theme.tablist}>
                {
                  _.map(data.entries.items, tabItem => (
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
              _.map(data.entries.items, tabItem => (
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
        )}
        renderPlaceholder={LoadingIndicator}
      />
    );
  }
}

TabsItemsLoader.defaultProps = {
  selected: 0,
  spaceName: null,
  environment: null,
};

TabsItemsLoader.propTypes = {
  ids: PT.arrayOf(PT.string).isRequired,
  preview: PT.bool.isRequired,
  spaceName: PT.string,
  environment: PT.string,
  selected: PT.number,
  theme: PT.shape().isRequired,
  tabId: PT.string.isRequired,
};
