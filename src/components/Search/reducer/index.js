import { produce } from 'immer';
import { DEBOUNCE, ERROR, QUERY, SUCCESS } from './types';

function setLoading(state, draft) {
  draft.network.request = state.timer.debounce;
  draft.display.input.status = 'loading';
  draft.display.status.loading = state.display.result?.items?.length > 0;
  if (!state.display.result?.items?.length) {
    draft.display.result = state.timer.debounce;
  }
  draft.display.error = null;
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
    // eslint-disable-next-line no-console
    console.log({ state, action, result });
  };
})();

function isObject(value) {
  return value && typeof value === 'object';
}

function setResult(draft, query, items) {
  if (!isObject(draft.display.result)) {
    draft.display.result = {};
  }
  Object.assign(draft.display.result, { query, items });
}

function setError(draft, query, instance) {
  if (!isObject(draft.display.error)) {
    draft.display.error = {};
  }
  Object.assign(draft.display.error, { query, instance });
}

export default function reducer(state, action) {
  const result = produce(state, draft => {
    const { type, payload, query, error } = action;
    if (type === QUERY) {
      draft.display.input.value = query;
      if (query === '') {
        draft.display.input.status = 'idle';
        setResult(draft, query, []);
        draft.display.status.loading = false;
        draft.display.error = null;
        draft.network.request = null;
        draft.timer.debounce = null;
      } else if (state.cache[query]) {
        draft.display.input.status = 'idle';
        setResult(draft, query, state.cache[query]);
        draft.display.status.loading = false;
        draft.display.error = null;
        draft.network.request = null;
        draft.timer.debounce = null;
      } else if (
        [state.display.result?.query, state.display.error?.query].includes(
          query,
        )
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
      const isQueue =
        state.network.request &&
        state.timer.debounce &&
        state.network.request !== state.timer.debounce;
      if (type === SUCCESS) {
        draft.cache[state.network.request] = payload;
      }
      if (isQueue) {
        draft.network.request = state.timer.debounce;
        if (typeof state.display.result === 'string') {
          draft.display.result = state.timer.debounce;
        }
        draft.timer.debounce = null;
      } else if (type === SUCCESS) {
        draft.display.input.status = 'idle';
        setResult(draft, state.network.request, payload);
        draft.display.error = null;
        draft.display.status.loading = false;
        draft.network.request = null;
        draft.timer.debounce = null;
      } else if (type === ERROR) {
        draft.display.input.status = 'error';
        draft.display.status.loading = false;
        if (!state.display.result?.items?.length) {
          setResult(draft, state.network.request, []);
        }
        setError(draft, state.network.request, error);
        draft.network.request = null;
        draft.timer.debounce = null;
      }
    }
  });
  debug(state, action, result);
  return result;
}
