import React, { Component } from 'react';
import {
    Route,
    withRouter,
    Redirect
} from 'react-router-dom';

import './App.css';

import Identifier from './Identifier';
import Installer from './Installer';
import Progress from './Progress';


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {region : '', token : '', tenant_id : '', address : ''};
    }

    setRegion(value) {
        this.setState({region : value});
    }

    setToken(value) {
        this.setState({token : value});
    }

    setTenantId(value) {
        this.setState({tenant_id : value});
    }

    setAddress(value) {
        this.setState({address : value});
    }

    moveRoutePath(value) {
        this.props.history.push(value);
    }

    render() {
        if (!this.state.token && this.props.location.pathname !== '/login'){
            return(
                <Redirect to='/login' />
            );
        }
        return (
            <div className="App">
            <Route exact path='/login' render={
                props => <Identifier setRegion={this.setRegion.bind(this)}
                                     setToken={this.setToken.bind(this)}
                                     setTenantId={this.setTenantId.bind(this)}
                                     moveRoutePath={this.moveRoutePath.bind(this)} />
            } />
            <Route exact path='/install' render={
                props => <Installer region={this.state.region}
                                    token={this.state.token}
                                    tenant_id={this.state.tenant_id}
                                    setAddress={this.setAddress.bind(this)}
                                    moveRoutePath={this.moveRoutePath.bind(this)} />
            } />
            <Route exact path='/progress' render={
                props => <Progress address={this.state.address} />
            } />
            </div>
        );
    }
}

export default withRouter(App);
