import React, { Component } from 'react';

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
            tenant_id : '',
            username : '',
            password : '',
            allowing : false
        };

        this.handleRegionChange = this.handleRegionChange.bind(this);
        this.handleTenantChange = this.handleTenantChange.bind(this);
        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleOnCheck = this.handleOnCheck.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleRegionChange(event, index, value) {
        this.setState({region : value});
    }
    handleTenantChange(event) {
        this.setState({tenant_id : event.target.value});
    }
    handleUsernameChange(event) {
        this.setState({username : event.target.value});
    }
    handlePasswordChange(event) {
        this.setState({password : event.target.value});
    }
    handleOnCheck(event, isInputChecked){
        this.setState({allowing : isInputChecked});
    }

    handleSubmit(event) {
        var self = this;
        fetch('/auth-api',{
            method: 'POST',
            body: new FormData(document.getElementById('auth-api'))
        }).then(function(response) {
            return response.json();
        }).then(function(json) {
            self.props.setRegion(json['region']);
            self.props.setToken(json['token']);
            self.props.setTenantId(json['tenant_id']);
            self.props.moveRoutePath('/install');
        });
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
            <p>ConoHaコントロールパネルに記載された<br />API情報を入力してください。</p>
            <form action="/auth-api" method="post" id="auth-api">
                <input type="hidden" name="region" value={this.state.region} />
                <SelectField name="regionsel" value={this.state.region} floatingLabelText="リージョン" onChange={this.handleRegionChange}>
                <MenuItem value={'tyo1'} primaryText="東京" />
                <MenuItem value={'sin1'} primaryText="シンガポール" />
                <MenuItem value={'sjc1'} primaryText="アメリカ" />
                </SelectField>
                <br />
                <TextField type="text" hintText="テナントIDは長い方" floatingLabelText="テナントID" name="tenant_id" value={this.state.tenant_id} onChange={this.handleTenantChange}/>
                <br />
                <TextField type="text" hintText="APIユーザー名いっこいれる" floatingLabelText="ユーザー名" name="username" value={this.state.username} onChange={this.handleUsernameChange}/>
                <br />
                <TextField type="password" hintText="APIパスワードいっこいれる" floatingLabelText="パスワード" name="password" value={this.state.password} onChange={this.handlePasswordChange}/>
                <br />
                <Checkbox value={this.state.allowing} label="APIパスワードをサーバに渡す" onCheck={this.handleOnCheck} />
                <br />
                <RaisedButton type="button" label="認証" primary={true} fullWidth={true} disabled={ !this.state.region || !this.state.tenant_id || !this.state.username || !this.state.password || !this.state.allowing } onClick={this.handleSubmit} />
            </form>
            </Paper>
            </div>
        );
    }

}

export default Identifier;
