/**
 * Looker component.
 * ## Parameters
 * - property, indicating which property of a record to return.
 *
 * - table, table columns information, can support both object and string.
 *   1. The styles are react inline style, style names should be in camelcase.
 *   2. When it's a string, it firstly should be from a valid json,
 *   then replace `"` and `'` with `&q;`, it should not have unnessesary white space.
 *   3. If pass `table=""`, it will return a table using property name as header name;
 *
 * - render, custom render function, can support both object and string.
 *   1. When it's a string, it firstly should be from valid function source code,
 *   then replace `"` and `'` with `&q;`, it should not have unnessesary white space.
 *   2. In string, it should NOT be an arrow function.
 *
 */
/* eslint-disable no-eval */

import PT from 'prop-types';
import _ from 'lodash';
import React, { Component } from 'react';
import { fixStyle } from 'utils/contentful';
import { getRatingColor } from 'utils/tc';
import cn from 'classnames';
import { Scrollbars } from 'react-custom-scrollbars';
import './style.scss';

// Format strings that represent numeric values (optionally with a leading
// '$' and/or a leading '-') by inserting thousands separators while
// preserving any decimal part. Non-numeric strings are returned as-is.
function formatMaybeNumericString(s) {
  if (typeof s !== 'string') return s;
  const str = s.trim();
  if (!str) return s;
  if (str.includes(',')) return s; // assume already formatted

  let prefix = '';
  let sign = '';
  let numberPart = str;

  if (numberPart[0] === '$') {
    prefix = '$';
    numberPart = numberPart.slice(1);
  }
  if (numberPart[0] === '-') {
    sign = '-';
    numberPart = numberPart.slice(1);
  }

  if (!/^\d+(\.\d+)?$/.test(numberPart)) return s;

  const [intPart, decPart] = numberPart.split('.');
  const intWithCommas = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const dec = decPart ? `.${decPart}` : '';
  return `${prefix}${sign}${intWithCommas}${dec}`;
}

