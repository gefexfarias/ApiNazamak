from flask import Blueprint, request, jsonify
from database import conectar

conversao_bp = Blueprint('conversao_bp', __name__)

@conversao_bp.route('/api/conversao', methods=['POST'])
def cadastrar_conversao():
    try:
        data = request.get_json()
        print('DADOS RECEBIDOS:', data)
        codigo_principal = data.get('codigo_principal')
        codigo_conversao = data.get('codigo_conversao')
        nro_principal = data.get('nro_principal', False)  # padrão booleano
        nro_principal_db = 1 if nro_principal else 0  # Access espera 1/0

        # Validação dos campos obrigatórios
        if not codigo_principal or not codigo_conversao:
            return jsonify({
                'success': False,
                'message': 'Por favor, preencha todos os campos obrigatórios.'
            }), 400

        conn = conectar()
        cursor = conn.cursor()

        # Verificar se o código principal existe na Tabela de Pecas
        cursor.execute("SELECT 1 FROM [Tabela de Pecas] WHERE UCASE(CODIGO) = ?", (codigo_principal.upper(),))
        if not cursor.fetchone():
            conn.close()
            return jsonify({
                'success': False,
                'message': 'O código informado não existe no cadastro de peças.'
            }), 404

        # Verificar duplicidade
        cursor.execute("SELECT 1 FROM [Conversao de itens] WHERE UCASE(CODIGO) = ? AND UCASE(CONVERSAO) = ?", (codigo_principal.upper(), codigo_conversao.upper()))
        if cursor.fetchone():
            conn.close()
            return jsonify({
                'success': False,
                'message': 'Já existe uma conversão cadastrada para este código.'
            }), 409

        # Inserir nova conversão
        cursor.execute(
            "INSERT INTO [Conversao de itens] (CODIGO, CONVERSAO, NRO_PRINCIPAL) VALUES (?, ?, ?)",
            (codigo_principal, codigo_conversao, nro_principal_db)
        )
        conn.commit()
        conn.close()

        return jsonify({
            'success': True,
            'message': 'Conversão cadastrada com sucesso!',
            'data': {
                'codigo_principal': codigo_principal,
                'codigo_conversao': codigo_conversao,
                'nro_principal': bool(nro_principal_db)
            }
        }), 201
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({
            'success': False,
            'message': 'Ocorreu um erro ao salvar a conversão. Tente novamente ou contate o suporte.',
            'details': str(e)
        }), 500 