import React, { Component } from 'react';
import { map, filter } from 'lodash';
import DownArrowIcon from 'assets/images/select-arrow.svg';
import uuid from 'uuid';
import PT from 'prop-types';
import cn from 'classnames';
import MenuItem from './MenuItem';
import './style.scss';


export default class InputSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filterVal: '',
      isShowModal: false,
      _id: uuid(),
    };

    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.onToggleModal = this.onToggleModal.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.onFilterChange = this.onFilterChange.bind(this);
    this.onLoadMore = this.onLoadMore.bind(this);
  }

  componentDidMount() {
    document.addEventListener('click', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClickOutside);
  }

  onToggleModal(evt) {
    const {
      disabled,
    } = this.props;

    const {
      isShowModal,
    } = this.state;

    evt.stopPropagation();

    if (disabled) { return; }

    this.setState({
      isShowModal: !isShowModal,
      filterVal: '',
    });
  }

  onReset() {
    this.setState({
      isShowModal: false,
      filterVal: '',
    });
  }


  onSelect(v) {
    const {
      onChange,
      valueKey,
      value,
    } = this.props;

    const newVal = valueKey ? v[valueKey] : v.value;

    if (value !== newVal) {
      onChange(v[valueKey]);
    }

    this.setState({
      isShowModal: false,
      filterVal: '',
    });
  }

  onFilterChange(evt) {
    evt.stopPropagation();
    this.setState({
      filterVal: evt.target.value,
    });
  }

  onLoadMore(e) {
    const {
      hasMore,
      isLoading,
      onLoadMore,
    } = this.props;
    const {
      filterVal,
    } = this.state;
    const element = e.target;
    if (!hasMore || isLoading || filterVal.length) { return; }

    if (element.scrollHeight - element.scrollTop - element.clientHeight <= 10) {
      onLoadMore();
    }
  }

  handleClickOutside(e) {
    const {
      _id,
      isShowModal,
    } = this.state;
    if (!isShowModal) { return false; }
    let i = 0;
    let node = e.target;
    const REG = new RegExp(_id);
    while (node && i < 5) {
      if (REG.test(node.className)) {
        return true;
      }
      i += 1;
      node = node.parentNode;
    }

    this.setState({
      isShowModal: false,
    });
    return false;
  }

  render() {
    const {
      value,
      placeholder,
      labelKey,
      options,
    } = this.props;

    const {
      _id,
      isShowModal,
      filterVal,
    } = this.state;

    let fiterList = options;
    if (filterVal) {
      const REG = new RegExp(filterVal, 'i');
      fiterList = filter(options, o => REG.test(o[labelKey]));
    }
    const list = map(fiterList, o => (
      <MenuItem
        data={o}
        labelKey={labelKey}
        value={value}
        key={o[labelKey]}
        onClick={this.onSelect}
      />
    ));

    return (
      <div className={_id} styleName="container">
        <div
          styleName="input-container"
          tabIndex={0}
          role="button"
          onKeyPress={() => {}}
          onClick={this.onToggleModal}
        >
          <div styleName={cn('input-label', { 'input-placeholder': value.length === 0 })}>{value.length ? value : placeholder }</div>
          <div styleName="input-arrow"><DownArrowIcon /></div>
        </div>
        {isShowModal && options.length > 0
          ? (
            <div styleName="modal">
              <div styleName="modal-input-container">

                <input type="text" onChange={this.onFilterChange} placeholder="Search" />
              </div>
              <div styleName="modal-list-container" onScroll={this.onLoadMore}>
                {list}
              </div>
            </div>
          ) : null}
      </div>
    );
  }
}


InputSelect.defaultProps = {
  options: [],
  valueKey: '',
  labelKey: '',
  value: '',
  placeholder: '',
  disabled: false,
  hasMore: false,
  isLoading: false,
  onChange: () => {},
  onLoadMore: () => {},
};

InputSelect.propTypes = {
  options: PT.arrayOf(PT.object),
  valueKey: PT.string,
  labelKey: PT.string,
  value: PT.string,
  placeholder: PT.string,
  onChange: PT.func,
  onLoadMore: PT.func,
  hasMore: PT.bool,
  isLoading: PT.bool,
  disabled: PT.bool,
};
