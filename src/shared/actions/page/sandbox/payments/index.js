import _ from 'lodash';
import editorActions from './editor';
import listingActions from './listing';

export default _.merge(editorActions, listingActions);
