from flask import Blueprint, jsonify
from database import conectar

# Criação do Blueprint para rotas de produtos
produto_bp = Blueprint('produto_bp', __name__)

# Código revisado e melhorado
# Mantém a mesma funcionalidade mas com melhor legibilidade
@produto_bp.route('/api/produto/<codigo_produto>', methods=['GET'])
def saldo_produto(codigo_produto):
    """
    Endpoint para consultar saldo e informações de um produto
    
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
        conn.close()

        if row:
            colunas = [desc[0] for desc in cursor.description]
            return jsonify(dict(zip(colunas, row)))
        else:
            return jsonify({"mensagem": "Produto não encontrado."}), 404
    except Exception as e:
        return jsonify({"erro": str(e)}), 500