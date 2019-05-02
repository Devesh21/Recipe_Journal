import React, {Component} from "react";
import {Route, Switch} from "react-router-dom";
import {Button, FormGroup, FormControl, ControlLabel, Container, Row, Col} from "react-bootstrap";
import Login from "./Login.js";
import Signup from "./Signup.js";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login: true
    };
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick(event) {
    this.setState({login: !this.state.login});
  }

  render() {
    var text = this.state.login ? "Sign Up" : "Log In";
    var show = this.state.login ? <Login/> : <Signup/>
    return (
      <Container style={{"max-width": "100%"}}>
        <Row>
          <Col>
            <header className="App-header">
              <div className="App-Title">
                <h1 className="App-title">Your partner in learning</h1>
                <p>Find and read books of your choice!</p>
              </div>
            </header>
          </Col>
          <Col lg="3">
            {show}
            <Button block bsSize="large" onClick={this.handleClick}>
              {text}
            </Button>
          </Col>
        </Row>
      </Container>
    )
  }
}

export default Home;