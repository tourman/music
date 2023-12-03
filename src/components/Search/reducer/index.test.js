import { DEBOUNCE, QUERY, SUCCESS, ERROR } from './types';
import reducer from '.';

describe('Search: reducer', () => {
  const errors = {
    'query-a': new Error('Error for query-a'),
    'query-b': new Error('Error for query-b'),
  };
  const results = {
    'query-a': Object.assign(Array(2), { id: 'query-a' }),
    'query-b': Object.assign(Array(3), { id: 'query-b' }),
  };
  describe.each([
    {
      state: {
        display: {
          input: { value: 'query-a', status: 'loading' },
          result: { query: 'query-b', items: results['query-b'] },
          status: { loading: true },
          error: null,
        },
        network: { request: 'query-a' },
        timer: { debounce: null },
      },
      action: { type: QUERY, query: 'query-b' },
      expected: {
        display: {
          input: { value: 'query-b', status: 'idle' },
          result: { query: 'query-b', items: results['query-b'] },
          status: { loading: false },
          error: null,
        },
        network: { request: null },
        timer: { debounce: null },
      },
    },
    {
      state: {
        display: {
          input: { value: 'query-a', status: 'loading' },
          result: 'query-b',
          status: { loading: false },
          error: null,
        },
        network: { request: 'query-b' },
        timer: { debounce: 'query-a' },
      },
      action: {
        type: ERROR,
        error: errors['query-b'],
      },
      expected: {
        display: {
          input: { value: 'query-a', status: 'loading' },
          result: 'query-a',
          status: { loading: false },
          error: null,
        },
        network: { request: 'query-a' },
        timer: { debounce: null },
      },
    },
    {
      state: {
        display: {
          input: { value: 'query-a', status: 'idle' },
          result: { query: '', items: [] },
          status: { loading: false },
          error: null,
        },
        network: { request: null },
        timer: { debounce: 'query-a' },
      },
      action: { type: QUERY, query: '' },
      expected: {
        display: {
          input: { value: '', status: 'idle' },
          result: { query: '', items: [] },
          status: { loading: false },
          error: null,
        },
        network: { request: null },
        timer: { debounce: null },
      },
    },
    {
      state: {
        display: {
          input: { value: 'query-a', status: 'loading' },
          result: 'query-a',
          status: { loading: false },
          error: null,
        },
        network: { request: 'query-a' },
        timer: { debounce: null },
      },
      action: { type: QUERY, query: '' },
      expected: {
        display: {
          input: { value: '', status: 'idle' },
          result: { query: '', items: [] },
          status: { loading: false },
          error: null,
        },
        network: { request: null },
        timer: { debounce: null },
      },
    },
    {
      state: {
        display: {
          input: { value: 'query-a', status: 'loading' },
          result: { query: 'query-b', items: results['query-b'] },
          status: { loading: true },
          error: null,
        },
        network: { request: 'query-a' },
        timer: { debounce: null },
      },
      action: { type: SUCCESS, payload: [] },
      expected: {
        display: {
          input: { value: 'query-a', status: 'idle' },
          result: { query: 'query-a', items: [] },
          status: { loading: false },
          error: null,
        },
        network: { request: null },
        timer: { debounce: null },
      },
    },
    {
      state: {
        display: {
          input: { value: 'query-a', status: 'idle' },
          result: { query: 'query-b', items: results['query-b'] },
          status: { loading: false },
          error: null,
        },
        network: { request: null },
        timer: { debounce: 'query-a' },
      },
      action: { type: QUERY, query: '' },
      expected: {
        display: {
          input: { value: '', status: 'idle' },
          result: { query: '', items: [] },
          status: { loading: false },
          error: null,
        },
        network: { request: null },
        timer: { debounce: null },
      },
    },
    {
      state: {
        display: {
          input: { value: 'query-a', status: 'idle' },
          result: { query: 'query-a', items: results['query-a'] },
          status: { loading: false },
          error: null,
        },
        network: { request: null },
        timer: { debounce: null },
      },
      action: { type: QUERY, query: '' },
      expected: {
        display: {
          input: { value: '', status: 'idle' },
          result: { query: '', items: [] },
          status: { loading: false },
          error: null,
        },
        network: { request: null },
        timer: { debounce: null },
      },
    },
    {
      state: {
        display: {
          input: { value: 'query-a', status: 'error' },
          result: { query: 'query-a', items: [] },
          status: { loading: false },
          error: { query: 'query-a', instance: errors['query-a'] },
        },
        network: { request: null },
        timer: { debounce: null },
      },
      action: { type: QUERY, query: 'query-b' },
      expected: {
        display: {
          input: { value: 'query-b', status: 'error' },
          result: { query: 'query-a', items: [] },
          status: { loading: false },
          error: { query: 'query-a', instance: errors['query-a'] },
        },
        network: { request: null },
        timer: { debounce: 'query-b' },
      },
    },
    {
      state: {
        display: {
          input: { value: 'query-a', status: 'idle' },
          result: { query: '', items: [] },
          status: { loading: false },
          error: null,
        },
        network: { request: null },
        timer: { debounce: 'query-a' },
      },
      action: { type: DEBOUNCE },
      expected: {
        display: {
          input: { value: 'query-a', status: 'loading' },
          result: 'query-a',
          status: { loading: false },
          error: null,
        },
        network: { request: 'query-a' },
        timer: { debounce: null },
      },
    },
    {
      state: {
        display: {
          input: { value: 'query-a', status: 'loading' },
          result: 'query-b',
          status: { loading: false },
          error: null,
        },
        network: { request: 'query-b' },
        timer: { debounce: 'query-a' },
      },
      action: { type: DEBOUNCE },
      expected: {
        display: {
          input: { value: 'query-a', status: 'loading' },
          result: 'query-a',
          status: { loading: false },
          error: null,
        },
        network: { request: 'query-a' },
        timer: { debounce: null },
      },
    },
    {
      state: {
        display: {
          input: { value: 'query-a', status: 'loading' },
          result: 'query-b',
          status: { loading: false },
          error: null,
        },
        network: { request: 'query-b' },
        timer: { debounce: 'query-a' },
      },
      action: { type: SUCCESS, payload: results['query-b'] },
      expected: {
        display: {
          input: { value: 'query-a', status: 'loading' },
          result: 'query-a',
          status: { loading: false },
          error: null,
        },
        network: { request: 'query-a' },
        timer: { debounce: null },
      },
    },
    {
      state: {
        display: {
          input: { value: 'query-a', status: 'idle' },
          result: { query: '', items: [] },
          status: { loading: false },
          error: null,
        },
        network: { request: null },
        timer: { debounce: 'query-a' },
      },
      action: { type: QUERY, query: 'query-b' },
      expected: {
        display: {
          input: { value: 'query-b', status: 'idle' },
          result: { query: '', items: [] },
          status: { loading: false },
          error: null,
        },
        network: { request: null },
        timer: { debounce: 'query-b' },
      },
    },
    {
      state: {
        display: {
          input: { value: 'query-a', status: 'loading' },
          result: 'query-a',
          status: { loading: false },
          error: null,
        },
        network: { request: 'query-a' },
        timer: { debounce: null },
      },
      action: { type: QUERY, query: 'query-b' },
      expected: {
        display: {
          input: { value: 'query-b', status: 'loading' },
          result: 'query-a',
          status: { loading: false },
          error: null,
        },
        network: { request: 'query-a' },
        timer: { debounce: 'query-b' },
      },
    },
    {
      state: {
        display: {
          input: { value: 'query-a', status: 'idle' },
          result: { query: 'query-b', items: results['query-b'] },
          status: { loading: false },
          error: null,
        },
        network: { request: null },
        timer: { debounce: 'query-a' },
      },
      action: { type: DEBOUNCE },
      expected: {
        display: {
          input: { value: 'query-a', status: 'loading' },
          result: { query: 'query-b', items: results['query-b'] },
          status: { loading: true },
          error: null,
        },
        network: { request: 'query-a' },
        timer: { debounce: null },
      },
    },
    {
      state: {
        display: {
          input: { value: '', status: 'idle' },
          result: { query: '', items: [] },
          status: { loading: false },
          error: null,
        },
        network: { request: null },
        timer: { debounce: null },
      },
      action: { type: QUERY, query: 'query-a' },
      expected: {
        display: {
          input: { value: 'query-a', status: 'idle' },
          result: { query: '', items: [] },
          status: { loading: false },
          error: null,
        },
        network: { request: null },
        timer: { debounce: 'query-a' },
      },
    },
    {
      state: {
        display: {
          input: { value: 'query-a', status: 'loading' },
          result: 'query-b',
          status: { loading: false },
          error: null,
        },
        network: { request: 'query-b' },
        timer: { debounce: 'query-a' },
      },
      action: { type: SUCCESS, payload: [] },
      expected: {
        display: {
          input: { value: 'query-a', status: 'loading' },
          result: 'query-a',
          status: { loading: false },
          error: null,
        },
        network: { request: 'query-a' },
        timer: { debounce: null },
      },
    },
    {
      state: {
        display: {
          input: { value: 'query-a', status: 'loading' },
          result: { query: 'query-b', items: results['query-b'] },
          status: { loading: true },
          error: null,
        },
        network: { request: 'query-a' },
        timer: { debounce: null },
      },
      action: {
        type: ERROR,
        error: errors['query-a'],
      },
      expected: {
        display: {
          input: { value: 'query-a', status: 'error' },
          result: { query: 'query-b', items: results['query-b'] },
          status: { loading: false },
          error: { query: 'query-a', instance: errors['query-a'] },
        },
        network: { request: null },
        timer: { debounce: null },
      },
    },
    {
      state: {
        display: {
          input: { value: '', status: 'idle' },
          result: { query: '', items: [] },
          status: { loading: false },
          error: null,
        },
        network: { request: null },
        timer: { debounce: null },
      },
      action: { type: QUERY, query: 'query-b' },
      expected: {
        display: {
          input: { value: 'query-b', status: 'idle' },
          result: { query: '', items: [] },
          status: { loading: false },
          error: null,
        },
        network: { request: null },
        timer: { debounce: 'query-b' },
      },
    },
    {
      state: {
        display: {
          input: { value: 'query-a', status: 'loading' },
          result: { query: 'query-b', items: results['query-b'] },
          status: { loading: true },
          error: null,
        },
        network: { request: 'query-a' },
        timer: { debounce: null },
      },
      action: { type: QUERY, query: '' },
      expected: {
        display: {
          input: { value: '', status: 'idle' },
          result: { query: '', items: [] },
          status: { loading: false },
          error: null,
        },
        network: { request: null },
        timer: { debounce: null },
      },
    },
    {
      state: {
        display: {
          input: { value: 'query-a', status: 'loading' },
          result: 'query-b',
          status: { loading: false },
          error: null,
        },
        network: { request: 'query-b' },
        timer: { debounce: 'query-a' },
      },
      action: { type: QUERY, query: '' },
      expected: {
        display: {
          input: { value: '', status: 'idle' },
          result: { query: '', items: [] },
          status: { loading: false },
          error: null,
        },
        network: { request: null },
        timer: { debounce: null },
      },
    },
    {
      state: {
        display: {
          input: { value: 'query-a', status: 'loading' },
          result: { query: 'query-b', items: results['query-b'] },
          status: { loading: true },
          error: null,
        },
        network: { request: 'query-a' },
        timer: { debounce: null },
      },
      action: { type: SUCCESS, payload: results['query-a'] },
      expected: {
        display: {
          input: { value: 'query-a', status: 'idle' },
          result: { query: 'query-a', items: results['query-a'] },
          status: { loading: false },
          error: null,
        },
        network: { request: null },
        timer: { debounce: null },
      },
    },
    {
      state: {
        display: {
          input: { value: 'query-a', status: 'error' },
          result: { query: 'query-a', items: [] },
          status: { loading: false },
          error: { query: 'query-a', instance: errors['query-a'] },
        },
        network: { request: null },
        timer: { debounce: null },
      },
      action: { type: QUERY, query: '' },
      expected: {
        display: {
          input: { value: '', status: 'idle' },
          result: { query: '', items: [] },
          status: { loading: false },
          error: null,
        },
        network: { request: null },
        timer: { debounce: null },
      },
    },
    {
      state: {
        display: {
          input: { value: 'query-a', status: 'idle' },
          result: { query: 'query-a', items: results['query-a'] },
          status: { loading: false },
          error: null,
        },
        network: { request: null },
        timer: { debounce: null },
      },
      action: { type: QUERY, query: 'query-b' },
      expected: {
        display: {
          input: { value: 'query-b', status: 'idle' },
          result: { query: 'query-a', items: results['query-a'] },
          status: { loading: false },
          error: null,
        },
        network: { request: null },
        timer: { debounce: 'query-b' },
      },
    },
    {
      state: {
        display: {
          input: { value: 'query-a', status: 'error' },
          result: { query: '', items: [] },
          status: { loading: false },
          error: { query: 'query-b', instance: errors['query-b'] },
        },
        network: { request: null },
        timer: { debounce: 'query-a' },
      },
      action: { type: QUERY, query: '' },
      expected: {
        display: {
          input: { value: '', status: 'idle' },
          result: { query: '', items: [] },
          status: { loading: false },
          error: null,
        },
        network: { request: null },
        timer: { debounce: null },
      },
    },
    {
      state: {
        display: {
          input: { value: 'query-a', status: 'error' },
          result: { query: 'query-b', items: [] },
          status: { loading: false },
          error: { query: 'query-b', instance: errors['query-b'] },
        },
        network: { request: null },
        timer: { debounce: 'query-a' },
      },
      action: { type: QUERY, query: 'query-b' },
      expected: {
        display: {
          input: { value: 'query-b', status: 'error' },
          result: { query: 'query-b', items: [] },
          status: { loading: false },
          error: { query: 'query-b', instance: errors['query-b'] },
        },
        network: { request: null },
        timer: { debounce: null },
      },
    },
    {
      state: {
        display: {
          input: { value: 'query-a', status: 'loading' },
          result: 'query-a',
          status: { loading: false },
          error: null,
        },
        network: { request: 'query-a' },
        timer: { debounce: null },
      },
      action: {
        type: ERROR,
        error: errors['query-a'],
      },
      expected: {
        display: {
          input: { value: 'query-a', status: 'error' },
          result: { query: 'query-a', items: [] },
          status: { loading: false },
          error: { query: 'query-a', instance: errors['query-a'] },
        },
        network: { request: null },
        timer: { debounce: null },
      },
    },
    {
      state: {
        display: {
          input: { value: 'query-a', status: 'error' },
          result: { query: '', items: [] },
          status: { loading: false },
          error: { query: 'query-b', instance: errors['query-b'] },
        },
        network: { request: null },
        timer: { debounce: 'query-a' },
      },
      action: { type: DEBOUNCE },
      expected: {
        display: {
          input: { value: 'query-a', status: 'loading' },
          result: 'query-a',
          status: { loading: false },
          error: null,
        },
        network: { request: 'query-a' },
        timer: { debounce: null },
      },
    },
  ])('%#', ({ action, state, expected, prop }) => {
    (prop ? it[prop] : it)('should return the expected state', () => {
      expect(reducer(state, action)).toEqual(expected);
    });
  });
});
