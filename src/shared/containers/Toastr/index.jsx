/**
 * Toastr component.
 */
import React from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';

import { ReduxToastr } from 'react-redux-toastr/lib/ReduxToastr';
import ToastrBox from 'react-redux-toastr/lib/ToastrBox';
import ProgressBar from 'react-redux-toastr/lib/ProgressBar';
import * as actions from 'react-redux-toastr/lib/actions';
import CheckmarkIcon from 'assets/images/icon-checkmark.svg';
import './styles.scss';

/* eslint-disable react/jsx-no-bind */
/* eslint-disable no-underscore-dangle */
/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable jsx-a11y/click-events-have-key-events */
class ExtendedToastrBox extends ToastrBox {
  renderToastr() {
    const {
      type,
      options,
      message,
      title,
    } = this.props.item;

    return (
      <div role="button" styleName="content">
        <div styleName="left-container">
          {this.renderIcon()}
        </div>
        {options.status && type === 'light' && <div className={classnames('toastr-status', options.status)} />}
        <div styleName="middle-container">
          {title && (
          <div styleName="title">
            {title}
          </div>
          )}
          {message && (
          <div styleName="text">
            {message}
          </div>
          )}
          {options.component && this.renderSubComponent()}
        </div>

        <div styleName="right-container">
          {options.showCloseButton && this.renderCloseButton()}
        </div>
        {this.state.progressBar ? <ProgressBar {...this.state.progressBar} /> : null}
      </div>
    );
  }
}

class ExtendedReduxToastr extends ReduxToastr {
  _renderToastrForPosition(position) {
    const { toastrs } = this.props.toastr || [];

    return toastrs
      .filter(item => item.position === position)
      .map((item) => {
        const mergedItem = {
          ...item,
          options: {
            progressBar: this.props.progressBar,
            transitionIn: this.props.transitionIn,
            transitionOut: this.props.transitionOut,
            icon: <CheckmarkIcon />,
            ...item.options,
          },
        };

        return (
          <span key={item.id} styleName="toastr-container">
            <ExtendedToastrBox
              inMemory={this.toastrFired}
              addToMemory={() => this._addToMemory(item.id)}
              item={mergedItem}
              toastrs={this.props.toastrs}
              preventDuplicates={this.props.preventDuplicates}
              position={this.props.position}
              transitionIn={this.props.transitionIn}
              transitionOut={this.props.transitionOut}
              progressBar={this.props.progressBar}
              showCloseButton={this.props.showCloseButton}
            />
            {item.options && item.options.attention
              && (
              <div
                role="button"
                onClick={() => {
                  if (typeof item.options.onAttentionClick === 'function') {
                    item.options.onAttentionClick(item.id);
                  } else {
                    this.props.remove(item.id);
                  }
                }}
                className="toastr-attention"
              />
              )
            }
          </span>
        );
      });
  }
}

export default connect(
  state => ({
    toastr: state.toastr,
  }),
  actions,
)(ExtendedReduxToastr);
