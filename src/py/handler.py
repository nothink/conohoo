# -*- coding:utf-8 -*-
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

    @asynchronous
    def get(self):
        '''
        async GET method handling method
        '''
        self.render("index.html")

    post = get
