# Documentação do Projeto ApiNazamak

## Visão Geral
O ApiNazamak é uma API desenvolvida em Python (Flask) para consulta de dados de um sistema de gestão, utilizando um banco de dados Microsoft Access. Ela expõe endpoints REST para consulta de produtos, notas fiscais de entrada e produtos vinculados a uma nota, além de fornecer uma interface web de testes.

---

## Estrutura do Projeto

```
ApiNazamak/
│
├── app.py                  # Ponto de entrada da aplicação Flask
├── database.py             # Função utilitária para conexão com o banco Access
├── notas.py                # Endpoints relacionados a notas fiscais de entrada
├── produto.py              # Endpoint para consulta de produto e conversões
├── produtos_nota.py        # Endpoint para consulta de produtos de uma nota
├── testar_produto.html     # Interface web de testes das APIs
├── estrutura_completa.txt  # Estrutura detalhada do banco de dados
├── requirements.txt        # Dependências do projeto
├── iniciar_api.bat         # Script para iniciar a API no Windows
└── README.md               # (Este arquivo)
```

---

## Banco de Dados

- **Tipo:** Microsoft Access (`NAZAMAK.accdb`)
- **Localização padrão:** `C:\Users\Public\GerFinanceiro\NAZAMAK.accdb`
- **Estrutura detalhada:** ver arquivo `estrutura_completa.txt`
- **Tabelas principais utilizadas:**
  - `Tabela de Pecas` (produtos)
  - `Notas fiscais`
  - `Movimentacao dos itens`
  - `Fornecedores e Clientes`
  - `Conversao de itens`

---

## Configuração e Execução

1. **Instale as dependências:**
   ```
   pip install -r requirements.txt
   ```
2. **Inicie a API:**
   - Pelo terminal:
     ```
     python app.py
     ```
   - Ou pelo script:
     ```
     iniciar_api.bat
     ```
3. **Acesse a interface de testes:**
   - Abra o arquivo `testar_produto.html` no navegador.

---

## Endpoints da API

### 1. Consultar Produto
- **GET** `/api/produto/<codigo_produto>`
- **Descrição:** Retorna saldo, descrição e conversões do produto informado.
- **Exemplo de resposta:**
  ```json
  {
    "CodigoProduto": "D30756",
    "Descricao": "Produto Exemplo",
    "Saldo": 10,
    "Conversoes": ["UN", "CX"]
  }
  ```

---

### 2. Consultar Notas Fiscais de Entrada
- **GET** `/api/notas-entrada?inicio=AAAA-MM-DD&fim=AAAA-MM-DD`
- **Parâmetros:**
  - `inicio` (opcional): Data inicial (formato `YYYY-MM-DD`)
  - `fim` (opcional): Data final (formato `YYYY-MM-DD`)
  - Se nenhum parâmetro for informado, retorna todas as notas.
- **Exemplo de resposta:**
  ```json
  [
    {
      "NumeroNota": "00021839",
      "DataEmissao": "2024-06-28T00:00:00",
      "Fornecedor": "GARCIA HIDRAULICOS LTDA ME",
      "ValorTotal": 200.0,
      "QuantidadeItens": 5
    },
    ...
  ]
  ```

---

### 3. Consultar Produtos de uma Nota
- **GET** `/api/produtos-da-nota/<numero_nota>`
- **Descrição:** Retorna todos os produtos vinculados à nota fiscal informada.
- **Exemplo de resposta:**
  ```json
  [
    {
      "CodigoProduto": "D30756",
      "Descricao": "Produto Exemplo",
      "Quantidade": 2,
      "ValorUnitario": 100.0
    },
    ...
  ]
  ```

---

## Detalhes Técnicos

### Conexão com o Banco
- Utiliza `pyodbc` para conectar ao arquivo Access.
- O caminho do banco é fixo em `database.py`, mas pode ser alterado conforme necessidade.

### Blueprints Flask
- Cada grupo de rotas está em um arquivo separado e registrado no `app.py`:
  - `produto_bp` (produto.py)
  - `notas_bp` (notas.py)
  - `produtos_bp` (produtos_nota.py)

### Interface de Testes
- O arquivo `testar_produto.html` permite testar todos os endpoints da API de forma simples e visual.
- Mostra a quantidade de registros retornados e os dados em formato JSON.

---

## Estrutura do Banco (Resumo)

- **Tabela de Pecas:** Produtos cadastrados.
- **Notas fiscais:** Cabeçalho das notas fiscais (entrada/saída).
- **Movimentacao dos itens:** Itens/produtos de cada nota.
- **Fornecedores e Clientes:** Dados de fornecedores/clientes.
- **Conversao de itens:** Conversões/unidades alternativas de produtos.

Para detalhes completos, consulte o arquivo `estrutura_completa.txt`.

---

## Sugestões para Evolução

- **PWA ou Mobile:** O backend já está pronto para ser consumido por apps web/mobile.
- **Documentação de API:** Pode ser expandida para Swagger/OpenAPI.
- **Autenticação:** Caso necessário, adicionar autenticação JWT ou similar.
- **Deploy:** Pode ser hospedado em servidores Windows ou Linux (com ajustes no driver ODBC).

---

## Contato e Suporte

Para dúvidas, sugestões ou evolução do projeto, consulte este documento e os arquivos do repositório.  
Se for criar um novo frontend (PWA, mobile, etc), utilize esta documentação como base para integração.
