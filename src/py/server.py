# -*- coding: utf-8 -*-
from handler import ConoHandler

import os

from tornado.httpserver import HTTPServer
from tornado.ioloop import IOLoop
from tornado.web import Application


TEMPLATE_PATH = '../static/templates'
STATIC_PATH = '../static'

class WebServer(object):
    def __init__(self, port, address='0.0.0.0'):
        super().__init__()

        self.port = port
        self.address = address

    def run(self):
        app = Application(
            [(r'.*', ConoHandler)],
            template_path=os.path.join(os.getcwd(),  TEMPLATE_PATH),
            static_path=os.path.join(os.getcwd(),  STATIC_PATH),
            )
        server = HTTPServer(app)

        print("Binding port %d" % self.port)
        server.bind(self.port, address=self.address)
        server.start(0)

        print("Proxy server is up ...")
        loop = IOLoop.instance()
        loop.start()
