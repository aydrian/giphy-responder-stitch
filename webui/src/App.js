import React, { Component } from 'react';
import { StitchClientFactory } from 'mongodb-stitch';
import logo from './logo.svg';
import './App.css';

let stitchClientPromise = StitchClientFactory.create('giphyresponder-mspiu');

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      responses: []
    }
  }

  componentWillMount () {
    stitchClientPromise.then(stitchClient => stitchClient.login()
      .then(authedId => {
        console.log(`logged in as:  + ${authedId}`)
        let db = stitchClient.service('mongodb', 'mongodb-atlas').db('porg');
        return db.collection('responses').find({}).execute()
      }).then(responses => {
        console.log(responses)
        this.setState({ responses });
      })
      .catch(e => console.log('error: ', e))
    )
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Giphy Responder</h1>
        </header>
        <ul>
          { this.state.responses.map(response => {
            return (
              <li key={response._id}>{response.search}</li>
            );
          })}
        </ul>
      </div>
    );
  }
}

export default App;
