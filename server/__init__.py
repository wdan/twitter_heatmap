from flask import Flask


app = Flask(__name__, static_url_path='', static_folder='../client',
        template_folder="../client/template")
app.config.from_object('config')

from server.routes import index
