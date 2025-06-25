from flask import Blueprint, jsonify, request
from database import conectar

notas_bp = Blueprint('notas_bp', __name__)

@notas_bp.route('/api/notas-entrada', methods=['GET'])
def listar_notas():
    try:
        data_inicio = request.args.get('inicio')  # formato: AAAA-MM-DD
        data_fim = request.args.get('fim')        # opcional
        numero_nota = request.args.get('numero')  # novo filtro opcional

        conn = conectar()
        cursor = conn.cursor()

        query = """
            SELECT 
                n.NOTA_FISCA AS NumeroNota,
                n.DT_EMISSAO AS DataEmissao,
                f.NOME AS Fornecedor,
                n.TOT_NF AS ValorTotal,
                n.[CHAVE NOTA FISCAL] AS ChaveNota
            FROM [Notas fiscais] AS n
            LEFT JOIN [Fornecedores e Clientes] AS f ON n.[CHAVE CLIENTE_FORNEC] = f.[CHAVE CLIENTE_FORNEC]
            WHERE n.ENT_OU_SAI IN ('E','N','Y','Z')
        """

        params = []
        if numero_nota:
            query += " AND n.NOTA_FISCA = ?"
            params.append(numero_nota)
        elif data_inicio and data_fim:
            query += " AND n.DT_EMISSAO BETWEEN ? AND ?"
            params.extend([data_inicio, data_fim])
        elif data_inicio:
            query += " AND n.DT_EMISSAO >= ?"
            params.append(data_inicio)
        # Se não houver data_inicio, não filtra por data, mesmo que data_fim exista

        query += " ORDER BY n.DT_EMISSAO DESC"

        cursor.execute(query, tuple(params))
        colunas = [desc[0] for desc in cursor.description]
        notas = [dict(zip(colunas, row)) for row in cursor.fetchall()]

        for nota in notas:
            cursor.execute("SELECT COUNT(*) FROM [Movimentacao dos itens] WHERE [CHAVE NOTA FISCAL] = ?", (nota["ChaveNota"],))
            nota["QuantidadeItens"] = cursor.fetchone()[0]
            del nota["ChaveNota"]

        conn.close()

        return jsonify(notas)
    except Exception as e:
        return jsonify({"erro": str(e)}), 500