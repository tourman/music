import { produce } from 'immer';
import { DEBOUNCE, ERROR, QUERY, SUCCESS } from './types';

function setLoading(state, draft, request) {
  draft.network.request = request;
  draft.display.input.status = 'loading';
  draft.display.status.loading =
    state.display.result && state.display.result !== 'skeleton' ? true : false;
  draft.display.result = state.display.result
    ? state.display.result
    : 'skeleton';
  draft.display.error = null;
}

export default function reducer(state, action) {
  console.log({ state, action });
  return produce(state, draft => {
    const { type, payload, query } = action;
    if (type === QUERY) {
      draft.display.input.value = query;
      if (query === '') {
        draft.display.input.status = 'idle';
        draft.display.result = '';
        draft.display.status.loading = false;
        draft.display.error = null;
        draft.network.request = null;
        draft.timer.debounce = null;
      } else if ([state.display.result, state.display.error].includes(query)) {
        draft.display.input.status =
          state.display.input.status === 'loading'
            ? 'idle'
            : state.display.input.status;
        draft.display.status.loading = false;
        draft.network.request = null;
        draft.timer.debounce = null;
      } else {
        draft.timer.debounce = query;
      }
    } else if (type === DEBOUNCE) {
      setLoading(state, draft, state.timer.debounce);
      draft.timer.debounce = null;
    } else {
      const isQueue =
        state.network.request &&
        state.timer.debounce &&
        state.network.request !== state.timer.debounce;
      if (isQueue) {
        draft.network.request = state.timer.debounce;
        draft.timer.debounce = null;
      } else if (type === SUCCESS) {
        draft.display.input.status = 'idle';
        draft.display.result = payload === 'full' ? state.network.request : '';
        draft.display.status.loading = false;
        draft.display.error = null;
        draft.network.request = null;
        draft.timer.debounce = null;
      } else if (type === ERROR) {
        draft.display.input.status = 'error';
        draft.display.status.loading = false;
        draft.display.error = state.network.request;
        draft.network.request = null;
        draft.timer.debounce = null;
      }
    }
  });
}
