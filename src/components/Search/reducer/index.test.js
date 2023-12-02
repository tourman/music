import { DEBOUNCE, QUERY } from './types';
import reducer from '.';

describe('Search: reducer', () => {
  describe.each([
    {
      state: {
        display: {
          input: { value: 'query-a', status: 'loading' },
          result: 'query-b',
          status: { loading: true },
          error: false,
        },
        network: { request: 'query-a' },
        timer: { debounce: null },
      },
      action: { type: 'QUERY', query: 'query-b' },
      expected: {
        display: {
          input: { value: 'query-b', status: 'idle' },
          result: 'query-b',
          status: { loading: false },
          error: false,
        },
        network: { request: null },
        timer: { debounce: null },
      },
    },
    {
      state: {
        display: {
          input: { value: 'query-a', status: 'loading' },
          result: 'skeleton',
          status: { loading: false },
          error: false,
        },
        network: { request: 'query-b' },
        timer: { debounce: 'query-a' },
      },
      action: { type: 'ERROR' },
      expected: {
        display: {
          input: { value: 'query-a', status: 'loading' },
          result: 'skeleton',
          status: { loading: false },
          error: false,
        },
        network: { request: 'query-a' },
        timer: { debounce: null },
      },
    },
    {
      state: {
        display: {
          input: { value: 'query-a', status: 'idle' },
          result: '',
          status: { loading: false },
          error: false,
        },
        network: { request: null },
        timer: { debounce: 'query-a' },
      },
      action: { type: 'QUERY', query: '' },
      expected: {
        display: {
          input: { value: '', status: 'idle' },
          result: '',
          status: { loading: false },
          error: false,
        },
        network: { request: null },
        timer: { debounce: null },
      },
    },
    {
      state: {
        display: {
          input: { value: 'query-a', status: 'loading' },
          result: 'skeleton',
          status: { loading: false },
          error: false,
        },
        network: { request: 'query-a' },
        timer: { debounce: null },
      },
      action: { type: 'QUERY', query: '' },
      expected: {
        display: {
          input: { value: '', status: 'idle' },
          result: '',
          status: { loading: false },
          error: false,
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
          status: { loading: true },
          error: false,
        },
        network: { request: 'query-a' },
        timer: { debounce: null },
      },
      action: { type: 'SUCCESS', payload: '' },
      expected: {
        display: {
          input: { value: 'query-a', status: 'idle' },
          result: 'query-a',
          status: { loading: false },
          error: false,
        },
        network: { request: null },
        timer: { debounce: null },
      },
    },
    {
      state: {
        display: {
          input: { value: 'query-a', status: 'idle' },
          result: 'query-b',
          status: { loading: false },
          error: false,
        },
        network: { request: null },
        timer: { debounce: 'query-a' },
      },
      action: { type: 'QUERY', query: '' },
      expected: {
        display: {
          input: { value: '', status: 'idle' },
          result: '',
          status: { loading: false },
          error: false,
        },
        network: { request: null },
        timer: { debounce: null },
      },
    },
    {
      state: {
        display: {
          input: { value: 'query-a', status: 'idle' },
          result: 'query-a',
          status: { loading: false },
          error: false,
        },
        network: { request: null },
        timer: { debounce: null },
      },
      action: { type: 'QUERY', query: '' },
      expected: {
        display: {
          input: { value: '', status: 'idle' },
          result: '',
          status: { loading: false },
          error: false,
        },
        network: { request: null },
        timer: { debounce: null },
      },
    },
    {
      state: {
        display: {
          input: { value: 'query-a', status: 'error' },
          result: '',
          status: { loading: false },
          error: true,
        },
        network: { request: null },
        timer: { debounce: null },
      },
      action: { type: 'QUERY', query: 'query-b' },
      expected: {
        display: {
          input: { value: 'query-b', status: 'error' },
          result: 'query-b',
          status: { loading: false },
          error: false,
        },
        network: { request: null },
        timer: { debounce: null },
      },
    },
    {
      state: {
        display: {
          input: { value: 'query-a', status: 'idle' },
          result: '',
          status: { loading: false },
          error: false,
        },
        network: { request: null },
        timer: { debounce: 'query-a' },
      },
      action: { type: 'DEBOUNCE' },
    },
    {
      state: {
        display: {
          input: { value: 'query-a', status: 'loading' },
          result: 'skeleton',
          status: { loading: false },
          error: false,
        },
        network: { request: 'query-b' },
        timer: { debounce: 'query-a' },
      },
      action: { type: 'DEBOUNCE' },
    },
    {
      state: {
        display: {
          input: { value: 'query-a', status: 'loading' },
          result: 'skeleton',
          status: { loading: false },
          error: false,
        },
        network: { request: 'query-b' },
        timer: { debounce: 'query-a' },
      },
      action: { type: 'SUCCESS', payload: 'full' },
    },
    {
      state: {
        display: {
          input: { value: 'query-a', status: 'idle' },
          result: '',
          status: { loading: false },
          error: false,
        },
        network: { request: null },
        timer: { debounce: 'query-a' },
      },
      action: { type: 'QUERY', query: 'query-b' },
    },
    {
      state: {
        display: {
          input: { value: 'query-a', status: 'loading' },
          result: 'skeleton',
          status: { loading: false },
          error: false,
        },
        network: { request: 'query-a' },
        timer: { debounce: null },
      },
      action: { type: 'QUERY', query: 'query-b' },
    },
    {
      state: {
        display: {
          input: { value: 'query-a', status: 'idle' },
          result: 'query-b',
          status: { loading: false },
          error: false,
        },
        network: { request: null },
        timer: { debounce: 'query-a' },
      },
      action: { type: 'DEBOUNCE' },
    },
    {
      state: {
        display: {
          input: { value: '', status: 'idle' },
          result: '',
          status: { loading: false },
          error: false,
        },
        network: { request: null },
        timer: { debounce: null },
      },
      action: { type: 'QUERY', query: 'query-a' },
    },
    {
      state: {
        display: {
          input: { value: 'query-a', status: 'loading' },
          result: 'skeleton',
          status: { loading: false },
          error: false,
        },
        network: { request: 'query-b' },
        timer: { debounce: 'query-a' },
      },
      action: { type: 'SUCCESS', payload: '' },
    },
    {
      state: {
        display: {
          input: { value: 'query-a', status: 'loading' },
          result: 'query-b',
          status: { loading: true },
          error: false,
        },
        network: { request: 'query-a' },
        timer: { debounce: null },
      },
      action: { type: 'ERROR' },
    },
    {
      state: {
        display: {
          input: { value: '', status: 'idle' },
          result: '',
          status: { loading: false },
          error: false,
        },
        network: { request: null },
        timer: { debounce: null },
      },
      action: { type: 'QUERY', query: 'query-b' },
    },
    {
      state: {
        display: {
          input: { value: 'query-a', status: 'loading' },
          result: 'query-b',
          status: { loading: true },
          error: false,
        },
        network: { request: 'query-a' },
        timer: { debounce: null },
      },
      action: { type: 'QUERY', query: '' },
    },
    {
      state: {
        display: {
          input: { value: 'query-a', status: 'loading' },
          result: 'skeleton',
          status: { loading: false },
          error: false,
        },
        network: { request: 'query-b' },
        timer: { debounce: 'query-a' },
      },
      action: { type: 'QUERY', query: '' },
    },
    {
      state: {
        display: {
          input: { value: 'query-a', status: 'loading' },
          result: 'query-b',
          status: { loading: true },
          error: false,
        },
        network: { request: 'query-a' },
        timer: { debounce: null },
      },
      action: { type: 'SUCCESS', payload: 'full' },
    },
    {
      state: {
        display: {
          input: { value: 'query-a', status: 'error' },
          result: '',
          status: { loading: false },
          error: true,
        },
        network: { request: null },
        timer: { debounce: null },
      },
      action: { type: 'QUERY', query: '' },
    },
    {
      state: {
        display: {
          input: { value: 'query-a', status: 'idle' },
          result: 'query-a',
          status: { loading: false },
          error: false,
        },
        network: { request: null },
        timer: { debounce: null },
      },
      action: { type: 'QUERY', query: 'query-b' },
    },
  ])('%#', ({ action, state, expected }) => {
    it('should return the expected state', () => {
      expect(reducer(state, action)).toEqual(expected);
    });
  });
});
