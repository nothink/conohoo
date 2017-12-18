import React, { Component } from 'react';

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
            region : this.props.region,
            token : this.props.token,
            tenant_id : this.props.tenant_id,
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
        var self = this;
        fetch('/install-api',{
            method: 'POST',
            body: new FormData(document.getElementById('install-api'))
        }).then(function(response) {
            return response.json();
        }).then(function(json) {
            var address = null;
            var addrHash = json['addresses'];
            for (let key in addrHash) {
                var addrList = addrHash[key];
                for (let idx in addrList) {
                    if (addrList[idx]['version'] == 4) {
                        address = addrList[idx]['addr']
                        break;
                    }
                }
            }
            self.props.setAddress(address);
            self.props.moveRoutePath('/progress');
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
            <AppBar title="インストール" iconClassNameRight="muidocs-icon-navigation-expand-more" showMenuIconButton={false} />
            <Paper style={paperStyle} zDepth={1}>
            <p>インストールオプションを選択してください。</p>
                <form action="/install-api" method="post" id="install-api">
                    <input type="hidden" name="region" value={this.state.region} />
                    <input type="hidden" name="token" value={this.state.token} />
                    <input type="hidden" name="tenant_id" value={this.state.tenant_id} />
                    <input type="hidden" name="flavor" value={this.state.flavor} />
                    <SelectField name="flavorsel" value={this.state.flavor} floatingLabelText="VMプラン（フレーバー）" onChange={this.handleFlavorChange}>
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
                    <Checkbox value={this.state.allowing} label="VM追加を許可(課金が発生します)" onCheck={this.handleOnCheck} />
                    <br />
                    <RaisedButton type="button" label="Conohooる！" primary={true} fullWidth={true} disabled={!this.state.allowing || !this.state.flavor || !this.state.tag || !this.state.adminpass} onClick={this.handleSubmit} />
                </form>
            </Paper>
            </div>
        );
    }

}

export default Installer;
