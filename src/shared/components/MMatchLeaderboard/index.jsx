/**
 * MMatchLeaderboard component.
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
import { config } from 'topcoder-react-utils';
import { PrimaryButton } from 'topcoder-react-ui-kit';
import tc from 'components/buttons/themed/tc.scss';
import defaultStyles from './style.scss';

const DEFAULT_AVATAR_URL = 'https://images.ctfassets.net/b5f1djy59z3a/4PTwZVSf3W7qgs9WssqbVa/4c51312671a4b9acbdfd7f5e22320b62/default_avatar.svg';

export default class MMLeaderboard extends Component {
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
      theme,
      challengeId,
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
      leaderboard: {
        data,
      },
    } = this.props;

    const { sortParam } = this.state;

    if (sortParam.field) {
      // Use Lodash to sort array
      data = _.orderBy(
        data,
        [d => Number(d[sortParam.field]) || String(d[sortParam.field]).toLowerCase()],
        [sortParam.order],
      );
    }

    const renderData = () => {
      if (data.length && theme && theme === 'Podium') {
        return (
          <div className={defaultStyles.podiumTheme}>
            <div className={defaultStyles.top3}>
              <div className={defaultStyles.swapper}>
                {_.take(data, 2).map((member, indx) => (
                  <div className={defaultStyles[`topMember${indx + 1}`]}>
                    <div className={defaultStyles.topMemberPhotoAndPlace}>
                      <img src={member.photoUrl || DEFAULT_AVATAR_URL} className={defaultStyles.topMemberPhoto} alt={`Avatar of ${member.createdBy}`} />
                      <div className={defaultStyles[`topMemberRank${indx + 1}`]}>{member.rank}</div>
                      <a href={`${config.URL.BASE}/members/${member.createdBy}`} target="_blank" rel="noreferrer" style={{ color: getRatingColor(member.rating) }}>{member.createdBy}</a>
                    </div>
                    <div className={defaultStyles.topMemberLink}>
                      <a href={`${config.URL.BASE}/members/${member.createdBy}`} target="_blank" rel="noreferrer" style={{ color: getRatingColor(member.rating) }}>{member.createdBy}</a>
                      <p className={defaultStyles.topMemberScore}>{member.score}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className={defaultStyles.topMember3}>
                <div className={defaultStyles.topMemberPhotoAndPlace}>
                  <img src={data[2].photoUrl || DEFAULT_AVATAR_URL} className={defaultStyles.topMemberPhoto} alt={`Avatar of ${data[2].createdBy}`} />
                  <div className={defaultStyles.topMemberRank3}>{data[2].rank}</div>
                  <a href={`${config.URL.BASE}/members/${data[2].createdBy}`} target="_blank" rel="noreferrer" style={{ color: getRatingColor(data[2].rating) }}>{data[2].createdBy}</a>
                </div>
                <div className={defaultStyles.topMemberLink}>
                  <a href={`${config.URL.BASE}/members/${data[2].createdBy}`} target="_blank" rel="noreferrer" style={{ color: getRatingColor(data[2].rating) }}>{data[2].createdBy}</a>
                  <p className={defaultStyles.topMemberScore}>{data[2].score}</p>
                </div>
              </div>
            </div>
            <div className={defaultStyles.followers}>
              <div className={defaultStyles.followersLeft}>
                {_.slice(data, 3, 7).map(member => (
                  <div className={defaultStyles.follower}>
                    <span>{member.rank}.&nbsp;</span>
                    <a href={`${config.URL.BASE}/members/${member.createdBy}`} target="_blank" rel="noreferrer" style={{ color: getRatingColor(member.rating) }}>{member.createdBy}</a>
                    <span className={defaultStyles.followerScore}>{member.score}</span>
                  </div>
                ))}
              </div>
              {
                data.length > 7 && (
                <div className={defaultStyles.followersRight}>
                  {_.slice(data, 7, 10).map(member => (
                    <div className={defaultStyles.follower}>
                      <span>{member.rank}.&nbsp;</span>
                      <a href={`${config.URL.BASE}/members/${member.createdBy}`} target="_blank" rel="noreferrer" style={{ color: getRatingColor(member.rating) }}>{member.createdBy}</a>
                      <span className={defaultStyles.followerScore}>{member.score}</span>
                    </div>
                  ))}
                  {
                    data.length > 10 && (
                      <div className={defaultStyles.moreBtn}>
                        <PrimaryButton
                          to={`${config.URL.BASE}/challenges/${challengeId}?tab=submissions`}
                          openNewTab
                          theme={{
                            button: tc['primary-green-sm'],
                          }}
                        >
                          See Full Leaderbord
                        </PrimaryButton>
                      </div>
                    )}
                </div>
                )}
            </div>
          </div>
        );
      }
      if (property) {
        if (data.length > 0 && data[0][property]) {
          if (typeof data[0][property] === 'string') {
            return data[0][property];
          }
          if (typeof data[0][property] === 'number') {
            return data[0][property].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
          }
        }
        return 'empty array!';
      } if (table || table === '') {
        let columns = table;
        if (table === '') {
          columns = [];
          if (data.length > 0) {
            const keys = Object.keys(data[0]);
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
            { countRows && (<th className={defaultStyles['header-cell']}><span>{headerIndexCol}</span></th>) }
            {
                cols.map((c) => {
                  const name = c.headerName;
                  const { styles } = c;
                  return name ? (
                    <th key={name} style={fixStyle(styles)} className={defaultStyles['header-cell']}>
                      <div className={defaultStyles['header-table-content']}>
                        <span>{ name }</span>
                        <button
                          className={defaultStyles['sort-container']}
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
            { (countRows && (limit <= 0 || i < limit)) ? <td className={defaultStyles['body-row']}> {i + 1} </td> : ' ' }
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
                if (limit <= 0 || i < limit) {
                  if (typeof record[prop] === 'string') {
                    value = record[prop];
                  }
                  if (typeof record[prop] === 'number') {
                    value = record[prop].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                  }
                }
                return value ? (
                  <td key={record[prop]} style={fixStyle(styles)} title={value} className={defaultStyles['body-row']}>
                    {memberLinks ? (<a className={defaultStyles['handle-link']} href={`${window.origin}/members/${value}`} target={`${_.includes(window.origin, 'www') ? '_self' : '_blank'}`}>{value}</a>) : value}
                  </td>
                ) : null;
              })
            }
          </tr>
        );
        return (
          <Scrollbars
            className={defaultStyles['component-container']}
            style={{ height: tableHeight, width: tableWidth }}
          >
            <table className={defaultStyles['table-container']}>
              <thead>
                { header(columns) }
              </thead>
              <tbody>
                { data.map((record, i) => bodyRow(record, columns, i)) }
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
          const retValue = f(data);
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
        { data.length ? renderData() : <h4 className={defaultStyles['no-data-title']}>No data available yet.</h4> }
      </React.Fragment>
    );
  }
}

MMLeaderboard.defaultProps = {
  property: null,
  table: null,
  render: null,
  limit: 0,
  countRows: false,
  tableHeight: '100%',
  tableWidth: '100%',
  headerIndexCol: '',
  theme: null,
};

MMLeaderboard.propTypes = {
  leaderboard: PT.shape().isRequired,
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
  theme: PT.string,
  challengeId: PT.string.isRequired,
};
