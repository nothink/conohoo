import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import Identifier from './Identifier';
import Installer from './Installer';


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {token : ''};
    }

    setToken(value) {
        this.setState({token : value});
        alert(value);
    }

    render() {
        return (
            <div className="App">
            <Identifier setToken={this.setToken.bind(this)} />
            <Installer setToken={this.setToken.bind(this)} />
            </div>
        );
    }
}

export default App;
