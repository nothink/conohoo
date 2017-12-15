import React, { Component } from 'react';
import './App.css';

import Identifier from './Identifier';
import Installer from './Installer';
import Progress from './Progress';


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
            <Progress setToken={this.setToken.bind(this)} />
            </div>
        );
    }
}

export default App;
