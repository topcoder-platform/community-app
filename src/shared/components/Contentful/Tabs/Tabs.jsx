/**
 * Renders Tabs
 */
import _ from 'lodash';
import ContentfulLoader from 'containers/ContentfulLoader';
import LoadingIndicator from 'components/LoadingIndicator';
import MarkdownRenderer from 'components/MarkdownRenderer';
import Viewport from 'components/Contentful/Viewport';
import PT from 'prop-types';
import React, { Component } from 'react';
import {
  Tabs,
  TabList,
  Tab,
  TabPanel,
} from 'react-tabs';

export default class TabsItemsLoader extends Component {
  constructor(props) {
    super(props);
    this.state = { tabIndex: props.selected };
  }

  render() {
    const {
      ids,
      preview,
      theme,
    } = this.props;
    const { tabIndex } = this.state;

    return (
      <ContentfulLoader
        entryIds={ids}
        preview={preview}
        render={data => (
          <Tabs
            className={theme.container}
            selectedIndex={tabIndex}
            selectedTabClassName={theme.selected}
            onSelect={tIndx => this.setState({ tabIndex: tIndx })}
            forceRenderTabPanel
          >
            <TabList className={theme.tablist}>
              {
                _.map(data.entries.items, tabItem => (
                  <Tab
                    className={theme.tab}
                    key={tabItem.sys.id}
                  >
                    <MarkdownRenderer markdown={tabItem.fields.tab} />
                  </Tab>
                ))
              }
            </TabList>
            {
              _.map(data.entries.items, tabItem => (
                <TabPanel
                  className={theme.tabpannel}
                  key={tabItem.sys.id}
                  selectedClassName={theme.selectedTabPanel}
                >
                  <Viewport id={tabItem.fields.panel.sys.id} />
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
};

TabsItemsLoader.propTypes = {
  ids: PT.arrayOf(PT.string).isRequired,
  preview: PT.bool.isRequired,
  selected: PT.number,
  theme: PT.shape().isRequired,
};
