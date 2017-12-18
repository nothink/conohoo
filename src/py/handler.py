# -*- coding:utf-8 -*-

from conoha import ConoHa, Region

import json
import base64
import requests

from tornado.web import RequestHandler, asynchronous


class ConoHandler(RequestHandler):
    '''
    HTTP Handler Class
    '''
    SUPPORTED_METHODS = ("GET", "POST")

    def initialize(self):
        '''
        initializer
        '''
        pass

    @asynchronous
    def get(self, *args, **kwargs):
        '''
        async GET method handling method
        '''
        if self.request.path == '/service-worker.js':
            self.render("service-worker.js")
            return
        elif '/progress-server' in self.request.uri:
            addr = self.request.uri[22:]
            print(addr)
            progress = self.get_progress(addr)
            if not progress:
                progress = {}
            self.write(json.dumps(progress))
            self.flush()
            self.finish()
        else:
            self.render("index.html")

    @asynchronous
    def post(self, *args, **kwargs):
        '''
        async POST method handling method
        '''
        token = None
        if self.request.uri == '/auth-api':
            region = Region(self.get_argument('region'))
            username = self.get_argument('username')
            password = self.get_argument('password')
            tenant_id = self.get_argument('tenant_id')
            cono = ConoHa(region=region,
                          username=username,
                          password=password,
                          tenant_id=tenant_id)
            result = {
                'region': cono.region.value,
                'token': cono.token,
                'tenant_id': cono.tenant,
            }
            self.write(json.dumps(result))
            self.flush()
            self.finish()
            return
        elif self.request.uri == '/install-api':
            region = Region(self.get_argument('region'))
            token = self.get_argument('token')
            tenant_id = self.get_argument('tenant_id')
            flavor = self.get_argument('flavor')
            tag = self.get_argument('tag')
            adminpass = self.get_argument('adminpass')

            with open('../sh/replace/startup.sh', 'r') as f:
                script = f.read()
            script = script.replace('conoha_hinnyuu', adminpass)
            user_data = base64.b64encode(script.encode('utf-8')).decode('ascii')

            cono = ConoHa(region=region, token=token, tenant_id=tenant_id)
            result = cono.create(
                image_name='vmi-debian-9.0-amd64-unified',
                flavor_name=flavor,
                admin_pass=adminpass,
                tag_name=tag,
                sec_list=['gncs-ipv6-all', 'default', 'gncs-ipv4-all'],
                user_data=user_data,
            )
            server_id = result['server']['id']
            status = 'BUILD'
            while status == 'BUILD':
                server = cono.get_server_info(server_id=server_id)
                status = server['status']
            self.write(json.dumps(server))
            self.flush()
            self.finish()

    def get_progress(self, addr):
        url = 'http://' + addr + '/progress'
        try:
            res = requests.get(url, timeout=4)
        except (requests.exceptions.ConnectTimeout,
                requests.exceptions.ConnectionError):
            return {}
        if res.status_code != 200 :
            return {}
        text = res.text
        result = {
            'min': 0,
            'max': int(text[text.find('/') + 1: text.find(':')]),
            'current': int(text[0: text.find('/')]),
            'text': text,
        }
        return result
