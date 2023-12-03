import { produce } from 'immer';
import { DEBOUNCE, ERROR, QUERY, SUCCESS } from './types';

function setLoading(state, draft) {
  draft.network.request = state.timer.debounce;
  draft.display.input.status = 'loading';
  draft.display.status.loading =
    Array.isArray(state.display.result) && state.display.result.length > 0;
  draft.display.result = state.display.result.length
    ? state.display.result
    : 'skeleton';
  draft.display.error = null;
}

function unset(obj) {
  for (const key of Object.keys(obj)) {
    delete obj[key];
  }
  return obj;
}

function get(obj, entity) {
  for (const key of Object.keys(obj)) {
    if (obj[key] === entity) {
      return key;
    }
  }
}

const debug = (() => {
  if (process.env.NODE_ENV !== 'development') {
    return () => {};
  }
  const cache = new WeakSet();
  return (state, action, result) => {
    if (cache.has(state)) {
      return;
    }
    cache.add(state);
    console.log({ state, action, result });
  };
})();

export default function reducer(state, action) {
  const result = produce(state, draft => {
    const { type, payload, query, error } = action;
    if (type === QUERY) {
      draft.display.input.value = query;
      if (query === '') {
        unset(draft.inner.results);
        unset(draft.inner.errors);
        draft.display.input.status = 'idle';
        draft.display.result = [];
        draft.display.status.loading = false;
        draft.display.error = null;
        draft.network.request = null;
        draft.timer.debounce = null;
      } else if (
        [
          get(state.inner.results, state.display.result),
          get(state.inner.errors, state.display.error),
        ].includes(query)
      ) {
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
      unset(type === SUCCESS ? draft.inner.results : draft.inner.errors);
      draft.inner[type === SUCCESS ? 'results' : 'errors'][
        state.network.request
      ] = type === SUCCESS ? payload : error;
      const isQueue =
        state.network.request &&
        state.timer.debounce &&
        state.network.request !== state.timer.debounce;
      if (isQueue) {
        draft.network.request = state.timer.debounce;
        draft.timer.debounce = null;
      } else if (type === SUCCESS) {
        draft.display.input.status = 'idle';
        draft.display.result = payload;
        draft.display.status.loading = false;
        draft.display.error = null;
        draft.network.request = null;
        draft.timer.debounce = null;
      } else if (type === ERROR) {
        draft.display.input.status = 'error';
        draft.display.status.loading = false;
        draft.display.result = Array.isArray(state.display.result)
          ? state.display.result
          : [];
        draft.display.error = error;
        draft.network.request = null;
        draft.timer.debounce = null;
      }
    }
  });
  debug(state, action, result);
  return result;
}
