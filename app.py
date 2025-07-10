from flask import Flask, Blueprint, send_from_directory
from flask_cors import CORS
from produtos_nota import produtos_bp
from produto import produto_bp
from notas import notas_bp
from conversao import conversao_bp

app = Flask(__name__)
CORS(app)

app.register_blueprint(produtos_bp)
app.register_blueprint(produto_bp)
app.register_blueprint(notas_bp)
app.register_blueprint(conversao_bp)

# Rotas para servir a interface web
@app.route('/')
def index():
    return send_from_directory('.', 'testar_produto.html')

@app.route('/produto')
def rota_produto():
    return send_from_directory('.', 'testar_produto.html')

@app.route('/notas')
def rota_notas():
    return send_from_directory('.', 'testar_produto.html')

@app.route('/produtos-nota')
def rota_produtos_nota():
    return send_from_directory('.', 'testar_produto.html')

if __name__ == '__main__':
    app.run(debug=True)