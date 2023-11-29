import './App.css';
import { Container, Grid, Header } from 'semantic-ui-react';
import Search from './components/Search';

function App() {
  return (
    <Grid padded>
      <Grid.Column>
        <Grid.Row>
          <Container>
            <Header as="h1">Interested in music?</Header>
            <Search />
          </Container>
        </Grid.Row>
      </Grid.Column>
    </Grid>
  );
}

export default App;
