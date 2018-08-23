/**
 * Child component of Settings/Profile/ renders the
 * 'Community' page.
 */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable no-unneeded-ternary */
import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';
import UserConsentModal from 'components/Settings/UserConsentModal';
import Item from './Item';
import data from './data';

import './styles.scss';

const SAVE_DELAY = 1000;

class Community extends React.Component {
  constructor(props) {
    super(props);
    this.onShowUserConsent = this.onShowUserConsent.bind(this);
    this.state = {
      communityTrait: this.loadCommunityTrait(props.userTraits),
      showUserConsent: false,
      personalizationTrait: this.loadPersonalizationTrait(props.userTraits),
      newCommunity: null,
      communityChecked: false,
      isAdd: false,
    };

    this.loadCommunityTrait = this.loadCommunityTrait.bind(this);
    this.loadPersonalizationTrait = this.loadPersonalizationTrait.bind(this);
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
      newCommunity: null,
      communityChecked: false,
    });
    const communityTrait = this.loadCommunityTrait(nextProps.userTraits);
    const personalizationTrait = this.loadPersonalizationTrait(nextProps.userTraits);
    this.setState({ communityTrait, personalizationTrait });
  }

  /**
   * Show User Consent Modal
   * @param e event
   * @param item the community object
   * @param checked the check value
   */
  onShowUserConsent(e, item, checked) {
    e.preventDefault();
    this.setState({
      showUserConsent: true,
      newCommunity: item,
      communityChecked: checked,
    });
  }

  /**
   * Add or Update CommunityTrait
   */
  onProcessCommunities = _.debounce((answer) => {
    const {
      handle,
      tokenV3,
      updateUserTrait,
      addUserTrait,
    } = this.props;
    const { isAdd, communityTrait, personalizationTrait } = this.state;
    if (isAdd) {
      const newCommunities = [];
      newCommunities.push(communityTrait);
      addUserTrait(handle, 'communities', newCommunities, tokenV3);
    } else {
      const newCommunities = [];
      newCommunities.push(communityTrait);
      updateUserTrait(handle, 'communities', newCommunities, tokenV3);
    }
    // save personalization
    if (_.isEmpty(personalizationTrait)) {
      const personalizationData = { userConsent: answer };
      addUserTrait(handle, 'personalization', [personalizationData], tokenV3);
    } else {
      const trait = personalizationTrait.traits.data[0];
      if (trait.userConsent !== answer) {
        const personalizationData = { userConsent: answer };
        updateUserTrait(handle, 'personalization', [personalizationData], tokenV3);
      }
    }
  }, SAVE_DELAY);


  /**
   * Change toggle button check value
   * @param e form submit event
   * @param answer user consent answer value
   */
  onChange(e, answer) {
    this.setState({ showUserConsent: false });
    const { communityTrait, newCommunity, communityChecked } = this.state;
    communityTrait[newCommunity.id] = communityChecked;
    this.setState({
      communityTrait,
    }, () => this.onProcessCommunities(answer));
  }

  /**
   * Get personalization trait
   * @param userTraits the all user traits
   */
  loadPersonalizationTrait = (userTraits) => {
    const trait = userTraits.filter(t => t.traitId === 'personalization');
    const personalization = trait.length === 0 ? {} : trait[0];
    return _.assign({}, personalization);
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
    } : trait[0].traits.data[0];
    return _.assign({}, communities);
  }

  render() {
    const { settingsUI } = this.props;
    const { communityTrait, showUserConsent } = this.state;
    const tabs = settingsUI.TABS.PROFILE;
    const currentTab = settingsUI.currentProfileTab;
    const containerStyle = currentTab === tabs.COMMUNITY ? '' : 'hide';
    const communityItems = communityTrait;

    return (
      <div styleName={containerStyle}>
        {
          showUserConsent && (
            <UserConsentModal onSaveTrait={this.onChange} />
          )
        }
        <div styleName="community-container">
          <h1>
            Community
          </h1>
          <div styleName="sub-title">
            Your communities
          </div>
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
                    onToggle={event => this.onShowUserConsent(event, item, event.target.checked)}
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
