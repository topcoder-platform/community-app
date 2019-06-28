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
// import Logo from 'assets/images/tc-logo.svg';
import { isomorphy } from 'topcoder-react-utils';
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
  }

  componentDidMount() {
    const {
      id,
      loadMenuData,
      fields,
      preview,
      spaceName,
      environment,
    } = this.props;
    // initiate loading the menu data
    loadMenuData({
      id,
      fields,
      preview,
      spaceName,
      environment,
    });
  }

  handleChangeLevel1Id(menuId) {
    this.setState({ activeLevel1Id: menuId });
  }

  handleChangeOpenMore(changedOpenMore) {
    this.setState({ openMore: changedOpenMore });
  }

  render() {
    const { menu, auth, loading } = this.props;
    const { openMore, path, activeLevel1Id } = this.state;
    if (loading) {
      return <LoadingIndicator />;
    }
    if (isomorphy.isClientSide()) {
      // eslint-disable-next-line global-require
      const { TopNav } = require('navigation-component');
      return (
        <div>
          <TopNav
            menu={menu}
            // logo={<Logo />}
            loggedIn={!_.isEmpty(auth)}
            currentLevel1Id={activeLevel1Id}
            onChangeLevel1Id={this.handleChangeLevel1Id}
            path={path}
            openMore={openMore}
            setOpenMore={this.handleChangeOpenMore}
          />
        </div>
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
};

function mapStateToProps(state, ownProps) {
  return {
    auth: state.auth || {},
    menu: state.menuNavigation[ownProps.id] ? state.menuNavigation[ownProps.id].menu : [],
    loading: state.menuNavigation[ownProps.id] ? state.menuNavigation[ownProps.id].loading : true,
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
