from flask import Blueprint, jsonify
from database import conectar

produtos_bp = Blueprint('produtos_bp', __name__)

@produtos_bp.route('/api/produtos-da-nota/<numero_nota>', methods=['GET'])
def produtos_da_nota(numero_nota):
    try:
        conn = conectar()
        cursor = conn.cursor()
        query = """
            SELECT 
                m.CODIGO AS CodigoProduto,
                m.DESCRICAO AS Descricao,
                m.QTDE AS Quantidade,
                IIF(m.QTDE > 0, m.VLR_LIQUI / m.QTDE, 0) AS ValorUnitario
            FROM [Movimentacao dos itens] AS m
            INNER JOIN [Notas fiscais] AS n ON m.[CHAVE NOTA FISCAL] = n.[CHAVE NOTA FISCAL]
            WHERE n.[NOTA_FISCA] = ? AND n.ENT_OU_SAI IN ('E','N','Y','Z')
            ORDER BY m.CODIGO
        """
        cursor.execute(query, (numero_nota,))
        colunas = [desc[0] for desc in cursor.description]
        produtos = [dict(zip(colunas, row)) for row in cursor.fetchall()]
        conn.close()

        if produtos:
            return jsonify(produtos)
        else:
            return jsonify({"mensagem": "Nenhum produto encontrado para essa nota de entrada."}), 404
    except Exception as e:
        return jsonify({"erro": str(e)}), 500