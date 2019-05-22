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
import React from 'react';

export default function Looker(props) {
  const {
    lookerInfo: {
      lookerData,
    },
    property,
    table,
    render,
    limit,
    countRows,
    tableHeight,
    tableWidth,
  } = props;

  const renderData = () => {
    if (property) {
      if (lookerData.length > 0) {
        if (typeof lookerData[0][property] === 'string') {
          return lookerData[0][property];
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
          { countRows && <th /> }
          {
              cols.map((c) => {
                const name = c.headerName;
                const { styles } = c;
                return (
                  <th key={name} style={styles}>{ name }</th>
                );
              })

           }
        </tr>
      );

      const bodyRow = (record, cols, i) => (
        <tr key={Object.values(record)}>
          { (countRows && (limit <= 0 || i < limit)) ? <td> {i + 1}. </td> : ' ' }
          {
            cols.map((c) => {
              const prop = c.property;
              const { styles } = c;
              let value = '';
              if (limit <= 0 || i < limit) {
                if (typeof record[prop] === 'string') {
                  value = record[prop];
                }
                if (typeof record[prop] === 'number') {
                  value = record[prop].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                }
              }
              return (
                <td key={record[prop]} style={styles} title={value}>
                  {value}
                </td>
              );
            })
          }
        </tr>
      );

      return (
        <div style={{ overflowY: 'scroll', height: tableHeight, width: tableWidth }}>
          <table style={{ width: '100%' }}>
            <tbody>
              { header(columns) }
              { lookerData.map((record, i) => bodyRow(record, columns, i)) }
            </tbody>
          </table>
        </div>
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
          return retValue;
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

Looker.defaultProps = {
  property: null,
  table: null,
  render: null,
  limit: 0,
  countRows: false,
  tableHeight: '100%',
  tableWidth: '100%',
};

Looker.propTypes = {
  lookerInfo: PT.shape().isRequired,
  property: PT.string,
  limit: PT.number,
  countRows: PT.bool,
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
};
