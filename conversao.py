from flask import Blueprint, request, jsonify
from database import conectar

conversao_bp = Blueprint('conversao_bp', __name__)

@conversao_bp.route('/api/conversao', methods=['POST'])
def cadastrar_conversao():
    try:
        data = request.get_json()
        codigo_principal = data.get('codigo_principal')
        codigo_conversao = data.get('codigo_conversao')
        nro_principal = data.get('nro_principal', 'Não')

        # Validação dos campos obrigatórios
        if not codigo_principal or not codigo_conversao:
            return jsonify({
                'success': False,
                'message': 'Campos obrigatórios: codigo_principal e codigo_conversao.'
            }), 400

        conn = conectar()
        cursor = conn.cursor()

        # Verificar se o código principal existe na Tabela de Pecas
        cursor.execute("SELECT 1 FROM [Tabela de Pecas] WHERE UCASE(CODIGO) = ?", (codigo_principal.upper(),))
        if not cursor.fetchone():
            conn.close()
            return jsonify({
                'success': False,
                'message': 'Código principal não encontrado na Tabela de Pecas.'
            }), 404

        # Verificar duplicidade
        cursor.execute("SELECT 1 FROM [Conversao de itens] WHERE UCASE(CODIGO) = ? AND UCASE(CONVERSAO) = ?", (codigo_principal.upper(), codigo_conversao.upper()))
        if cursor.fetchone():
            conn.close()
            return jsonify({
                'success': False,
                'message': 'Conversão já cadastrada para este código.'
            }), 409

        # Inserir nova conversão
        cursor.execute(
            "INSERT INTO [Conversao de itens] (CODIGO, CONVERSAO, NRO_PRINCIPAL) VALUES (?, ?, ?)",
            (codigo_principal, codigo_conversao, nro_principal)
        )
        conn.commit()
        conn.close()

        return jsonify({
            'success': True,
            'message': 'Conversão cadastrada com sucesso.',
            'data': {
                'codigo_principal': codigo_principal,
                'codigo_conversao': codigo_conversao,
                'nro_principal': nro_principal
            }
        }), 201
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500 