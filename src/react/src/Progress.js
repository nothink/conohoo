import React, { Component } from 'react';

import AppBar from 'material-ui/AppBar';
import Paper from 'material-ui/Paper'
import LinearProgress from 'material-ui/LinearProgress'

class Progress extends Component {
    constructor(props) {
        super(props);
        this.state = {
            address : this.props.address,
            min : 0,
            max : 100,
            current : 0,
            text : '準備しています...',
        };
        this.checkProgress = this.checkProgress.bind(this);
    }

    componentDidMount() {
        this.timer = setInterval(this.checkProgress, 10000);
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    checkProgress() {
        var self = this;
        fetch('/progress-server&addr=' + this.state.address).then(function(response) {
            return response.json();
        }).then(function(json) {
            if ('min' in json) {
                self.setState({min : json['min']});
                self.setState({max : json['max']});
                self.setState({current : json['current']});
                self.setState({text : json['text']});
            }
        });
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
            <p>{this.state.text}</p>
            <LinearProgress style={linearStyle} mode="determinate" value={this.state.current} min={this.state.min} max={this.state.max} />
            </Paper>
            </div>
        );
    }

}

export default Progress;
