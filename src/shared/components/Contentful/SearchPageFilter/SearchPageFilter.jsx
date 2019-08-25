/**
 * The core search bar rendering.
 */
import _ from 'lodash';
import moment from 'moment';
import PT from 'prop-types';
import React, { Component } from 'react';
import { themr } from 'react-css-super-themr';

import IconCloseBig from 'assets/images/tc-edu/icon-close-big.svg';
import IconArrowUpSmall from 'assets/images/tc-edu/icon-arrow-up-small.svg';
import FilterTags from './FilterTags';
import FilterAuthor from './FilterAuthor';
import FilterDate from './FilterDate';
import FilterRadio from './FilterRadio';
import FilterSelection from './FilterSelection';
import defaultTheme from './themes/default.scss';


export class SearchPageFilterInner extends Component {
  constructor(props) {
    super(props);

    const { categories, selectedCategory } = props;
    const selectedCategoryObject = _.find(categories, { name: selectedCategory });
    this.state = {
      isShowSubCategory: true,
      selectedAuthor: props.selectedAuthor,
      authorList: props.authorList,
      tags: _.cloneDeep(props.tags),
      startDate: props.startDate,
      endDate: props.endDate,
      selectedCategory: selectedCategoryObject ? _.cloneDeep(selectedCategoryObject) : null,
      categories,
    };
  }

  render() {
    const {
      theme,
      onClose,
      className,
      isShowInMobile,
    } = this.props;

    const {
      isShowSubCategory,
      selectedAuthor,
      authorList,
      startDate,
      endDate,
      tags,
      selectedCategory,
      categories,
    } = this.state;

    return (
      <div className={`${theme.container} ${className} ${isShowInMobile ? '' : theme['is-desktop']}`}>
        <div className={`${theme.header} ${theme['is-mobile']}`}>
          <span>filter</span>
          <button
            type="button"
            onClick={onClose}
          >
            <IconCloseBig />
          </button>
        </div>
        <div className={theme.section}>
          <div
            className={theme['section-header']}
          >
            <span className={theme['section-title']}>category</span>
          </div>
          <FilterRadio
            selected={selectedCategory ? selectedCategory.name : null}
            options={categories}
            onSelected={(item) => {
              if (item) {
                const newSelectedCategory = _.cloneDeep(item);
                for (let i = 0; i < newSelectedCategory.subCategories.length; i += 1) {
                  newSelectedCategory.subCategories[i].selected = false;
                }
                this.setState({ selectedCategory: newSelectedCategory });
              }
            }}
          />
        </div>
        <div className={theme.section}>
          <button
            type="button"
            className={`${theme['section-header']} ${isShowSubCategory ? theme.expanded : ''}`}
            onClick={() => { this.setState({ isShowSubCategory: !isShowSubCategory }); }}
          >
            <span className={theme['section-title']}>sub category</span>
            <IconArrowUpSmall />
          </button>
          {selectedCategory && isShowSubCategory && (
            <FilterSelection
              options={selectedCategory.subCategories}
              onSelected={(index) => {
                const subCategory = selectedCategory.subCategories[index];
                subCategory.selected = !subCategory.selected;
                this.setState({ selectedCategory });
              }}
            />
          )}
        </div>
        <div className={theme.section}>
          <div
            type="button"
            className={theme['section-header']}
          >
            <span className={theme['section-title']}>filter</span>
          </div>
          <FilterTags
            tags={tags}
            onAddNewTag={(tag) => {
              tags.push(tag);
              this.setState({ tags });
            }}
            onRemoveTag={(index) => {
              tags.splice(index, 1);
              this.setState({ tags });
            }}
          />
          <FilterAuthor
            className={theme['author-container']}
            selected={selectedAuthor}
            options={authorList}
            onSelected={(item) => { this.setState({ selectedAuthor: item }); }}
          />
          <FilterDate
            className={theme['track-date-container']}
            startDate={startDate}
            endDate={endDate}
            onSelectStartDate={(date) => { this.setState({ startDate: date }); }}
            onSelectEndDate={(date) => { this.setState({ endDate: date }); }}
          />
        </div>
        <div className={theme.bottom}>
          <button
            type="button"
            className={theme['btn-apply']}
          >APPLY FILTER
          </button>
        </div>
      </div>
    );
  }
}

SearchPageFilterInner.defaultProps = {
  onClose: () => {},
  selectedAuthor: '',
  authorList: [],
  startDate: null,
  endDate: null,
  tags: [],
  selectedCategory: '',
  categories: [],
  className: '',
  isShowInMobile: false,
};

SearchPageFilterInner.propTypes = {
  theme: PT.shape({
    container: PT.string.isRequired,
    bottom: PT.string.isRequired,
    header: PT.string.isRequired,
    section: PT.string.isRequired,
    expanded: PT.string.isRequired,
    'track-date-container': PT.string.isRequired,
    'author-container': PT.string.isRequired,
    'btn-apply': PT.string.isRequired,
    'section-header': PT.string.isRequired,
    'section-title': PT.string.isRequired,
    'is-mobile': PT.string.isRequired,
    'is-desktop': PT.string.isRequired,
  }).isRequired,
  onClose: PT.func,
  selectedAuthor: PT.string,
  startDate: PT.instanceOf(moment),
  endDate: PT.instanceOf(moment),
  authorList: PT.arrayOf(PT.string),
  tags: PT.arrayOf(PT.string),
  selectedCategory: PT.string,
  categories: PT.arrayOf(PT.shape({
    name: PT.string.isRequired,
    subCategories: PT.arrayOf(PT.shape({
      name: PT.string.isRequired,
      selected: PT.bool,
    })),
  })),
  className: PT.string,
  isShowInMobile: PT.string,
};

export default themr('Contentful-Blog', defaultTheme)(SearchPageFilterInner);
