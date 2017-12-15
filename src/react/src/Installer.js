import React, { Component } from 'react';
import PropTypes from 'prop-types';

import AppBar from 'material-ui/AppBar';
import Paper from 'material-ui/Paper'
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem'
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
import RaisedButton from 'material-ui/RaisedButton';

class Installer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            token : '',
            flavor: 'g-1gb',
            tag : '',
            adminpass : '',
            allowing : false,
        };

        this.handleFlavorChange = this.handleFlavorChange.bind(this);
        this.handleNameTagChange = this.handleNameTagChange.bind(this);
        this.handleAdminPassChange = this.handleAdminPassChange.bind(this);
        this.handleOnCheck = this.handleOnCheck.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleFlavorChange(event, index, value) {
        this.setState({flavor : value});
    }
    handleNameTagChange(event) {
        this.setState({tag : event.target.value});
    }
    handleAdminPassChange(event) {
        this.setState({adminpass : event.target.value});
    }
    handleOnCheck(event, isInputChecked){
        this.setState({allowing : isInputChecked});
    }

    handleSubmit(event) {

        event.preventDefault();

        const endpoint = 'https://identity.' + this.state.region +  '.conoha.io/v2.0/tokens';

        var payload = {auth: { passwordCredentials:
                        {
                            username: this.state.username,
                            password: this.state.password
                        }}};
        console.log(JSON.stringify(payload));

        console.log(endpoint);
        fetch(endpoint,
        {
            method: "POST",
            headers: new Headers({ 'Accept': 'application/json'}),
            mode: 'cors',
            credentials: 'include',
            body: JSON.stringify(payload)
        }).then(res => {
   console.log(res.url, res.type, res.status);

   if(res.headers.get('content-type') === 'application/json') {
     res.json().then(json => console.log(json));
   } else {
     // res.arrayBuffer();
     // res.blob();
     res.text().then(text => console.log(text));
   }
}).catch(err => console.error(err));
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
            <AppBar title="インストール" iconClassNameRight="muidocs-icon-navigation-expand-more" showMenuIconButton={false} />
            <Paper style={paperStyle} zDepth={1}>
            <p>希望するインストールオプションを選択してください。</p>
                <form action="http://localhost:9999/install-api" method="post">
                    <SelectField name="flavor" value={this.state.flavor} floatingLabelText="VMプラン（フレーバー）" onChange={this.handleFlavorChange}>
                    <MenuItem value={'g-512mb'} primaryText="512MB" />
                    <MenuItem value={'g-1gb'} primaryText="1GB" />
                    <MenuItem value={'g-2gb'} primaryText="2GB" />
                    <MenuItem value={'g-4gb'} primaryText="4GB" />
                    <MenuItem value={'g-8gb'} primaryText="8GB" />
                    <MenuItem value={'g-16gb'} primaryText="16GB" />
                    </SelectField>
                    <br />
                    <TextField type="text" hintText="ネームタグ" floatingLabelText="ネームタグ" name="tag" value={this.state.tag} onChange={this.handleNameTagChange}/>
                    <br />
                    <TextField type="password" hintText="rootパスワード" floatingLabelText="rootパスワード" name="adminpass" value={this.state.adminpass} onChange={this.handleAdminPassChange}/>
                    <br />
                    <Checkbox value={this.state.allowing} label="VM追加しても問題ない(課金が発生します)" onCheck={this.handleOnCheck} />
                    <br />
                    <RaisedButton type="submit" label="Conohooる！" primary={true} disabled={!this.state.allowing || !this.state.flavor || !this.state.tag || !this.state.adminpass} />
                </form>
            </Paper>
            </div>
        );
    }

}

export default Installer;
