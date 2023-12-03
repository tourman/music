import {
  Icon,
  Input,
  Item,
  Label,
  Loader,
  Message,
  Segment,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';

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

function ErrorMessage({ error }) {
  return (
    <Message error>
      <Message.Header>
        There was some errors with your submission
      </Message.Header>
      <p>{error.toString()}</p>
    </Message>
  );
}

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

function Result({ items, loading }) {
  return (
    <Item.Group>
      {items.map(({ id, title, artist, album, duration }) => (
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
    </Item.Group>
  );
}

export default function Search({
  value,
  inputStatus,
  onChange,
  result,
  items,
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

      {error && <ErrorMessage error={error} />}
      {result === 'skeleton' ? (
        <Fallback />
      ) : items.length ? (
        <Result {...{ items, loading }} />
      ) : null}
    </Segment>
  );
}

Search.propTypes = {
  value: PropTypes.string.isRequired,
  inputStatus: PropTypes.oneOf(['idle', 'loading', 'error']).isRequired,
  result: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      artist: PropTypes.string.isRequired,
      album: PropTypes.string.isRequired,
      duration: PropTypes.string.isRequired,
    }),
  ).isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.instanceOf(Error),
  onChange: PropTypes.func.isRequired,
};
