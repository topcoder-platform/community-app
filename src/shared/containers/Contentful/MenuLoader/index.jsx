/**
 * MenuLoaderContainer
 * Load resursively a complete navi menu from Contentful
 * and delegates to custom navi component
 */

import _ from 'lodash';
import LoadingIndicator from 'components/LoadingIndicator';
import PT from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import Logo from 'assets/images/tc-logo.svg';
import { isomorphy, config } from 'topcoder-react-utils';
import actions from 'actions/contentful';


class MenuLoaderContainer extends React.Component {
  constructor(props) {
    super(props);

    // initial state
    this.state = {
      path: isomorphy.isClientSide() ? window.location.pathname : '',
    };
    // bind
    this.handleChangeOpenMore = this.handleChangeOpenMore.bind(this);
    this.handleChangeLevel1Id = this.handleChangeLevel1Id.bind(this);
    this.handleCloseOpenMore = this.handleCloseOpenMore.bind(this);
    this.handleSwitchMenu = this.handleSwitchMenu.bind(this);
  }

  componentDidMount() {
    const {
      id,
      loadMenuData,
      fields,
      preview,
      spaceName,
      environment,
      baseUrl,
      menu,
    } = this.props;
    if (!menu.length) {
      // initiate loading the menu data
      loadMenuData({
        id,
        fields,
        preview,
        spaceName,
        environment,
        baseUrl,
      });
    }
  }

  handleChangeLevel1Id(menuId) {
    this.setState({ activeLevel1Id: menuId });
  }

  handleChangeOpenMore(changedOpenMore) {
    this.setState({ openMore: changedOpenMore });
  }

  handleSwitchMenu() {
    this.setState({ activeLevel1Id: null });
  }

  handleCloseOpenMore() {
    this.setState({ openMore: false });
  }

  render() {
    const {
      menu, auth, loading, menuLogo, fields,
    } = this.props;
    const { openMore, path, activeLevel1Id } = this.state;
    if (loading) {
      return <LoadingIndicator />;
    }
    if (isomorphy.isClientSide()) {
      const logoToUse = !_.isEmpty(menuLogo) ? <img src={menuLogo.fields.file.url} alt="menu logo" /> : <Logo />;
      const menuTheme = fields.theme.split('- ');
      let normalizedProfile = auth.profile && _.clone(auth.profile);
      if (auth.profile) {
        normalizedProfile.photoURL = (_.has(auth.profile, 'photoURL') && auth.profile.photoURL !== null)
          ? `${config.CDN.PUBLIC}/avatar/${encodeURIComponent(auth.profile.photoURL)}?size=32` : '';
      } else {
        normalizedProfile = null;
      }
      if (fields.theme.indexOf('TCO22') !== -1) {
        // eslint-disable-next-line global-require
        const { TopNav: TopNavTCO, LoginNav: LoginNavTCO } = require('navigation-component-tco');
        return (
          <TopNavTCO
            menu={menu}
            rightMenu={(
              <LoginNavTCO
                loggedIn={!_.isEmpty(auth.profile)}
                notificationButtonState="none"
                notifications={[]}
                accountMenu={config.ACCOUNT_MENU}
                switchText={config.ACCOUNT_MENU_SWITCH_TEXT}
                onSwitch={this.handleSwitchMenu}
                onMenuOpen={this.handleCloseOpenMore}
                profile={normalizedProfile}
                auth={auth}
                authURLs={config.HEADER_AUTH_URLS}
              />
            )}
            logo={logoToUse}
            theme={menuTheme[1]}
            currentLevel1Id={activeLevel1Id}
            onChangeLevel1Id={this.handleChangeLevel1Id}
            path={path}
            openMore={openMore}
            setOpenMore={this.handleChangeOpenMore}
            loggedIn={!_.isEmpty(auth.profile)}
            profileHandle={auth.profile ? auth.profile.handle : ''}
            logoLink={fields.logoLink}
            backToTcUrl={fields.backToTcUrl}
            backToTcUrlText={fields.backToTcUrlText}
          />
        );
      }
      // eslint-disable-next-line global-require
      const { TopNav, LoginNav } = require('navigation-component');
      console.log('TopNavRef');
      console.log(JSON.stringify(auth.profile, 4, null));
      return (
        <TopNav
          menu={menu}
          rightMenu={(
            <LoginNav
              loggedIn={!_.isEmpty(auth.profile)}
              notificationButtonState="none"
              notifications={[]}
              accountMenu={config.ACCOUNT_MENU}
              switchText={config.ACCOUNT_MENU_SWITCH_TEXT}
              onSwitch={this.handleSwitchMenu}
              onMenuOpen={this.handleCloseOpenMore}
              profile={normalizedProfile}
              auth={auth}
              authURLs={config.HEADER_AUTH_URLS}
            />
              )}
          logo={logoToUse}
          theme={menuTheme[1]}
          currentLevel1Id={activeLevel1Id}
          onChangeLevel1Id={this.handleChangeLevel1Id}
          path={path}
          openMore={openMore}
          setOpenMore={this.handleChangeOpenMore}
          loggedIn={!_.isEmpty(auth.profile)}
          profileHandle={auth.profile ? auth.profile.handle : ''}
          logoLink={fields.logoLink}
        />
      );
    }
    // no SSR for navi component yet
    // TODO when ready
    return null;
  }
}

MenuLoaderContainer.defaultProps = {
  preview: false,
  spaceName: null,
  environment: null,
  menu: [],
  baseUrl: '',
};

MenuLoaderContainer.propTypes = {
  id: PT.string.isRequired,
  preview: PT.bool,
  spaceName: PT.string,
  environment: PT.string,
  fields: PT.shape().isRequired,
  auth: PT.shape().isRequired,
  loadMenuData: PT.func.isRequired,
  menu: PT.arrayOf(PT.shape()),
  loading: PT.bool.isRequired,
  menuLogo: PT.shape().isRequired,
  baseUrl: PT.string,
};

function mapStateToProps(state, ownProps) {
  return {
    auth: state.auth || {},
    menu: state.menuNavigation[ownProps.id] ? state.menuNavigation[ownProps.id].menu : [],
    loading: state.menuNavigation[ownProps.id] ? state.menuNavigation[ownProps.id].loading : true,
    menuLogo: state.menuNavigation[ownProps.id] ? state.menuNavigation[ownProps.id].menuLogo : {},
  };
}

function mapDispatchToProps(dispatch) {
  const a = actions.contentful;
  return {
    loadMenuData: (ownProps) => {
      dispatch(a.getMenuInit(ownProps));
      dispatch(a.getMenuDone(ownProps));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MenuLoaderContainer);
