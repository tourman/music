import { useCallback, useEffect, useReducer } from 'react';
import View from './View';
import reducer from './reducer';
import { DEBOUNCE, ERROR, QUERY, SUCCESS } from './reducer/types';
import PropTypes from 'prop-types';

export default function Search({ debounce, request, cache }) {
  const [state, dispatch] = useReducer(reducer, {
    cache: cache.get(),
    display: {
      input: { value: '', status: 'idle' },
      result: { query: '', items: [] },
      status: { loading: false },
      error: null,
    },
    network: { request: null },
    timer: { debounce: null },
  });
  const { display } = state;
  const {
    input: { value, status: inputStatus },
    result,
    status: { loading },
    error,
  } = display;
  const onChange = useCallback(
    ({ target: { value } }) => dispatch({ type: QUERY, query: value }),
    [],
  );

  const {
    timer: { debounce: debouncedValue },
  } = state;
  useEffect(() => {
    if (!debouncedValue) {
      debounce(() => {});
      return () => {};
    }
    debounce(() => dispatch({ type: DEBOUNCE }));
    return () => debounce(() => {});
  }, [debounce, debouncedValue]);

  const {
    network: { request: query },
  } = state;
  useEffect(() => {
    if (!query) {
      request();
      return () => {};
    }
    request(
      query,
      data => dispatch({ type: SUCCESS, payload: data }),
      error => {
        // eslint-disable-next-line no-console
        console.error(error);
        dispatch({ type: ERROR, error });
      },
    );
    return () => request();
  }, [request, query]);

  const { cache: cacheValue } = state;
  useEffect(() => {
    cache.set(cacheValue);
  }, [cache, cacheValue]);

  return (
    <View
      {...{
        value,
        inputStatus,
        result,
        loading,
        error,
        onChange,
      }}
    />
  );
}

Search.propTypes = {
  debounce: PropTypes.func,
  request: PropTypes.func,
};

Search.defaultProps = {
  debounce: (() => {
    let timer;
    return callback => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        callback();
      }, 500);
    };
  })(),
  request: (() => {
    let currentQuery;
    /**
     * https://rapidapi.com/deezerdevs/api/deezer-1
     */
    return (query, onSuccess = () => {}, onError = () => {}) => {
      currentQuery = query;
      if (!query) {
        return onSuccess([]);
      }
      const url = `https://deezerdevs-deezer.p.rapidapi.com/search?q=${encodeURIComponent(
        query,
      )}`;
      const options = {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key':
            '9RysH7lHemmshhL3ECAxHVJB6vn6p1iEaAXjsn7SLMrdjjy6RM',
          'X-RapidAPI-Host': 'deezerdevs-deezer.p.rapidapi.com',
        },
      };
      Promise.resolve()
        .then(
          () =>
            new Promise(resolve =>
              setTimeout(
                resolve,
                process.env.NODE_ENV === 'development' ? 1000 : 0,
              ),
            ),
        )
        .then(() => fetch(url, options))
        .then(response => response.json())
        .then(({ data }) => data)
        .then(
          data => {
            if (currentQuery !== query) {
              return;
            }
            onSuccess(data);
          },
          error => {
            if (currentQuery !== query) {
              return;
            }
            onError(error);
          },
        );
    };
  })(),
  cache: ((cacheKey = 'cache') => {
    return {
      get: () => {
        try {
          return JSON.parse(localStorage.getItem(cacheKey)) || {};
        } catch (error) {
          return {};
        }
      },
      set: value => {
        requestIdleCallback(() => {
          try {
            localStorage.setItem(cacheKey, JSON.stringify(value));
          } catch (error) {}
        });
      },
    };
  })(),
};
