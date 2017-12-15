#!/usr/bin/env python3
# -*- coding:utf-8 -*-

from server import WebServer

import os
from tornado.options import define, options
from tornado.options import parse_command_line, parse_config_file

define('port', type=int, default=8000, help='port number')
define('bind', type=str, default='0.0.0.0', help='binding address')


def main():
    ''' main entry '''
    parse_command_line()

    web = WebServer(port=options.port, address=options.bind)
    web.run()


if __name__ == '__main__':
    main()
