import {
  Icon,
  Input,
  Item,
  Label,
  Loader,
  Message,
  Segment,
} from 'semantic-ui-react';

export default function Search() {
  return (
    <Segment>
      <Input loading fluid icon="music" placeholder="Search for vibes..." />

      <Message error>
        <Message.Header>
          There was some errors with your submission
        </Message.Header>
        <p>We fixed the error for you</p>
      </Message>

      <Item.Group>
        <Item>
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
    </Segment>
  );
}
