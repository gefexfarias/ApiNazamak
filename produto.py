from flask import Blueprint, jsonify
from database import conectar

# Criação do Blueprint para rotas de produtos
produto_bp = Blueprint('produto_bp', __name__)

# Código revisado e melhorado
# Mantém a mesma funcionalidade mas com melhor legibilidade
@produto_bp.route('/api/produto/<codigo_produto>', methods=['GET'])
def saldo_produto(codigo_produto):
    """
    Endpoint para consultar saldo e informações de um produto, incluindo conversões
    
    Args:
        codigo_produto (str): Código do produto a ser consultado
    
    Returns:
        JSON: Dados do produto ou mensagem de erro
    """
    try:
        # Estabelece conexão com o banco de dados
        conn = conectar()
        cursor = conn.cursor()

        # Query para buscar informações do produto e calcular saldo
        query = """
            SELECT 
                p.CODIGO AS CodigoProduto,
                p.PRODUTO AS Descricao,                                
                SUM(
                    IIF(n.ENT_OU_SAI IN ('E','N','Y','Z'), m.QTDE,
                    IIF(n.ENT_OU_SAI IN ('B','H','P','R','S','D'), -m.QTDE, 0))
                ) AS Saldo
            FROM ([Movimentacao dos itens] AS m
            INNER JOIN [Notas fiscais] AS n 
                ON m.[CHAVE NOTA FISCAL] = n.[CHAVE NOTA FISCAL])
            INNER JOIN [Tabela de Pecas] AS p 
                ON m.CODIGO = p.CODIGO 
            WHERE UCASE(p.CODIGO) = ? 
            GROUP BY p.CODIGO, p.PRODUTO, p.UNID, p.LINHA
        """

        cursor.execute(query, (codigo_produto.upper(),))
        row = cursor.fetchone()

        if row:
            colunas = [desc[0] for desc in cursor.description]
            produto_dict = dict(zip(colunas, row))

            # Buscar conversões do produto
            query_conv = """
                SELECT CONVERSAO
                FROM [Conversao de itens]
                WHERE UCASE(CODIGO) = ?
            """
            cursor.execute(query_conv, (codigo_produto.upper(),))
            conversoes = [conv[0] for conv in cursor.fetchall()]
            produto_dict["Conversoes"] = conversoes
            conn.close()
            return jsonify(produto_dict)
        else:
            conn.close()
            return jsonify({"mensagem": "Produto não encontrado."}), 404
    except Exception as e:
        return jsonify({"erro": str(e)}), 500