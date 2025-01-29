import _ from 'lodash';
import moment from 'moment';
import React, { Component } from 'react';
import PT from 'prop-types';
import { themr } from 'react-css-super-themr';
import cn from 'classnames';
import defaultStyle from './style.scss';

/* Date/time format to use in the link. */
const FORMAT = 'MMM DD, YYYY';

class NewsletterArchive extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sortParam: {
        order: '',
        field: '',
      },
    };
  }

  render() {
    const {
      archive,
    } = this.props;
    const { sortParam } = this.state;
    const archiveOrdered = _.orderBy(archive.campaigns, [sortParam.field], [sortParam.order]);

    return (
      <table styleName="history-table">
        <thead>
          <tr>
            <th>Item</th>
            <th>
              <div styleName="header-table-content">
                <span>NEWSLETTER</span>
                <button
                  styleName="sort-container"
                  onClick={() => {
                    if (!sortParam.field || sortParam.field !== 'settings.title') {
                      sortParam.field = 'settings.title';
                      sortParam.order = 'desc';
                    } else {
                      sortParam.order = sortParam.order === 'asc' ? 'desc' : 'asc';
                    }
                    this.setState({ sortParam });
                  }}
                  type="button"
                >
                  <div styleName={cn('sort-up', {
                    active: sortParam.field === 'settings.title' && sortParam.order === 'asc',
                  })}
                  />
                  <div styleName={cn('sort-down', {
                    active: sortParam.field === 'settings.title' && sortParam.order === 'desc',
                  })}
                  />
                </button>
              </div>
            </th>
            <th>
              <div styleName="header-table-content">
                <span>SEND DATE</span>
                <button
                  styleName="sort-container"
                  onClick={() => {
                    if (!sortParam.field || sortParam.field !== 'send_time') {
                      sortParam.field = 'send_time';
                      sortParam.order = 'desc';
                    } else {
                      sortParam.order = sortParam.order === 'asc' ? 'desc' : 'asc';
                    }
                    this.setState({ sortParam });
                  }}
                  type="button"
                >
                  <div styleName={cn('sort-up', {
                    active: sortParam.field === 'send_time' && sortParam.order === 'asc',
                  })}
                  />
                  <div styleName={cn('sort-down', {
                    active: sortParam.field === 'send_time' && sortParam.order === 'desc',
                  })}
                  />
                </button>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {
            archiveOrdered.map((archiveItem, indx) => (
              <tr styleName="row" key={`${archiveItem.id}`}>
                <td styleName="index">{indx + 1}</td>
                <td styleName="name">
                  <a href={archiveItem.archive_url} key={`l${archiveItem.id}`} styleName="archive-link" target="_blank" rel="noopener noreferrer">
                    {archiveItem.settings.title}
                  </a>
                </td>
                <td styleName="sent-date">
                  {moment(archiveItem.send_time).format(FORMAT)}
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
    );
  }
}

NewsletterArchive.propTypes = {
  archive: PT.arrayOf().isRequired,
};

export default themr('NewsletterArchive', defaultStyle)(NewsletterArchive);
