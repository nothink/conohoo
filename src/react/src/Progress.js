import React, { Component } from 'react';
import PropTypes from 'prop-types';

import AppBar from 'material-ui/AppBar';
import Paper from 'material-ui/Paper'
import CircularProgress from 'material-ui/CircularProgress'

class Progress extends Component {
    constructor(props) {
        super(props);
        this.state = {
            region : 'tyo1',
            username : '',
            password : '',
            allowing : false
        };
    }

    componentDidMount() {
        this.timer = setInterval(this.checkProgress, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    render() {
        const paperStyle = {
            width: 'auto',
            margin: 20,
            padding: 20,
            textAlign: 'left',
            display: 'inline-block',
        };
        const progPaperStyle = {
            width: '40',
            height: '40',
            margin: 10,
            padding: 10,
            textAlign: 'center',
            verticalAlign: 'center',
            display: 'inline-block',
        };

        return (
            <div>
            <AppBar title="進捗" iconClassNameRight="muidocs-icon-navigation-expand-more" showMenuIconButton={false} />
            <Paper style={paperStyle} zDepth={1}>
            <p>進捗テキストはここに。</p>
            <Paper style={progPaperStyle} zDepth={1}><CircularProgress size="20" mode="determinate" value="100" /></Paper>
            <Paper style={progPaperStyle} zDepth={1}><CircularProgress size="20" mode="indeterminate" value="100" /></Paper>
            <Paper style={progPaperStyle} zDepth={1}><CircularProgress size="20" mode="indeterminate" value="100" /></Paper>
            <Paper style={progPaperStyle} zDepth={1}><CircularProgress size="20" mode="indeterminate" value="100" /></Paper>
            <Paper style={progPaperStyle} zDepth={1}><CircularProgress size="20" mode="indeterminate" value="100" /></Paper>
            <Paper style={progPaperStyle} zDepth={1}><CircularProgress size="20" mode="indeterminate" value="100" /></Paper>
            <Paper style={progPaperStyle} zDepth={1}><CircularProgress size="20" mode="indeterminate" value="100" /></Paper>
            <Paper style={progPaperStyle} zDepth={1}><CircularProgress size="20" mode="indeterminate" value="100" /></Paper>
            <Paper style={progPaperStyle} zDepth={1}><CircularProgress size="20" mode="indeterminate" value="100" /></Paper>
            <Paper style={progPaperStyle} zDepth={1}><CircularProgress size="20" mode="indeterminate" value="100" /></Paper>
            <Paper style={progPaperStyle} zDepth={1}><CircularProgress size="20" mode="indeterminate" value="100" /></Paper>
            <Paper style={progPaperStyle} zDepth={1}><CircularProgress size="20" mode="indeterminate" value="100" /></Paper>
            </Paper>
            </div>
        );
    }

}

export default Progress;
