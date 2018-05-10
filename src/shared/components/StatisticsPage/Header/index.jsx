/**
 * Badges Popup Component.  Renders a tooltip to show the date a badge was earned.
 */
import React from 'react';
import PT from 'prop-types';
import styles from './styles.scss';

class Header extends React.Component {
    render() {
        const {
          title,
          modalOpen,
          numberOfChallenges,
          activeTitle,
        } = this.props;
        return(
            <div styleName="page-state-header">
                <header>
                    <div styleName="page-info">
                        <h1>{title}</h1>
                        <div styleName="nav-right">
                            <i onClick={()=>{modalOpen()}} styleName="fa fa-th">
                            ...
                        </i>
                        </div>
                    </div>
                    <div styleName="info">
                        <div styleName="item">
                            <div styleName="value">
                                <p>{numberOfChallenges}</p>
                            </div>
                            <div styleName="title">
                                <p>{activeTitle}</p>
                            </div>
                        </div>
                    </div>
                </header>
            </div>
        );
    }
}

Header.defaultProps = {
  pageTitle: "",
  modalOpen: null,
  numberOfChallenges: null,
  activeTitle: "",
};

Header.propTypes = {
  pageTitle: PT.string,
  modalOpen: PT.func,
  numberOfChallenges: PT.number,
  activeTitle: PT.string,
};

export default Header;
