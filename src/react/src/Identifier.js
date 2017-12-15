import React, { Component } from 'react';
import PropTypes from 'prop-types';

import AppBar from 'material-ui/AppBar';
import Paper from 'material-ui/Paper'
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem'
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
import RaisedButton from 'material-ui/RaisedButton';

class Identifier extends Component {
    constructor(props) {
        super(props);
        this.state = {
            region : 'tyo1',
            username : '',
            password : '',
            allowing : false
        };

        this.handleRegionChange = this.handleRegionChange.bind(this);
        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleOnCheck = this.handleOnCheck.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }

    handleRegionChange(event, index, value) {
        this.setState({region : value});
    }
    handleUsernameChange(event) {
        this.setState({username : event.target.value});
    }
    handlePasswordChange(event) {
        this.setState({password : event.target.value});
    }

    handleSubmit(event) {
        event.preventDefault();

        const endpoint = 'https://identity.' + this.state.region +  '.conoha.io/v2.0/tokens';
        var payload = {auth: { passwordCredentials:
                        {
                            username: this.state.username,
                            password: this.state.password
                        }}};
    }
    handleOnCheck(event, isInputChecked){
        this.setState({allowing : isInputChecked});
    }

    render() {
        const paperStyle = {
            width: 'auto',
            margin: 20,
            padding: 20,
            textAlign: 'left',
            display: 'inline-block',
        };

        return (
            <div>
            <AppBar title="APIログイン" iconClassNameRight="muidocs-icon-navigation-expand-more" showMenuIconButton={false} />
            <Paper style={paperStyle} zDepth={1}>
            <p>ConoHaコントロールパネルの<br/>「API - APIユーザー」<br/>にあるAPI識別情報を入力してください。</p>
            <form action="http://localhost:9999/auth-api" method="post">
                <SelectField name="region" value={this.state.region} floatingLabelText="リージョン" onChange={this.handleRegionChange}>
                <MenuItem value={'tyo1'} primaryText="東京" />
                <MenuItem value={'sin1'} primaryText="シンガポール" />
                <MenuItem value={'sjc1'} primaryText="アメリカ" />
                </SelectField>
                <br />
                <TextField type="text" hintText="APIユーザー名いっこいれる" floatingLabelText="ユーザー名" name="username" value={this.state.username} onChange={this.handleUsernameChange}/>
                <br />
                <TextField type="password" hintText="APIパスワードいっこいれる" floatingLabelText="パスワード" name="password" value={this.state.password} onChange={this.handlePasswordChange}/>
                <br />
                <Checkbox value={this.state.allowing} label="APIパスワードをサーバに渡す" onCheck={this.handleOnCheck} />
                <br />
                <RaisedButton type="submit" label="認証" primary={true}　disabled={!this.state.allowing || !this.state.region || !this.state.username || !this.state.password} />
            </form>
            </Paper>
            </div>
        );
    }

}

export default Identifier;