export default class Looker extends Component {
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
      property,
      table,
      render,
      limit,
      tableHeight,
      tableWidth,
      headerIndexCol,
      ratingProp,
    } = this.props;

    let {
      countRows,
    } = this.props;
    if (countRows === 'true') {
      countRows = true;
    }
    if (countRows === 'false') {
      countRows = false;
    }

    let {
      lookerInfo: {
        lookerData,
      },
    } = this.props;

    const { sortParam } = this.state;

    if (sortParam.field) {
      // Use Lodash to sort array
      lookerData = _.orderBy(lookerData, [sortParam.field], [sortParam.order]);
    }

    const renderData = () => {
      if (property) {
        if (lookerData.length > 0 && lookerData[0][property]) {
          if (typeof lookerData[0][property] === 'string') {
            return formatMaybeNumericString(lookerData[0][property]);
          }
          if (typeof lookerData[0][property] === 'number') {
            return lookerData[0][property].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
          }
        }
        return 'empty array!';
      } if (table || table === '') {
        let columns = table;
        if (table === '') {
          columns = [];
          if (lookerData.length > 0) {
            const keys = Object.keys(lookerData[0]);
            columns = keys.map(k => ({ property: k }));
          }
        }

        if (typeof table === 'string' && table.length > 0) {
          try {
            const s = table.replace(/'/g, '"');
            columns = JSON.parse(s);
          } catch (error) {
            return `table json parse error: ${error}`;
          }
        }

        const header = cols => (
          <tr>
            { countRows && (<th styleName="header-cell"><span>{headerIndexCol}</span></th>) }
            {
                cols.map((c) => {
                  const name = c.headerName;
                  const { styles } = c;
                  return name ? (
                    <th key={name} style={fixStyle(styles)} styleName="header-cell">
                      <div styleName="header-table-content">
                        <span>{ name }</span>
                        <button
                          styleName="sort-container"
                          onClick={() => {
                            if (!sortParam.field || sortParam.field !== c.property) {
                              sortParam.field = c.property;
                              sortParam.order = 'desc';
                            } else {
                              sortParam.order = sortParam.order === 'asc' ? 'desc' : 'asc';
                            }
                            this.setState({ sortParam });
                          }}
                          type="button"
                        >
                          <div styleName={cn('sort-up', {
                            active: sortParam.field === c.property && sortParam.order === 'asc',
                          })}
                          />
                          <div styleName={cn('sort-down', {
                            active: sortParam.field === c.property && sortParam.order === 'desc',
                          })}
                          />
                        </button>
                      </div>
                    </th>
                  ) : null;
                })
             }
          </tr>
        );
        const bodyRow = (record, cols, i) => (
          <tr key={Object.values(record)}>
            { (countRows && (limit <= 0 || i < limit)) ? <td styleName="body-row"> {i + 1} </td> : ' ' }
            {
              cols.map((c) => {
                const prop = c.property;
                let { memberLinks } = c;
                if (memberLinks === 'true') {
                  memberLinks = true;
                }
                if (memberLinks === 'false') {
                  memberLinks = false;
                }
                const { styles } = c;
                let value = '';
                let cellKey;
                if (limit <= 0 || i < limit) {
                  // Special-case a column with property "rank" to display
                  // the current row index (1-based). This mirrors the old
                  // Looker behavior and ensures alignment even when the
                  // underlying data does not include a rank field.
                  if ((prop || '').toString().toLowerCase() === 'rank') {
                    value = i + 1;
                    cellKey = `${prop}-index-${i}`;
                  } else if (typeof record[prop] === 'string') {
                    value = formatMaybeNumericString(record[prop]);
                    cellKey = record[prop];
                  } else if (typeof record[prop] === 'number') {
                    value = record[prop].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                    cellKey = record[prop];
                  }
                }
                return value ? (
                  <td key={cellKey} style={fixStyle(styles)} title={value} styleName="body-row">
                    {memberLinks ? (
                      <a styleName="handle-link" href={`${window.origin}/members/${value}`} target={`${_.includes(window.origin, 'www') ? '_self' : '_blank'}`} style={{ color: ratingProp ? getRatingColor(record[ratingProp]) : null }}>
                        {value}
                      </a>
                    ) : value}
                  </td>
                ) : null;
              })
            }
          </tr>
        );
        return (
          <Scrollbars
            styleName="component-container"
            style={{ height: tableHeight, width: tableWidth }}
          >
            <table styleName="table-container">
              <thead>
                { header(columns) }
              </thead>
              <tbody>
                { lookerData.map((record, i) => bodyRow(record, columns, i)) }
              </tbody>
            </table>
          </Scrollbars>
        );
      } if (render) {
        let f = render;
        if (typeof render === 'string') {
          const s = render.replace(/&q;/g, '"');
          try {
            f = eval(`(${s})`);
          } catch (error) {
            return `render function parse error: ${error}`;
          }
        }
        if (typeof f !== 'function') {
          return 'render is not a function';
        }
        try {
          const retValue = f(lookerData);
          if (typeof retValue === 'string') {
            return formatMaybeNumericString(retValue);
          }
          if (typeof retValue === 'number') {
            return retValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
          }
        } catch (error) {
          return `error happened while rendering: ${error}`;
        }
      }
      return 'invalid prop, use property, table or render';
    };
    return (
      <React.Fragment>
        { renderData() }
      </React.Fragment>
    );
  }
}

Looker.defaultProps = {
  property: null,
  table: null,
  render: null,
  limit: 0,
  countRows: false,
  tableHeight: '100%',
  tableWidth: '100%',
  headerIndexCol: '',
  ratingProp: null,
};

Looker.propTypes = {
  lookerInfo: PT.shape().isRequired,
  property: PT.string,
  limit: PT.number,
  countRows: PT.oneOfType([
    PT.string,
    PT.bool,
  ]),
  tableHeight: PT.string,
  tableWidth: PT.string,
  table: PT.oneOfType([
    PT.string,
    PT.arrayOf(PT.shape()),
  ]),
  render: PT.oneOfType([
    PT.string,
    PT.func,
  ]),
  headerIndexCol: PT.string,
  ratingProp: PT.string,
};
