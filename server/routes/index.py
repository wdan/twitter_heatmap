# import json
# from flask import request
from flask import render_template
# from flask import make_response

from server import app


@app.route('/')
def heatmap():
    return render_template('index.html')
