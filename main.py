from flask import Flask, send_from_directory, render_template

app = Flask(__name__)

@app.route('/')
def root():
  return send_from_directory('dist/', 'index.html')

@app.route('/<path:path>', methods=['GET'])
def static_proxy(path):
  return send_from_directory('dist/static', path)


if __name__ == '__main__':
  # This is used when running locally only. When deploying use a webserver process
  # such as Gunicorn to serve the app.
  app.run(host='127.0.0.1', port=8080, debug=True)


@app.errorhandler(500)
def server_error(e):
  return 'An internal error occurred [main.py] %s' % e, 500
