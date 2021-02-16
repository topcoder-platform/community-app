/* eslint-disable no-underscore-dangle */
/**
 * GSheet component
 * renders a table with data from google sheets
 */

import PT from 'prop-types';
import _ from 'lodash';
import React, { Component } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import cn from 'classnames';
import './style.scss';

export default class GSheet extends Component {
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
      sheet, config,
    } = this.props;

    const { sortParam } = this.state;
    let data = sheet.rows;

    if (sortParam.field) {
      // Use Lodash to sort array
      data = _.orderBy(
        sheet.rows,
        [d => Number(d[sortParam.field]) || String(d[sortParam.field]).toLowerCase()],
        [sortParam.order],
      );
    }

    const renderData = () => (
      <Scrollbars
        styleName="component-container"
        style={config.containerStyles}
      >
        <table styleName="table-container">
          <thead>
            <tr>
              {
                (config.pick || sheet.rows[0]._sheet.headerValues).map(c => (
                  <th key={c} styleName="header-cell">
                    <div styleName="header-table-content">
                      <span>{c}</span>
                      <button
                        styleName="sort-container"
                        onClick={() => {
                          if (!sortParam.field || sortParam.field !== c) {
                            sortParam.field = c;
                            sortParam.order = 'desc';
                          } else {
                            sortParam.order = sortParam.order === 'asc' ? 'desc' : 'asc';
                          }
                          this.setState({ sortParam });
                        }}
                        type="button"
                      >
                        <div styleName={cn('sort-up', {
                          active: sortParam.field === c && sortParam.order === 'asc',
                        })}
                        />
                        <div styleName={cn('sort-down', {
                          active: sortParam.field === c && sortParam.order === 'desc',
                        })}
                        />
                      </button>
                    </div>
                  </th>
                ))
              }
            </tr>
          </thead>
          <tbody>
            {
              data.map(record => (
                <tr key={Object.values(record._rawData)}>
                  {
                    (config.pick || sheet.rows[0]._sheet.headerValues).map(c => (
                      <td key={`${record._rowNumber}-${c}`} title={record[c]} styleName="body-row">
                        {c.toLowerCase() === 'handle' ? (<a styleName="handle-link" href={`${window.origin}/members/${record[c]}`} target="_blank" rel="noreferrer">{record[c]}</a>) : record[c]}
                      </td>
                    ))
                  }
                </tr>
              ))
            }
          </tbody>
        </table>
      </Scrollbars>
    );

    return (
      <React.Fragment>
        { sheet.rows && sheet.rows.length ? renderData() : <h4 styleName="no-data-title">No data available yet.</h4>}
      </React.Fragment>
    );
  }
}

GSheet.defaultProps = {

};

GSheet.propTypes = {
  sheet: PT.shape().isRequired,
  config: PT.shape().isRequired,
};
