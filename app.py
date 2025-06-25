from flask import Flask, Blueprint
from flask_cors import CORS
from produtos_nota import produtos_bp
from produto import produto_bp
from notas import notas_bp

app = Flask(__name__)
CORS(app)

app.register_blueprint(produtos_bp)
app.register_blueprint(produto_bp)
app.register_blueprint(notas_bp)

if __name__ == '__main__':
    app.run(debug=True)