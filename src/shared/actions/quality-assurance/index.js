
import _ from 'lodash';
import { createActions } from 'redux-actions';
import { getService } from 'services/quality-assurance/repositories';
import 'isomorphic-fetch';
import { fireErrorMessage } from 'utils/errors';

function listRepositories() {
  return getService().listRepositories();
}

export default createActions({
  QUALITY_ASSURANCE: {
    GET_REPOSITORIES_INIT: _.noop,
    GET_REPOSITORIES_DONE: listRepositories
  }
});
