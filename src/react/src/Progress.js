import React, { Component } from 'react';
import PropTypes from 'prop-types';

import AppBar from 'material-ui/AppBar';
import Paper from 'material-ui/Paper'
import LinearProgress from 'material-ui/LinearProgress'

class Progress extends Component {
    constructor(props) {
        super(props);
        this.state = {
            region : 'tyo1',
            min : 0,
            max : 100,
            current : 0
        };
        this.checkProgress = this.checkProgress.bind(this);
    }

    componentDidMount() {
        this.timer = setInterval(this.checkProgress, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    checkProgress() {
        this.setState({current : this.state.current + 1});
    }

    render() {
        const paperStyle = {
            width: 340,
            margin: 20,
            padding: 20,
            textAlign: 'left',
            display: 'inline-block',
        };
        const linearStyle = {
            width: 300,
        };

        return (
            <div>
            <AppBar title="進捗" iconClassNameRight="muidocs-icon-navigation-expand-more" showMenuIconButton={false} />
            <Paper style={paperStyle} zDepth={1}>
            <p>進捗テキスト</p>
            <LinearProgress style={linearStyle} mode="determinate" value={this.state.current} min={this.state.min} max={this.state.max} />
            </Paper>
            </div>
        );
    }

}

export default Progress;
