/**
 * Child component of Settings/Profile/ renders the
 * 'Community' page.
 */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable no-unneeded-ternary */
import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';

import Item from './Item';
import data from './data';

import './styles.scss';

const SAVE_DELAY = 1000;

class Community extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      communityTrait: this.loadCommunityTrait(props.userTraits),
      isAdd: false,
    };

    this.loadCommunityTrait = this.loadCommunityTrait.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    const { userTraits } = this.props;
    const trait = userTraits.filter(t => t.traitId === 'communities');
    this.setState({
      isAdd: trait.length === 0 ? true : false,
    });
  }

  componentWillReceiveProps(nextProps) {
    const { userTraits } = nextProps;
    const trait = userTraits.filter(t => t.traitId === 'communities');
    this.setState({
      isAdd: trait.length === 0 ? true : false,
    });
    const communityTrait = this.loadCommunityTrait(nextProps.userTraits);
    this.setState({ communityTrait });
  }

  /**
   * Add or Update CommunityTrait
   */
  onProcessCommunities = _.debounce(() => {
    const {
      handle,
      tokenV3,
      updateUserTrait,
      addUserTrait,
    } = this.props;
    const { isAdd, communityTrait } = this.state;
    if (isAdd) {
      const newCommunities = [];
      newCommunities.push(communityTrait);
      addUserTrait(handle, 'communities', newCommunities, tokenV3);
    } else {
      const newCommunities = [];
      newCommunities.push(communityTrait);
      updateUserTrait(handle, 'communities', newCommunities, tokenV3);
    }
  }, SAVE_DELAY);


  /**
   * Change toggle button check value
   * @param item community object
   * @param checked check value
   */
  onChange(item, checked) {
    const { communityTrait } = this.state;
    communityTrait[item.id] = checked;
    this.setState({
      communityTrait,
    }, () => this.onProcessCommunities(item.programID));
  }


  /**
   * Get community trait
   * @param userTraits the all user traits
   */
  loadCommunityTrait = (userTraits) => {
    const trait = userTraits.filter(t => t.traitId === 'communities');
    const communities = trait.length === 0 ? {
      cognitive: false,
      blockchain: false,
      ios: false,
      predix: false,
    } : trait[0].traits.data[0];
    return _.assign({}, communities);
  }

  render() {
    const { settingsUI } = this.props;
    const { communityTrait } = this.state;
    const tabs = settingsUI.TABS.PROFILE;
    const currentTab = settingsUI.currentProfileTab;
    const containerStyle = currentTab === tabs.COMMUNITY ? '' : 'hide';
    const communityItems = communityTrait;

    return (
      <div styleName={containerStyle}>
        <div styleName="community-container">
          <h1>
            Community
          </h1>
          <div styleName="list">
            {
              _.map(data, (item) => {
                const checked = communityItems[item.id] || false;
                return (
                  <Item
                    icon={item.icon}
                    key={item.id}
                    id={item.id}
                    value={item.id}
                    checked={checked}
                    title={item.name}
                    programID={item.programID}
                    description={item.description}
                    onToggle={event => this.onChange(item, event.target.checked)}
                  />
                );
              })
            }
          </div>
        </div>
      </div>
    );
  }
}

Community.propTypes = {
  tokenV3: PT.string.isRequired,
  handle: PT.string.isRequired,
  userTraits: PT.array.isRequired,
  updateUserTrait: PT.func.isRequired,
  addUserTrait: PT.func.isRequired,
  settingsUI: PT.shape().isRequired,
};

export default Community;
