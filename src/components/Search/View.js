import {
  Dimmer,
  Icon,
  Input,
  Item,
  Label,
  Loader,
  Message,
  Segment,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { memo } from 'react';

function Fallback({ query }) {
  return (
    <>
      <Message info>Looking for "{query}"...</Message>
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
    </>
  );
}

function ErrorMessage({ query, instance }) {
  return (
    <Message error>
      <Message.Header>
        There was an error while searching for "{query}"
      </Message.Header>
      <p>{instance.toString()}</p>
    </Message>
  );
}

// eslint-disable-next-line no-unused-vars
function defaultItem() {
  return (
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
  );
}

function transformInt(int) {
  return int < 10 ? `0${int}` : `${int}`;
}

function transformDuration(duration) {
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;
  return `${transformInt(minutes)}:${transformInt(seconds)}`;
}

function shallowEqual(obj1, obj2) {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  if (keys1.length !== keys2.length) {
    return false;
  }
  for (const key of keys1) {
    if (obj1[key] !== obj2[key]) {
      return false;
    }
  }
  return true;
}

const Memo = memo(
  function Memo({ children, ...props }) {
    return children(props);
  },
  ({ children: nullA, ...prev }, { children: nullB, ...next }) => {
    return shallowEqual(prev, next);
  },
);

function Result({ loading, query, ...props }) {
  return (
    <Dimmer.Dimmable dimmed={loading}>
      <Dimmer inverted active={loading}>
        <Loader inverted>Loading</Loader>
      </Dimmer>
      {query && <Message success>Search results for "{query}"</Message>}
      <Memo {...props}>
        {({ items }) =>
          !!items.length && (
            <Item.Group>
              {items.map(({ id, title, artist, album, duration }) => (
                <Item key={id}>
                  <Item.Image size="small" src={album.cover_medium} />
                  <Item.Content>
                    <Item.Header>
                      {artist.name} &mdash; {title}
                    </Item.Header>
                    <Item.Meta>
                      <Icon name="step forward" />
                      {transformDuration(duration)}
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
            </Item.Group>
          )
        }
      </Memo>
    </Dimmer.Dimmable>
  );
}

export default function Search({
  value,
  request,
  inputStatus,
  onChange,
  result,
  loading,
  error,
}) {
  return (
    <Segment>
      <Input
        value={value}
        loading={inputStatus === 'loading'}
        fluid
        icon="music"
        placeholder="Search for vibes..."
        onChange={onChange}
      />

      {error && <ErrorMessage {...error} />}
      {typeof result === 'string' ? (
        <Fallback query={result} />
      ) : (
        <Result {...{ ...result, loading }} />
      )}
    </Segment>
  );
}

Search.propTypes = {
  value: PropTypes.string.isRequired,
  inputStatus: PropTypes.oneOf(['idle', 'loading', 'error']).isRequired,
  result: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      query: PropTypes.string.isRequired,
      items: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
            .isRequired,
          title: PropTypes.string.isRequired,
          artist: PropTypes.shape({
            name: PropTypes.string.isRequired,
          }).isRequired,
          album: PropTypes.shape({
            title: PropTypes.string.isRequired,
            cover_medium: PropTypes.string.isRequired,
          }).isRequired,
          duration: PropTypes.number.isRequired,
        }),
      ).isRequired,
    }),
  ]).isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.instanceOf(Error),
  onChange: PropTypes.func.isRequired,
};
