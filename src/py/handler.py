# -*- coding:utf-8 -*-

from conoha import ConoHa, Region

import json
import base64

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
        elif self.request.path == '/':
            self.render("index.html")
            return
        elif self.request.path == '/login':
            self.render("index.html")
            return
        elif self.request.path == '/install':
            self.render("index.html")
            return
        elif self.request.path == '/progress':
            self.render("index.html")
            return
        else:
            raise Exception('unknown param.')

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

            with open('../sh/replace/startup.sh', 'rb') as f:
                script = f.read()
            script = script.replace('conoha_hinnyuu', adminpass)
            user_data = base64.b64encode(script)

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
            server = cono.get_server_info(server_id=server_id)
            self.write(json.dumps(server))
            self.flush()
            self.finish()
