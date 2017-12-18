import requests
import json
from enum import Enum
import re


class Region(Enum):
    TYO1 = 'tyo1'
    SIN1 = 'sin1'
    SJC1 = 'sjc1'


class ConoHa(object):

    def __init__(self, region=None, username=None, password=None, token=None, tenant_name=None, tenant_id=None):
        if region and token and tenant_id:
            self.region = region
            self.token = token
            self.tenant = tenant_id
        elif region and username and password:
            self.region = region
            endpoint = self._build_endpoint('identity', '/v2.0/tokens')
            payload = {'auth': {
                            'tenantName': tenant_name,
                            'tenantId': tenant_id,
                            'passwordCredentials': {
                                'username': username,
                                'password': password,
                            }}}
            res = requests.post(endpoint, json=payload)
            if res.status_code != 200 :
                raise requests.exceptions.HTTPError(res.status_code)

            self.token = res.json()['access']['token']['id']
            self.tenant = res.json()['access']['token']['tenant']['id']
        else:
            raise requests.exceptions.HTTPError()

    def create(self, image_name, flavor_name, admin_pass, tag_name=None, sec_list=None, user_data=None):
        if not self.is_admin_pass_valid(admin_pass):
            raise ValueError('adminPass')
        endpoint = self._build_endpoint('compute', '/v2/' + self.tenant + '/servers')
        if not self.is_name_tag_valid(tag_name):
            raise ValueError('instande_tag_name')
        payload = {'server': {
                        'imageRef': self.images[image_name],
                        'flavorRef': self.flavors[flavor_name],
                        'adminPass':admin_pass,
                        }}
        if tag_name:
            payload['server']['metadata'] = {'instance_name_tag': tag_name}
        if sec_list:
            sec_attr = []
            for sec in sec_list:
                sec_attr.append({'name': sec})
            payload['server']['security_groups'] = sec_attr
        if user_data:
            payload['server']['user_data'] = user_data

        json = self._post(endpoint, payload)
        if not json['server']['id']:
            raise Exception()
        return json

    @property
    def flavors(self):
        endpoint = self._build_endpoint('compute', '/v2/' + self.tenant + '/flavors')
        json = self._get(endpoint)
        retval = {};
        for flavor in json['flavors']:
            retval[flavor['name']] = flavor['id']
        return retval

    @property
    def images(self):
        endpoint = self._build_endpoint('image-service', '/v2/images')
        json = self._get(endpoint)
        retval = {};
        for image in json['images']:
            retval[image['name']] = image['id']
        return retval

    @property
    def security_groups(self):
        endpoint = self._build_endpoint('networking', '/v2.0/security-groups')
        json = self._get(endpoint)
        retval = {};
        for image in json['security_groups']:
            retval[image['name']] = image['id']
        return retval

    def _get(self, endpoint):
        headers = {
            'Accept': 'application/json',
            'X-Auth-Token': self.token,
        }
        res = requests.get(endpoint, headers=headers)
        if res.status_code != 200 :
            raise requests.exceptions.HTTPError()
        return res.json()

    def _post(self, endpoint, payload):
        headers = {
            'Accept': 'application/json',
            'X-Auth-Token': self.token,
        }
        res = requests.post(endpoint, json=payload, headers=headers)
        if res.status_code not in [200, 202, 204]:
            raise requests.exceptions.HTTPError()
        return res.json()

    def _build_endpoint(self, api_type, path):
        return 'https://' + api_type + '.' + self.region.value + '.conoha.io' + path

    def is_admin_pass_valid(self, phrase):
        if len(phrase) < 9 or len(phrase) > 70:
            return False
        match = re.search(r'^[a-zA-Z0-9\!\#\$\%\&\?\"\'\=\+\-_\{\}\[\]\^\~\:\;\(\)\.\,\/\|\\\*\@]+$', phrase)
        if not match:
            return False
        match = re.search(r'[a-z]', phrase)
        if not match:
            return False
        match = re.search(r'[A-Z]', phrase)
        if not match:
            return False
        match = re.search(r'[0-9\!\#\$\%\&\?\"\'\=\+\-_\{\}\[\]\^\~\:\;\(\)\.\,\/\|\\\*\@]', phrase)
        if not match:
            return False
        return True

    def is_name_tag_valid(self, phrase):
        if len(phrase) > 255:
            return False
        match = re.search(r'^[a-zA-Z0-9\-_]+$', phrase)
        if not match:
            return False
        return True
