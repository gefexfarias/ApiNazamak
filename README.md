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

# Estrutura do Banco de Dados

```
ESTRUTURA DO BANCO DE DADOS
==================================================

Tabela: Bancos
------------------------------
Campo: CHAVE DO BANCO | Tipo: Texto | Tamanho: 255
Campo: NOME DO BANCO | Tipo: Texto | Tamanho: 255
Campo: Email | Tipo: Texto | Tamanho: 255
Campo: Ativo | Tipo: Sim/Nao | Tamanho: -

Tabela: Cadastro de Empresas
------------------------------
Campo: codigo da loja | Tipo: Texto | Tamanho: 1
Campo: Nome da loja | Tipo: Texto | Tamanho: 50
Campo: nro nota balcao | Tipo: Texto | Tamanho: 8

Tabela: Cheques pre-datados
------------------------------
Campo: CHAVE CLIENTE_FORNEC | Tipo: Longo | Tamanho: -
Campo: CHAVE DO BANCO | Tipo: Texto | Tamanho: 255
Campo: CODIGO DA CIDADE | Tipo: Texto | Tamanho: 255
Campo: Agencia | Tipo: Texto | Tamanho: 6
Campo: Conta | Tipo: Texto | Tamanho: 20
Campo: Numero do cheque | Tipo: Texto | Tamanho: 6
Campo: Nome do Cheque | Tipo: Texto | Tamanho: 50
Campo: Vencimento | Tipo: Data/Hora | Tamanho: -
Campo: Valor | Tipo: Moeda | Tamanho: -
Campo: Situacao | Tipo: Sim/Nao | Tamanho: -
Campo: OBS | Tipo: Texto | Tamanho: 50
Campo: Conferido | Tipo: Sim/Nao | Tamanho: -

Tabela: Cidades
------------------------------
Campo: CODIGO DA CIDADE | Tipo: Longo | Tamanho: -
Campo: CIDADE | Tipo: Texto | Tamanho: 255

Tabela: Classificacao Fiscal
------------------------------
Campo: CF | Tipo: Texto | Tamanho: 8
Campo: IST | Tipo: Double | Tamanho: -
Campo: DESCRICAO | Tipo: Memo | Tamanho: 0

Tabela: Contas a pagar/receber
------------------------------
Campo: CHAVE NOTA FISCAL | Tipo: Longo | Tamanho: -
Campo: PARCELA | Tipo: Texto | Tamanho: 2
Campo: VENCIMENTO | Tipo: Data/Hora | Tamanho: -
Campo: VALOR_ | Tipo: Double | Tamanho: -
Campo: PAGAMENTO | Tipo: Data/Hora | Tamanho: -
Campo: VALOR_PAGO | Tipo: Double | Tamanho: -
Campo: BOLETO | Tipo: Sim/Nao | Tamanho: -
Campo: CARTAO | Tipo: Sim/Nao | Tamanho: -

Tabela: Conversao de itens
------------------------------
Campo: CODIGO | Tipo: Texto | Tamanho: 30
Campo: CONVERSAO | Tipo: Texto | Tamanho: 30
Campo: NRO_PRINCIPAL | Tipo: Sim/Nao | Tamanho: -

Tabela: Erros ao colar
------------------------------
Campo: ORDEM LANCAMENTO | Tipo: Double | Tamanho: -
Campo: CODIGO | Tipo: Texto | Tamanho: 255
Campo: DESCRICAO | Tipo: Texto | Tamanho: 255
Campo: F4 | Tipo: Texto | Tamanho: 255
Campo: F5 | Tipo: Texto | Tamanho: 255
Campo: F6 | Tipo: Texto | Tamanho: 255
Campo: QTDE | Tipo: Double | Tamanho: -
Campo: VLR_BRUTO | Tipo: Double | Tamanho: -
Campo: DESCONTO | Tipo: Double | Tamanho: -
Campo: VLR_LIQUI | Tipo: Double | Tamanho: -
Campo: IPI | Tipo: Double | Tamanho: -
Campo: VLR_COMIPI | Tipo: Double | Tamanho: -
Campo: vOutro | Tipo: Double | Tamanho: -
Campo: Total | Tipo: Double | Tamanho: -
Campo: Total nota fiscal rodape | Tipo: Double | Tamanho: -

Tabela: Fornecedores e Clientes
------------------------------
Campo: CHAVE CLIENTE_FORNEC | Tipo: Longo | Tamanho: -
Campo: NOME | Tipo: Texto | Tamanho: 60
Campo: ENDERECO | Tipo: Texto | Tamanho: 60
Campo: NUMERO | Tipo: Texto | Tamanho: 6
Campo: BAIRRO | Tipo: Texto | Tamanho: 60
Campo: codigo Municipio | Tipo: Texto | Tamanho: 7
Campo: xCpl | Tipo: Texto | Tamanho: 60
Campo: UF | Tipo: Texto | Tamanho: 2
Campo: CEP | Tipo: Texto | Tamanho: 8
Campo: FONE | Tipo: Texto | Tamanho: 12
Campo: FAX | Tipo: Texto | Tamanho: 12
Campo: CGC | Tipo: Texto | Tamanho: 14
Campo: CPF | Tipo: Texto | Tamanho: 11
Campo: INSCRICAO | Tipo: Texto | Tamanho: 14
Campo: CONTATO | Tipo: Texto | Tamanho: 25
Campo: SETOR | Tipo: Texto | Tamanho: 25
Campo: EMAIL | Tipo: Texto | Tamanho: 60
Campo: CORRESPONDENCIA | Tipo: Sim/Nao | Tamanho: -
Campo: Observacoes | Tipo: Memo | Tamanho: 0
Campo: indIEDest | Tipo: Inteiro | Tamanho: -
Campo: apelido | Tipo: Texto | Tamanho: 60

Tabela: Linha
------------------------------
Campo: codigo | Tipo: Texto | Tamanho: 3
Campo: linha | Tipo: Texto | Tamanho: 15

Tabela: Movimentacao dos itens
------------------------------
Campo: CHAVE NOTA FISCAL | Tipo: Longo | Tamanho: -
Campo: ORDEM LANCAMENTO | Tipo: Longo | Tamanho: -
Campo: CODIGO | Tipo: Texto | Tamanho: 30
Campo: DESCRICAO | Tipo: Texto | Tamanho: 110
Campo: QTDE | Tipo: Double | Tamanho: -
Campo: VLR_BRUTO | Tipo: Double | Tamanho: -
Campo: DESCONTO | Tipo: Double | Tamanho: -
Campo: VLR_LIQUI | Tipo: Double | Tamanho: -
Campo: IPI | Tipo: Double | Tamanho: -
Campo: VLR_COMIPI | Tipo: Double | Tamanho: -
Campo: MARCA | Tipo: Texto | Tamanho: 15
Campo: COD_CFOP | Tipo: Texto | Tamanho: 4
Campo: NCM | Tipo: Texto | Tamanho: 8
Campo: vOutro | Tipo: Double | Tamanho: -
Campo: ICMS_vAntecipado | Tipo: Double | Tamanho: -

Tabela: Municipio
------------------------------
Campo: Município | Tipo: Texto | Tamanho: 255
Campo: NomeMunic | Tipo: Texto | Tamanho: 255
Campo: UF | Tipo: Texto | Tamanho: 255
Campo: NomeUF | Tipo: Texto | Tamanho: 255

Tabela: Notas fiscais
------------------------------
Campo: CHAVE NOTA FISCAL | Tipo: Longo | Tamanho: -
Campo: NOTA_FISCA | Tipo: Texto | Tamanho: 8
Campo: CHAVE CLIENTE_FORNEC | Tipo: Longo | Tamanho: -
Campo: ENT_OU_SAI | Tipo: Texto | Tamanho: 1
Campo: LOJA | Tipo: Texto | Tamanho: 1
Campo: CFOP | Tipo: Texto | Tamanho: 4
Campo: ICMS | Tipo: Desconhecido | Tamanho: -
Campo: DT_EMISSAO | Tipo: Data/Hora | Tamanho: -
Campo: DT_LANCAMENTO | Tipo: Data/Hora | Tamanho: -
Campo: VLR_IPI | Tipo: Double | Tamanho: -
Campo: OUTROS | Tipo: Double | Tamanho: -
Campo: VLR_FRETE | Tipo: Double | Tamanho: -
Campo: vlrDesconto | Tipo: Double | Tamanho: -
Campo: TOT_PRODUT | Tipo: Double | Tamanho: -
Campo: TOT_NF | Tipo: Double | Tamanho: -
Campo: CHAVE TRANSPORTADORA | Tipo: Longo | Tamanho: -
Campo: NRO_CONHEC | Tipo: Texto | Tamanho: 8
Campo: DTA_CONHEC | Tipo: Data/Hora | Tamanho: -
Campo: POSICAO DO FRETE | Tipo: Texto | Tamanho: 1
Campo: OBSERVACOES | Tipo: Memo | Tamanho: 0
Campo: IMPRIMECODIGO | Tipo: Sim/Nao | Tamanho: -
Campo: POSICAONOTABALCAO | Tipo: Sim/Nao | Tamanho: -
Campo: BOLETO | Tipo: Sim/Nao | Tamanho: -
Campo: tpNF | Tipo: Inteiro | Tamanho: -
Campo: indPag | Tipo: Inteiro | Tamanho: -
Campo: indPres | Tipo: Inteiro | Tamanho: -
Campo: finNfe | Tipo: Inteiro | Tamanho: -
Campo: indFinal | Tipo: Inteiro | Tamanho: -
Campo: qVol | Tipo: Double | Tamanho: -
Campo: esp | Tipo: Texto | Tamanho: 60
Campo: marca | Tipo: Texto | Tamanho: 60
Campo: nVol | Tipo: Texto | Tamanho: 60
Campo: pesoL | Tipo: Double | Tamanho: -
Campo: pesoB | Tipo: Double | Tamanho: -
Campo: refNFe | Tipo: Texto | Tamanho: 44
Campo: modFrete | Tipo: Inteiro | Tamanho: -
Campo: ChaveNF | Tipo: Texto | Tamanho: 44
Campo: tPag | Tipo: Texto | Tamanho: 2
Campo: id_Maquina | Tipo: Longo | Tamanho: -
Campo: ID_PrazoPagamento | Tipo: Longo | Tamanho: -
Campo: bandeiraCartao | Tipo: Inteiro | Tamanho: -

Tabela: Pecas recuperadas
------------------------------
Campo: Códigomarcação | Tipo: Longo | Tamanho: -
Campo: Dataentrega | Tipo: Data/Hora | Tamanho: -
Campo: CHAVE CLIENTE_FORNEC | Tipo: Longo | Tamanho: -
Campo: Valor | Tipo: Double | Tamanho: -
Campo: Observções | Tipo: Memo | Tamanho: 0

Tabela: Tabela de CFOP
------------------------------
Campo: COD_CFOP | Tipo: Texto | Tamanho: 4
Campo: DESCRICAO | Tipo: Texto | Tamanho: 255

Tabela: Tabela de naturezas
------------------------------
Campo: natureza | Tipo: Texto | Tamanho: 1
Campo: descricao da natureza | Tipo: Texto | Tamanho: 15
Campo: tipo | Tipo: Texto | Tamanho: 1
Campo: imposto federal | Tipo: Texto | Tamanho: 1
Campo: imposto estadual | Tipo: Texto | Tamanho: 1
Campo: imposto municipal | Tipo: Texto | Tamanho: 1
Campo: gera listagem | Tipo: Texto | Tamanho: 1
Campo: gera historico saida | Tipo: Texto | Tamanho: 1
Campo: gera historico entrada | Tipo: Texto | Tamanho: 1
Campo: descricao impressa | Tipo: Texto | Tamanho: 15
Campo: super simples peca | Tipo: Sim/Nao | Tamanho: -
Campo: super simples servico | Tipo: Sim/Nao | Tamanho: -
Campo: tpNF | Tipo: Inteiro | Tamanho: -
Campo: indPag | Tipo: Inteiro | Tamanho: -
Campo: indPres | Tipo: Inteiro | Tamanho: -
Campo: finNfe | Tipo: Inteiro | Tamanho: -
Campo: indFinal | Tipo: Inteiro | Tamanho: -
Campo: CSOSN | Tipo: Inteiro | Tamanho: -

Tabela: Tabela de Pecas
------------------------------
Campo: CODIGO | Tipo: Texto | Tamanho: 30
Campo: PRODUTO | Tipo: Texto | Tamanho: 40
Campo: LOCACAO | Tipo: Texto | Tamanho: 3
Campo: LINHA | Tipo: Texto | Tamanho: 3
Campo: UNID | Tipo: Texto | Tamanho: 6
Campo: SALDO_MINI | Tipo: Double | Tamanho: -
Campo: SALDO_ESTO | Tipo: Double | Tamanho: -
Campo: PRC_VENDA | Tipo: Double | Tamanho: -
Campo: HISTO_01 | Tipo: Texto | Tamanho: 70
Campo: HISTO_02 | Tipo: Texto | Tamanho: 70
Campo: HISTO_03 | Tipo: Texto | Tamanho: 70
Campo: HISTO_04 | Tipo: Texto | Tamanho: 70
Campo: CFOP | Tipo: Texto | Tamanho: 4
Campo: NCM | Tipo: Texto | Tamanho: 8
Campo: CEST | Tipo: Texto | Tamanho: 8
Campo: cEAN | Tipo: Texto | Tamanho: 14
Campo: QtdeMaquina | Tipo: Double | Tamanho: -

Tabela: Tabela Super Simples
------------------------------
Campo: CATEGORIA | Tipo: Texto | Tamanho: 2
Campo: VALOR INICIAL | Tipo: Double | Tamanho: -
Campo: VALOR FINAL | Tipo: Double | Tamanho: -
Campo: ALIQUOTA PECAS | Tipo: Moeda | Tamanho: -
Campo: ALIQUOTA MAO OBRA | Tipo: Moeda | Tamanho: -

Tabela: tbCadProd
------------------------------
Campo: IDProd | Tipo: Texto | Tamanho: 30
Campo: DescProd | Tipo: Texto | Tamanho: 255
Campo: IDConv_Prod | Tipo: Texto | Tamanho: 30
Campo: Unidade | Tipo: Texto | Tamanho: 255
Campo: ncm | Tipo: Texto | Tamanho: 255

Tabela: tblCest
------------------------------
Campo: ncm | Tipo: Texto | Tamanho: 255
Campo: cest | Tipo: Texto | Tamanho: 255

Tabela: tblChaveNfeEntrada
------------------------------
Campo: Cdigo | Tipo: Longo | Tamanho: -
Campo: ChaveNfe | Tipo: Texto | Tamanho: 44

Tabela: tblCondPagamento
------------------------------
Campo: ID_condPagto | Tipo: Texto | Tamanho: 2
Campo: descricao | Tipo: Texto | Tamanho: 50
Campo: parcelado | Tipo: Sim/Nao | Tamanho: -
Campo: mostrar | Tipo: Sim/Nao | Tamanho: -

Tabela: tblCSOSN
------------------------------
Campo: ICMS_CST | Tipo: Inteiro | Tamanho: -
Campo: ICMS_Descricao | Tipo: Texto | Tamanho: 120
Campo: ICMS_Observacoes | Tipo: Memo | Tamanho: 0

Tabela: tblDetImpostos
------------------------------
Campo: CHAVE NOTA FISCAL | Tipo: Longo | Tamanho: -
Campo: CODIGO | Tipo: Texto | Tamanho: 30
Campo: ICMS_CST | Tipo: Inteiro | Tamanho: -
Campo: ICMS_orig | Tipo: Inteiro | Tamanho: -
Campo: ICMS_modBC | Tipo: Inteiro | Tamanho: -
Campo: ICMS_pRedBC | Tipo: Double | Tamanho: -
Campo: ICMS_vBC | Tipo: Double | Tamanho: -
Campo: ICMS_pICMS | Tipo: Double | Tamanho: -
Campo: ICMS_vICMS | Tipo: Double | Tamanho: -
Campo: ICMS_modBCST | Tipo: Inteiro | Tamanho: -
Campo: ICMS_pMVAST | Tipo: Double | Tamanho: -
Campo: ICMS_pRedBCST | Tipo: Double | Tamanho: -
Campo: ICMS_vBCST | Tipo: Double | Tamanho: -
Campo: ICMS_pICMSST | Tipo: Double | Tamanho: -
Campo: ICMS_vICMSST | Tipo: Double | Tamanho: -
Campo: ICMS_vBCSTRet | Tipo: Double | Tamanho: -
Campo: ICMS_vICMSSRet | Tipo: Double | Tamanho: -
Campo: ICMS_vBCSTDest | Tipo: Double | Tamanho: -
Campo: ICMS_vICMSSTDest | Tipo: Double | Tamanho: -
Campo: ICMS_motDesICMS | Tipo: Inteiro | Tamanho: -
Campo: ICMS_pBCOp | Tipo: Double | Tamanho: -
Campo: ICMS_UFST | Tipo: Texto | Tamanho: 2
Campo: ICMS_pCredSN | Tipo: Double | Tamanho: -
Campo: ICMS_vCredICMSSN | Tipo: Double | Tamanho: -
Campo: ICMS_vICMSDeson | Tipo: Double | Tamanho: -
Campo: ICMS_vICMSOp | Tipo: Double | Tamanho: -
Campo: ICMS_pDif | Tipo: Double | Tamanho: -
Campo: ICMS_vICMSDif | Tipo: Double | Tamanho: -
Campo: ICMS_vAntecipado | Tipo: Double | Tamanho: -

Tabela: tblFone
------------------------------
Campo: id_ClienteFornec | Tipo: Longo | Tamanho: -
Campo: contato | Tipo: Texto | Tamanho: 20
Campo: nro_fone | Tipo: Texto | Tamanho: 11

Tabela: tblIbpt
------------------------------
Campo: codigo | Tipo: Texto | Tamanho: 255
Campo: ex | Tipo: Texto | Tamanho: 255
Campo: tipo | Tipo: Texto | Tamanho: 255
Campo: descricao | Tipo: Texto | Tamanho: 255
Campo: nacionalfederal | Tipo: Texto | Tamanho: 255
Campo: importadosfederal | Tipo: Texto | Tamanho: 255
Campo: estadual | Tipo: Texto | Tamanho: 255
Campo: municipal | Tipo: Texto | Tamanho: 255
Campo: vigenciainicio | Tipo: Data/Hora | Tamanho: -
Campo: vigenciafim | Tipo: Data/Hora | Tamanho: -
Campo: chave | Tipo: Texto | Tamanho: 255
Campo: versao | Tipo: Texto | Tamanho: 255
Campo: fonte | Tipo: Texto | Tamanho: 255

Tabela: tblMapaFaturamento
------------------------------
Campo: ID | Tipo: Longo | Tamanho: -
Campo: ano | Tipo: Texto | Tamanho: 4
Campo: mes | Tipo: Texto | Tamanho: 2
Campo: v_Com_ST | Tipo: Double | Tamanho: -
Campo: v_Sem_ST | Tipo: Double | Tamanho: -
Campo: v_Mao_Obra | Tipo: Double | Tamanho: -
Campo: v_Dev_Com_ST | Tipo: Double | Tamanho: -
Campo: v_Dev_Sem_ST | Tipo: Double | Tamanho: -
Campo: p_Com_ST | Tipo: Double | Tamanho: -
Campo: p_Sem_ST | Tipo: Double | Tamanho: -
Campo: p_MaoObra | Tipo: Double | Tamanho: -

Tabela: tblMaquinas
------------------------------
Campo: id_Maquina | Tipo: Longo | Tamanho: -
Campo: Cliente | Tipo: Longo | Tamanho: -
Campo: tipo | Tipo: Longo | Tamanho: -
Campo: linha | Tipo: Texto | Tamanho: 3
Campo: modelo | Tipo: Longo | Tamanho: -
Campo: apelido | Tipo: Texto | Tamanho: 20
Campo: operador | Tipo: Texto | Tamanho: 30
Campo: ano | Tipo: Texto | Tamanho: 4
Campo: serie | Tipo: Texto | Tamanho: 30
Campo: transmissao | Tipo: Texto | Tamanho: 3
Campo: motor | Tipo: Texto | Tamanho: 20
Campo: tipoMotor | Tipo: Texto | Tamanho: 10
Campo: bracoExtensivel | Tipo: Texto | Tamanho: 3
Campo: cabineFechada | Tipo: Texto | Tamanho: 3
Campo: imagemPlaqueta | Tipo: Texto | Tamanho: 255
Campo: setor | Tipo: Texto | Tamanho: 40
Campo: valor | Tipo: Double | Tamanho: -
Campo: Obs | Tipo: Memo | Tamanho: 0

Tabela: tblModeloMaquina
------------------------------
Campo: ID_Linha | Tipo: Texto | Tamanho: 3
Campo: ID_Modelo | Tipo: Longo | Tamanho: -
Campo: Descricao | Tipo: Texto | Tamanho: 25

Tabela: tblNcm
------------------------------
Campo: IDNcm | Tipo: Texto | Tamanho: 8

Tabela: tblNfe
------------------------------
Campo: CHAVE NOTA FISCAL | Tipo: Longo | Tamanho: -
Campo: chaveNfe | Tipo: Texto | Tamanho: 44
Campo: recibo | Tipo: Texto | Tamanho: 255
Campo: nProtocolo | Tipo: Texto | Tamanho: 255
Campo: dhProtocolo | Tipo: Texto | Tamanho: 255
Campo: nProtocoloCanc | Tipo: Texto | Tamanho: 255
Campo: dProtocoloCanc | Tipo: Texto | Tamanho: 255
Campo: procCancNFe | Tipo: Texto | Tamanho: 255
Campo: danfeimpresso | Tipo: Sim/Nao | Tamanho: -

Tabela: tblPrazoPagamento
------------------------------
Campo: ID_PrazoPagamento | Tipo: Longo | Tamanho: -
Campo: formaPagamento | Tipo: Texto | Tamanho: 50
Campo: qtdeParcelas | Tipo: Inteiro | Tamanho: -
Campo: intervaloDias | Tipo: Inteiro | Tamanho: -

Tabela: tblQtdeAplicadaMaquina_temp
------------------------------
Campo: Codigo | Tipo: Longo | Tamanho: -
Campo: Descricao | Tipo: Texto | Tamanho: 40
Campo: QtdeAplicada | Tipo: Texto | Tamanho: 255
Campo: Obs | Tipo: Memo | Tamanho: 0

Tabela: tblSimplesImpostosProdutos
------------------------------
Campo: ID | Tipo: Longo | Tamanho: -
Campo: vFaixaInicial | Tipo: Double | Tamanho: -
Campo: vFaixaFinal | Tipo: Double | Tamanho: -
Campo: pAliqSemSt | Tipo: Double | Tamanho: -
Campo: pAliqComSt | Tipo: Double | Tamanho: -
Campo: pIRPJ | Tipo: Double | Tamanho: -
Campo: pCSLL | Tipo: Double | Tamanho: -
Campo: pCofins | Tipo: Double | Tamanho: -
Campo: pPIS_Pasep | Tipo: Double | Tamanho: -
Campo: pCPP | Tipo: Double | Tamanho: -
Campo: pICMS | Tipo: Double | Tamanho: -

Tabela: tblSimplesImpostosServicos
------------------------------
Campo: ID | Tipo: Longo | Tamanho: -
Campo: vFaixaInicial | Tipo: Moeda | Tamanho: -
Campo: vFaixaFinal | Tipo: Moeda | Tamanho: -
Campo: pAliquota | Tipo: Double | Tamanho: -
Campo: pIRPJ | Tipo: Double | Tamanho: -
Campo: pCSLL | Tipo: Double | Tamanho: -
Campo: pCOFINS | Tipo: Double | Tamanho: -
Campo: pPIS | Tipo: Double | Tamanho: -
Campo: pCPP | Tipo: Double | Tamanho: -
Campo: pISS | Tipo: Double | Tamanho: -

Tabela: tbltipoMaquina
------------------------------
Campo: id_tipo | Tipo: Longo | Tamanho: -
Campo: tipo | Tipo: Texto | Tamanho: 30

Tabela: tblUF
------------------------------
Campo: CODUF | Tipo: Texto | Tamanho: 2
Campo: UF | Tipo: Texto | Tamanho: 2

Tabela: tblXmlSefaz
------------------------------
Campo: nsu | Tipo: Texto | Tamanho: 15
Campo: eventoNfe | Tipo: Texto | Tamanho: 36
Campo: chaveNfe | Tipo: Texto | Tamanho: 44

Tabela: USysRibbons
------------------------------
Campo: lngID | Tipo: Longo | Tamanho: -
Campo: RibbonName | Tipo: Texto | Tamanho: 255
Campo: RibbonXml | Tipo: Memo | Tamanho: 0

RELACIONAMENTOS
==================================================
Tabela Pai: tbltipoMaquina (id_tipo) --> Tabela Filha: tblMaquinas (tipo)
Tabela Pai: tblModeloMaquina (ID_Modelo) --> Tabela Filha: tblMaquinas (modelo)
Tabela Pai: Cadastro de Empresas (codigo da loja) --> Tabela Filha: Notas fiscais (LOJA)
Tabela Pai: Fornecedores e Clientes (CHAVE CLIENTE_FORNEC) --> Tabela Filha: Notas fiscais (CHAVE CLIENTE_FORNEC)
Tabela Pai: Fornecedores e Clientes (CHAVE CLIENTE_FORNEC) --> Tabela Filha: tblFone (id_ClienteFornec)
Tabela Pai: Linha (codigo) --> Tabela Filha: tblMaquinas (linha)
Tabela Pai: Municipio (Município) --> Tabela Filha: Fornecedores e Clientes (codigo Municipio)
Tabela Pai: Notas fiscais (CHAVE NOTA FISCAL) --> Tabela Filha: Contas a pagar/receber (CHAVE NOTA FISCAL)
Tabela Pai: Notas fiscais (CHAVE NOTA FISCAL) --> Tabela Filha: Movimentacao dos itens (CHAVE NOTA FISCAL)
Tabela Pai: Notas fiscais (CHAVE NOTA FISCAL) --> Tabela Filha: tblChaveNfeEntrada (Cdigo)
Tabela Pai: Notas fiscais (CHAVE NOTA FISCAL) --> Tabela Filha: tblDetImpostos (CHAVE NOTA FISCAL)
Tabela Pai: Notas fiscais (CHAVE NOTA FISCAL) --> Tabela Filha: tblNfe (CHAVE NOTA FISCAL)
Tabela Pai: Tabela de naturezas (natureza) --> Tabela Filha: Notas fiscais (ENT_OU_SAI)
Tabela Pai: Tabela de Pecas (CODIGO) --> Tabela Filha: Conversao de itens (CODIGO)
Tabela Pai: Tabela de Pecas (CODIGO) --> Tabela Filha: Movimentacao dos itens (CODIGO)
Tabela Pai: Tabela de Pecas (CODIGO) --> Tabela Filha: tblDetImpostos (CODIGO)
Tabela Pai: tblCondPagamento (ID_condPagto) --> Tabela Filha: Notas fiscais (tPag)
Tabela Pai: tblMaquinas (id_Maquina) --> Tabela Filha: Notas fiscais (id_Maquina)
Tabela Pai: tblPrazoPagamento (ID_PrazoPagamento) --> Tabela Filha: Notas fiscais (ID_PrazoPagamento)
Tabela Pai: tblUF (CODUF) --> Tabela Filha: Municipio (UF)
```
