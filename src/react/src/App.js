import React, { Component } from 'react';
import { Route, Link, withRouter } from 'react-router-dom';
import { Redirect } from 'react-router'

import './App.css';

import Identifier from './Identifier';
import Installer from './Installer';

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {token : 'a'};
    }

    setToken(value) {
        this.setState({token : value});
        alert(value);
    }

    render() {
        if (!this.state.token && this.props.location.pathname != '/login') {
            return (
                <Redirect to='/login'/>
            );
        }

        return (
            <div className="App">
            <Route exact path="/login" render={() => <Identifier setToken={this.setToken.bind(this)} />} />
            <Route exact path="/install" render={() => <Installer setToken={this.setToken.bind(this)} />} />
            </div>
        );
    }
}

export default withRouter(App);
