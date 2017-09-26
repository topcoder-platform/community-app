import actions from 'actions/submit';
import { handleActions } from 'redux-actions';

const submitDone = (state, action) => {
  if (action.payload.error) {
    return {
      ...state,
      errorMsg: action.payload.error.details || action.payload.error.name,
      isSubmitting: false,
      submitDone: false,
    };
  }

  return {
    ...state,
    ...action.payload,
    isSubmitting: false,
    submitDone: true,
  };
};

function create(initialState) {
  const a = actions.submit;
  return handleActions({
    [a.submitInit]: state => ({
      ...state,
      isSubmitting: true,
      submitDone: false,
      errorMsg: '',
    }),
    [a.submitDone]: submitDone,
    [a.reset]: state => ({
      ...state,
      isSubmitting: false,
      submitDone: false,
      errorMsg: '',
    }),
  }, initialState || {
    isSubmitting: false,
    submitDone: false,
    errorMsg: '',
  });
}

export function factory() {
  return Promise.resolve(create());
}

export default create();
