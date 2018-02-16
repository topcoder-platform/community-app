
import _ from 'lodash';
import { createActions } from 'redux-actions';
import { getService } from 'services/quality-assurance/issues';
import 'isomorphic-fetch';

function listIssue(owner, repo) {
  return getService().listIssues(owner, repo);
}

export default createActions({
  QUALITY_ASSURANCE_ISSUES: {
    GET_ISSUES_INIT: _.noop,
    GET_ISSUES_DONE: listIssue,
  },
});
