import React, { Component } from 'react'
import { StitchClientFactory } from 'mongodb-stitch'
import logo from './logo.svg'
import './App.css'

let stitchClientPromise = StitchClientFactory.create('giphyresponder-mspiu')

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      responses: []
    }
  }

  componentWillMount() {
    stitchClientPromise.then(stitchClient =>
      stitchClient
        .login()
        .then(authedId => {
          console.log(`logged in as:  + ${authedId}`)
          let db = stitchClient.service('mongodb', 'mongodb-atlas').db('porg')
          return db
            .collection('responses')
            .find({})
            .execute()
        })
        .then(responses => {
          console.log(responses)
          this.setState({ responses })
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
        <p className="App-intro">
          Send an email to gifme (at) sup.aydrian.me with a subject of what you
          want gifs of.
        </p>
        <ul className="responses">
          {this.state.responses.map(response => {
            return (
              <li key={response._id}>
                <h2>{response.search}</h2>
                <ul className="gif-list">
                  {response.gifs.map(gif => {
                    return (
                      <li key={gif.id}>
                        <a href={gif.url} target="_blank">
                          <img
                            src={gif.src}
                            alt={gif.title || 'no title'}
                            title={gif.title || 'no title'}
                          />
                        </a>
                      </li>
                    )
                  })}
                </ul>
              </li>
            )
          })}
        </ul>
        <div className="footer">
          <p>
            Powered by <a href="https://www.mongodb.com">MongoDB</a>,{' '}
            <a href="https://www.sparkpost.com">SparkPost</a>, and{' '}
            <a href="https://giphy.com/">Giphy</a>.
          </p>
        </div>
      </div>
    )
  }
}

export default App
