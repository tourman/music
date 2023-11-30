import {
  Icon,
  Input,
  Item,
  Label,
  Loader,
  Message,
  Segment,
} from 'semantic-ui-react';
import { Component, Suspense, useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

function use(promise) {
  if (promise.status === 'fulfilled') {
    console.log('returning value');
    return promise.value;
  } else if (promise.status === 'rejected') {
    console.log('throwing error');
    throw promise.reason;
  } else if (promise.status === 'pending') {
    console.log('throwing promise');
    throw promise;
  } else {
    promise.status = 'pending';
    promise.then(
      result => {
        promise.status = 'fulfilled';
        promise.value = result;
      },
      reason => {
        promise.status = 'rejected';
        promise.reason = reason;
      },
    );
    console.log('throwing promise after preparation');
    throw promise;
  }
}

function Fallback() {
  return (
    <Item.Group>
      {Array.from({ length: 3 }).map((_, index) => (
        <Item key={index}>
          <Item.Image
            size="small"
            src="https://react.semantic-ui.com/images/wireframe/white-image.png"
          />

          <Item.Content>
            <Item.Header></Item.Header>
            <Item.Meta>
              <Loader active inline size="tiny" />
            </Item.Meta>
            <Item.Description>
              <Loader active inline size="tiny" />
            </Item.Description>
          </Item.Content>
        </Item>
      ))}
    </Item.Group>
  );
}

function memoize(fn) {
  const cache = new Map();
  return (...args) => {
    const key = args[0];
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}

const search = memoize(query => {
  console.log('searching for', query);
  if (!query) {
    return Promise.resolve([]);
  }
  const url = `https://deezerdevs-deezer.p.rapidapi.com/search?q=${encodeURIComponent(
    query,
  )}`;
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': '9RysH7lHemmshhL3ECAxHVJB6vn6p1iEaAXjsn7SLMrdjjy6RM',
      'X-RapidAPI-Host': 'deezerdevs-deezer.p.rapidapi.com',
    },
  };
  // why is it called constantly?
  console.log('returning fetch');
  return fetch(url, options)
    .then(response => response.json())
    .then(({ data }) => data)
    .then(
      //   data => new Promise(resolve => setTimeout(() => resolve(data), 1000)),
      () => Promise.reject('test error'),
    );
});

function ErrorMessage({ error }) {
  //   if (typeof error === 'undefined') {
  //     console.error('error is undefined');
  //     throw new Error('UNDEFINED');
  //   }
  console.log('Error', typeof error);
  return (
    <Message error>
      <Message.Header>
        There was some errors with your submission
      </Message.Header>
      <p>{error.toString()}</p>
    </Message>
  );
}

ErrorMessage.propTypes = {
  error: PropTypes.instanceOf(Error),
};

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    console.error('getDerivedStateFromError', error);
    return {
      error:
        error &&
        (error instanceof Error ? error : new Error('Something went wrong')),
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error('catching error', error, errorInfo);
  }

  render() {
    const { error } = this.state;
    const { children } = this.props;
    console.log('render', { error });
    if (!error) {
      console.log('return children');
      return children;
    }
    console.log('return Error');
    return <ErrorMessage error={error} />;
  }
}

function Result({ query }) {
  const response = use(search(query));
  console.log({ query, response });
  return (
    <Item.Group>
      {response.map(({ id, title, artist, album, duration }) => (
        <Item key={id}>
          <Item.Image size="small" src={album.cover_medium} />
          <Item.Content>
            <Item.Header>
              {artist.name} &mdash; {title}
            </Item.Header>
            <Item.Meta>
              <Icon name="step forward" /> {duration}
            </Item.Meta>
            <Item.Description>
              <Icon name="dot circle" />
              {album.title}
            </Item.Description>
            <Item.Extra>
              <Label as="a" icon="play" content="Play sample" />
            </Item.Extra>
          </Item.Content>
        </Item>
      ))}
      <Item>
        <Item.Image
          size="small"
          src="https://react.semantic-ui.com/images/avatar/large/jenny.jpg"
        />

        <Item.Content>
          <Item.Header>
            {/* <Icon name="like" /> */}
            Veronika Ossi &mdash; Best Friends
          </Item.Header>
          <Item.Meta>
            <Icon name="step forward" /> 03:45
          </Item.Meta>
          <Item.Description>
            <Icon name="dot circle" />
            Another description
          </Item.Description>
          <Item.Extra>
            <Label as="a" icon="play" content="Play sample" />
          </Item.Extra>
        </Item.Content>
      </Item>
    </Item.Group>
  );
}

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handle = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handle);
  }, [value, delay]);
  return debouncedValue;
}

export default function Search() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);
  const handleChange = useCallback(
    event => {
      setQuery(event.target.value);
    },
    [setQuery],
  );
  console.log({ query, debouncedQuery });
  return (
    <Segment>
      <Input
        loading
        fluid
        icon="music"
        placeholder="Search for vibes..."
        onChange={handleChange}
      />

      <ErrorBoundary>
        <Suspense fallback={<Fallback />}>
          <Result query={debouncedQuery} />
        </Suspense>
      </ErrorBoundary>
    </Segment>
  );
}
