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
      <div role="button" onClick={this.handleClick.bind(this)}>
        <div className="rrt-left-container">
          <div className="rrt-holder">
            {this.renderIcon()}
          </div>
        </div>
        {options.status && type === 'light' && <div className={classnames('toastr-status', options.status)} />}
        <div className="rrt-middle-container">
          {title && <div className="rrt-title">{title}</div>}
          {message && <div className="rrt-text">{message}</div>}
          {options.component && this.renderSubComponent()}
        </div>

        <div className="rrt-right-container">
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
            ...item.options,
            showCloseButton: false,
          },
        };

        return (
          <span key={item.id}>
            <ExtendedToastrBox
              inMemory={this.toastrFired}
              addToMemory={() => this._addToMemory(item.id)}
              item={mergedItem}
              {...this.props}
            />
            {item.options && item.options.attention &&
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
            }
          </span>
        );
      });
  }
}

export default connect(
  state => ({
    toastr: state.toastr ? state.toastr : state.get('toastr'),
  }),
  actions,
)(ExtendedReduxToastr);
