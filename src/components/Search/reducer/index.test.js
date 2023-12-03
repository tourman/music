import { DEBOUNCE, QUERY, SUCCESS, ERROR } from './types';
import reducer from '.';

describe('Search: reducer', () => {
  const errors = {
    'query-a': new Error('Error for query-a'),
    'query-b': new Error('Error for query-b'),
  };
  const emptyArray = [];
  const results = {
    'query-a': Object.assign(Array(2), { id: 'query-a' }),
    'query-b': Object.assign(Array(3), { id: 'query-b' }),
  };
  describe.each([
    {
      state: {
        inner: {
          results: {
            'query-b': results['query-b'],
          },
          errors: {},
        },
        display: {
          input: { value: 'query-a', status: 'loading' },
          result: results['query-b'],
          status: { loading: true },
          error: null,
        },
        network: { request: 'query-a' },
        timer: { debounce: null },
      },
      action: { type: QUERY, query: 'query-b' },
      expected: {
        inner: {
          results: {
            'query-b': results['query-b'],
          },
          errors: {},
        },
        display: {
          input: { value: 'query-b', status: 'idle' },
          result: results['query-b'],
          status: { loading: false },
          error: null,
        },
        network: { request: null },
        timer: { debounce: null },
      },
    },
    {
      state: {
        inner: { results: {}, errors: {} },
        display: {
          input: { value: 'query-a', status: 'loading' },
          result: 'skeleton',
          status: { loading: false },
          error: null,
        },
        network: { request: 'query-b' },
        timer: { debounce: 'query-a' },
      },
      action: { type: ERROR, error: errors['query-b'] },
      expected: {
        inner: { results: {}, errors: { 'query-b': errors['query-b'] } },
        display: {
          input: { value: 'query-a', status: 'loading' },
          result: 'skeleton',
          status: { loading: false },
          error: null,
        },
        network: { request: 'query-a' },
        timer: { debounce: null },
      },
    },
    {
      state: {
        inner: { results: {}, errors: {} },
        display: {
          input: { value: 'query-a', status: 'idle' },
          result: emptyArray,
          status: { loading: false },
          error: null,
        },
        network: { request: null },
        timer: { debounce: 'query-a' },
      },
      action: { type: QUERY, query: '' },
      expected: {
        inner: { results: {}, errors: {} },
        display: {
          input: { value: '', status: 'idle' },
          result: emptyArray,
          status: { loading: false },
          error: null,
        },
        network: { request: null },
        timer: { debounce: null },
      },
    },
    {
      state: {
        inner: { results: {}, errors: {} },
        display: {
          input: { value: 'query-a', status: 'loading' },
          result: 'skeleton',
          status: { loading: false },
          error: null,
        },
        network: { request: 'query-a' },
        timer: { debounce: null },
      },
      action: { type: QUERY, query: '' },
      expected: {
        inner: { results: {}, errors: {} },
        display: {
          input: { value: '', status: 'idle' },
          result: [],
          status: { loading: false },
          error: null,
        },
        network: { request: null },
        timer: { debounce: null },
      },
    },
    {
      state: {
        inner: {
          results: {
            'query-b': results['query-b'],
          },
          errors: {},
        },
        display: {
          input: { value: 'query-a', status: 'loading' },
          result: results['query-b'],
          status: { loading: true },
          error: null,
        },
        network: { request: 'query-a' },
        timer: { debounce: null },
      },
      action: { type: SUCCESS, payload: emptyArray },
      expected: {
        inner: {
          results: {
            'query-a': emptyArray,
          },
          errors: {},
        },
        display: {
          input: { value: 'query-a', status: 'idle' },
          result: emptyArray,
          status: { loading: false },
          error: null,
        },
        network: { request: null },
        timer: { debounce: null },
      },
    },
    {
      state: {
        inner: {
          results: {
            'query-b': results['query-b'],
          },
          errors: {},
        },
        display: {
          input: { value: 'query-a', status: 'idle' },
          result: results['query-b'],
          status: { loading: false },
          error: null,
        },
        network: { request: null },
        timer: { debounce: 'query-a' },
      },
      action: { type: QUERY, query: '' },
      expected: {
        inner: { results: {}, errors: {} },
        display: {
          input: { value: '', status: 'idle' },
          result: [],
          status: { loading: false },
          error: null,
        },
        network: { request: null },
        timer: { debounce: null },
      },
    },
    {
      state: {
        inner: {
          results: {
            'query-a': results['query-a'],
          },
          errors: {},
        },
        display: {
          input: { value: 'query-a', status: 'idle' },
          result: results['query-a'],
          status: { loading: false },
          error: null,
        },
        network: { request: null },
        timer: { debounce: null },
      },
      action: { type: QUERY, query: '' },
      expected: {
        inner: { results: {}, errors: {} },
        display: {
          input: { value: '', status: 'idle' },
          result: [],
          status: { loading: false },
          error: null,
        },
        network: { request: null },
        timer: { debounce: null },
      },
    },
    {
      state: {
        inner: { results: {}, errors: { 'query-a': errors['query-a'] } },
        display: {
          input: { value: 'query-a', status: 'error' },
          result: emptyArray,
          status: { loading: false },
          error: errors['query-a'],
        },
        network: { request: null },
        timer: { debounce: null },
      },
      action: { type: QUERY, query: 'query-b' },
      expected: {
        inner: { results: {}, errors: { 'query-a': errors['query-a'] } },
        display: {
          input: { value: 'query-b', status: 'error' },
          result: emptyArray,
          status: { loading: false },
          error: errors['query-a'],
        },
        network: { request: null },
        timer: { debounce: 'query-b' },
      },
    },
    {
      state: {
        inner: { results: {}, errors: {} },
        display: {
          input: { value: 'query-a', status: 'idle' },
          result: [],
          status: { loading: false },
          error: null,
        },
        network: { request: null },
        timer: { debounce: 'query-a' },
      },
      action: { type: DEBOUNCE },
      expected: {
        inner: { results: {}, errors: {} },
        display: {
          input: { value: 'query-a', status: 'loading' },
          result: 'skeleton',
          status: { loading: false },
          error: null,
        },
        network: { request: 'query-a' },
        timer: { debounce: null },
      },
    },
    {
      state: {
        inner: { results: {}, errors: {} },
        display: {
          input: { value: 'query-a', status: 'loading' },
          result: 'skeleton',
          status: { loading: false },
          error: null,
        },
        network: { request: 'query-b' },
        timer: { debounce: 'query-a' },
      },
      action: { type: DEBOUNCE },
      expected: {
        inner: { results: {}, errors: {} },
        display: {
          input: { value: 'query-a', status: 'loading' },
          result: 'skeleton',
          status: { loading: false },
          error: null,
        },
        network: { request: 'query-a' },
        timer: { debounce: null },
      },
    },
    {
      state: {
        inner: { results: {}, errors: {} },
        display: {
          input: { value: 'query-a', status: 'loading' },
          result: 'skeleton',
          status: { loading: false },
          error: null,
        },
        network: { request: 'query-b' },
        timer: { debounce: 'query-a' },
      },
      action: { type: SUCCESS, payload: results['query-b'] },
      expected: {
        inner: {
          results: {
            'query-b': results['query-b'],
          },
          errors: {},
        },
        display: {
          input: { value: 'query-a', status: 'loading' },
          result: 'skeleton',
          status: { loading: false },
          error: null,
        },
        network: { request: 'query-a' },
        timer: { debounce: null },
      },
    },
    {
      state: {
        inner: { results: {}, errors: {} },
        display: {
          input: { value: 'query-a', status: 'idle' },
          result: emptyArray,
          status: { loading: false },
          error: null,
        },
        network: { request: null },
        timer: { debounce: 'query-a' },
      },
      action: { type: QUERY, query: 'query-b' },
      expected: {
        inner: { results: {}, errors: {} },
        display: {
          input: { value: 'query-b', status: 'idle' },
          result: emptyArray,
          status: { loading: false },
          error: null,
        },
        network: { request: null },
        timer: { debounce: 'query-b' },
      },
    },
    {
      state: {
        inner: { results: {}, errors: {} },
        display: {
          input: { value: 'query-a', status: 'loading' },
          result: 'skeleton',
          status: { loading: false },
          error: null,
        },
        network: { request: 'query-a' },
        timer: { debounce: null },
      },
      action: { type: QUERY, query: 'query-b' },
      expected: {
        inner: { results: {}, errors: {} },
        display: {
          input: { value: 'query-b', status: 'loading' },
          result: 'skeleton',
          status: { loading: false },
          error: null,
        },
        network: { request: 'query-a' },
        timer: { debounce: 'query-b' },
      },
    },
    {
      state: {
        inner: {
          results: {
            'query-b': results['query-b'],
          },
          errors: {},
        },
        display: {
          input: { value: 'query-a', status: 'idle' },
          result: results['query-b'],
          status: { loading: false },
          error: null,
        },
        network: { request: null },
        timer: { debounce: 'query-a' },
      },
      action: { type: DEBOUNCE },
      expected: {
        inner: {
          results: {
            'query-b': results['query-b'],
          },
          errors: {},
        },
        display: {
          input: { value: 'query-a', status: 'loading' },
          result: results['query-b'],
          status: { loading: true },
          error: null,
        },
        network: { request: 'query-a' },
        timer: { debounce: null },
      },
    },
    {
      state: {
        inner: { results: {}, errors: {} },
        display: {
          input: { value: '', status: 'idle' },
          result: emptyArray,
          status: { loading: false },
          error: null,
        },
        network: { request: null },
        timer: { debounce: null },
      },
      action: { type: QUERY, query: 'query-a' },
      expected: {
        inner: { results: {}, errors: {} },
        display: {
          input: { value: 'query-a', status: 'idle' },
          result: emptyArray,
          status: { loading: false },
          error: null,
        },
        network: { request: null },
        timer: { debounce: 'query-a' },
      },
    },
    {
      state: {
        inner: { results: {}, errors: {} },
        display: {
          input: { value: 'query-a', status: 'loading' },
          result: 'skeleton',
          status: { loading: false },
          error: null,
        },
        network: { request: 'query-b' },
        timer: { debounce: 'query-a' },
      },
      action: { type: SUCCESS, payload: emptyArray },
      expected: {
        inner: {
          results: {
            'query-b': emptyArray,
          },
          errors: {},
        },
        display: {
          input: { value: 'query-a', status: 'loading' },
          result: 'skeleton',
          status: { loading: false },
          error: null,
        },
        network: { request: 'query-a' },
        timer: { debounce: null },
      },
    },
    {
      state: {
        inner: {
          results: {
            'query-b': results['query-b'],
          },
          errors: {},
        },
        display: {
          input: { value: 'query-a', status: 'loading' },
          result: results['query-b'],
          status: { loading: true },
          error: null,
        },
        network: { request: 'query-a' },
        timer: { debounce: null },
      },
      action: { type: ERROR, error: errors['query-a'] },
      expected: {
        inner: {
          results: {
            'query-b': results['query-b'],
          },
          errors: {
            'query-a': errors['query-a'],
          },
        },
        display: {
          input: { value: 'query-a', status: 'error' },
          result: results['query-b'],
          status: { loading: false },
          error: errors['query-a'],
        },
        network: { request: null },
        timer: { debounce: null },
      },
    },
    {
      state: {
        inner: { results: {}, errors: {} },
        display: {
          input: { value: '', status: 'idle' },
          result: emptyArray,
          status: { loading: false },
          error: null,
        },
        network: { request: null },
        timer: { debounce: null },
      },
      action: { type: QUERY, query: 'query-b' },
      expected: {
        inner: { results: {}, errors: {} },
        display: {
          input: { value: 'query-b', status: 'idle' },
          result: emptyArray,
          status: { loading: false },
          error: null,
        },
        network: { request: null },
        timer: { debounce: 'query-b' },
      },
    },
    {
      state: {
        inner: {
          results: {
            'query-b': results['query-b'],
          },
          errors: {},
        },
        display: {
          input: { value: 'query-a', status: 'loading' },
          result: results['query-b'],
          status: { loading: true },
          error: null,
        },
        network: { request: 'query-a' },
        timer: { debounce: null },
      },
      action: { type: QUERY, query: '' },
      expected: {
        inner: { results: {}, errors: {} },
        display: {
          input: { value: '', status: 'idle' },
          result: [],
          status: { loading: false },
          error: null,
        },
        network: { request: null },
        timer: { debounce: null },
      },
    },
    {
      state: {
        inner: { results: {}, errors: {} },
        display: {
          input: { value: 'query-a', status: 'loading' },
          result: 'skeleton',
          status: { loading: false },
          error: null,
        },
        network: { request: 'query-b' },
        timer: { debounce: 'query-a' },
      },
      action: { type: QUERY, query: '' },
      expected: {
        inner: { results: {}, errors: {} },
        display: {
          input: { value: '', status: 'idle' },
          result: [],
          status: { loading: false },
          error: null,
        },
        network: { request: null },
        timer: { debounce: null },
      },
    },
    {
      state: {
        inner: {
          results: {
            'query-b': results['query-b'],
          },
          errors: {},
        },
        display: {
          input: { value: 'query-a', status: 'loading' },
          result: results['query-b'],
          status: { loading: true },
          error: null,
        },
        network: { request: 'query-a' },
        timer: { debounce: null },
      },
      action: { type: SUCCESS, payload: results['query-a'] },
      expected: {
        inner: {
          results: {
            'query-a': results['query-a'],
          },
          errors: {},
        },
        display: {
          input: { value: 'query-a', status: 'idle' },
          result: results['query-a'],
          status: { loading: false },
          error: null,
        },
        network: { request: null },
        timer: { debounce: null },
      },
    },
    {
      state: {
        inner: {
          results: {},
          errors: {
            'query-a': errors['query-a'],
          },
        },
        display: {
          input: { value: 'query-a', status: 'error' },
          result: emptyArray,
          status: { loading: false },
          error: errors['query-a'],
        },
        network: { request: null },
        timer: { debounce: null },
      },
      action: { type: QUERY, query: '' },
      expected: {
        inner: { results: {}, errors: {} },
        display: {
          input: { value: '', status: 'idle' },
          result: emptyArray,
          status: { loading: false },
          error: null,
        },
        network: { request: null },
        timer: { debounce: null },
      },
    },
    {
      state: {
        inner: {
          results: {
            'query-a': results['query-a'],
          },
          errors: {},
        },
        display: {
          input: { value: 'query-a', status: 'idle' },
          result: results['query-a'],
          status: { loading: false },
          error: null,
        },
        network: { request: null },
        timer: { debounce: null },
      },
      action: { type: QUERY, query: 'query-b' },
      expected: {
        inner: {
          results: {
            'query-a': results['query-a'],
          },
          errors: {},
        },
        display: {
          input: { value: 'query-b', status: 'idle' },
          result: results['query-a'],
          status: { loading: false },
          error: null,
        },
        network: { request: null },
        timer: { debounce: 'query-b' },
      },
    },
    {
      state: {
        inner: {
          results: {},
          errors: {
            'query-b': errors['query-b'],
          },
        },
        display: {
          input: { value: 'query-a', status: 'error' },
          result: emptyArray,
          status: { loading: false },
          error: errors['query-b'],
        },
        network: { request: null },
        timer: { debounce: 'query-a' },
      },
      action: { type: QUERY, query: '' },
      expected: {
        inner: { results: {}, errors: {} },
        display: {
          input: { value: '', status: 'idle' },
          result: emptyArray,
          status: { loading: false },
          error: null,
        },
        network: { request: null },
        timer: { debounce: null },
      },
    },
    {
      state: {
        inner: {
          results: {},
          errors: {
            'query-b': errors['query-b'],
          },
        },
        display: {
          input: { value: 'query-a', status: 'error' },
          result: emptyArray,
          status: { loading: false },
          error: errors['query-b'],
        },
        network: { request: null },
        timer: { debounce: 'query-a' },
      },
      action: { type: QUERY, query: 'query-b' },
      expected: {
        inner: {
          results: {},
          errors: {
            'query-b': errors['query-b'],
          },
        },
        display: {
          input: { value: 'query-b', status: 'error' },
          result: emptyArray,
          status: { loading: false },
          error: errors['query-b'],
        },
        network: { request: null },
        timer: { debounce: null },
      },
    },
    {
      state: {
        inner: {
          results: {},
          errors: {},
        },
        display: {
          input: { value: 'query-a', status: 'loading' },
          result: 'skeleton',
          status: { loading: false },
          error: null,
        },
        network: { request: 'query-a' },
        timer: { debounce: null },
      },
      action: { type: ERROR, error: errors['query-a'] },
      expected: {
        inner: {
          results: {},
          errors: {
            'query-a': errors['query-a'],
          },
        },
        display: {
          input: { value: 'query-a', status: 'error' },
          result: [],
          status: { loading: false },
          error: errors['query-a'],
        },
        network: { request: null },
        timer: { debounce: null },
      },
    },
    {
      state: {
        inner: {
          results: {},
          errors: {
            'query-b': errors['query-b'],
          },
        },
        display: {
          input: { value: 'query-a', status: 'error' },
          result: [],
          status: { loading: false },
          error: errors['query-b'],
        },
        network: { request: null },
        timer: { debounce: 'query-a' },
      },
      action: { type: DEBOUNCE },
      expected: {
        inner: {
          results: {},
          errors: {
            'query-b': errors['query-b'],
          },
        },
        display: {
          input: { value: 'query-a', status: 'loading' },
          result: 'skeleton',
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
