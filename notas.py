from flask import Blueprint, jsonify, request
from database import conectar

notas_bp = Blueprint('notas_bp', __name__)

@notas_bp.route('/api/notas-entrada', methods=['GET'])
def listar_notas():
    try:
        data_inicio = request.args.get('inicio')  # formato: AAAA-MM-DD
        data_fim = request.args.get('fim')        # opcional

        conn = conectar()
        cursor = conn.cursor()

        query = """
            SELECT 
                NOTA_FISCA AS NumeroNota,
                DATA_EMISS AS DataEmissao,
                FORNECEDOR,
                VALOR_TOTAL
            FROM [Notas fiscais]
            WHERE ENT_OU_SAI IN ('E','N','Y','Z')
        """

        params = []
        if data_inicio and data_fim:
            query += " AND DATA_EMISS BETWEEN ? AND ?"
            params.extend([data_inicio, data_fim])
        elif data_inicio:
            query += " AND DATA_EMISS >= ?"
            params.append(data_inicio)
        elif data_fim:
            query += " AND DATA_EMISS <= ?"
            params.append(data_fim)

        query += " ORDER BY DATA_EMISS DESC"

        cursor.execute(query, tuple(params))
        colunas = [desc[0] for desc in cursor.description]
        notas = [dict(zip(colunas, row)) for row in cursor.fetchall()]
        conn.close()

        return jsonify(notas)
    except Exception as e:
        return jsonify({"erro": str(e)}), 500