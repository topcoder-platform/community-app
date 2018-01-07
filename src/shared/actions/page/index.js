import _ from 'lodash';
import challengeDetails from './challenge-details';
import sandboxActions from './sandbox';

export default _.merge({}, challengeDetails, sandboxActions);
