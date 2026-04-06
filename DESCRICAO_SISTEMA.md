# Descrição do Projeto: ApiNazamak

O **ApiNazamak** é um sistema de integração e consulta de dados desenvolvido para servir como uma ponte (API) entre um banco de dados legado em Microsoft Access e interfaces modernas (Web, Mobile, BI).

## 🛠 Tecnologias Utilizadas

- **Linguagem:** Python 3.x
- **Framework Web:** Flask
- **Banco de Dados:** Microsoft Access (`NAZAMAK.accdb`)
- **Conectividade:** `pyodbc` (utilizando o driver ODBC do Access)
- **Frontend de Teste:** HTML5, CSS3 e JavaScript (Vanilla)

---

## 🚀 Funcionalidades Principais

### 1. Consulta de Produtos e Estoque
O sistema permite consultar informações detalhadas de um produto através do seu código principal ou de um código de conversão (código de barras/alternativo).
- **Cálculo de Saldo Dinâmico:** O saldo não é apenas um campo estático; o sistema percorre a tabela de movimentações, somando entradas e subtraindo saídas para fornecer o estoque real no momento da consulta.
- **Vínculo de Unidades:** Identifica as unidades de conversão cadastradas para cada item.

### 2. Cadastro e Gestão de Conversões
Além da consulta, o sistema permite o **registro de novos códigos de conversão** para produtos existentes.
- **Validação de Integridade:** Garante que a conversão seja vinculada a um produto válido no cadastro master.
- **Tratamento de Duplicidade:** Evita cadastros redundantes para o mesmo par de códigos.

### 3. Gestão de Notas Fiscais de Entrada
API dedicada para listar e filtrar documentos fiscais de entrada.
- **Filtros Flexíveis:** Busca por intervalo de datas ou número específico da nota.
- **Relacionamento com Fornecedores:** Integração automática com o cadastro de fornecedores para exibir nomes em vez de apenas IDs.

### 4. Detalhamento de Itens e Impressão de Etiquetas
Sistema integrado para conferência de itens e geração de etiquetas de estoque.
- **Seleção de Itens:** Permite marcar quais produtos da nota devem ter etiquetas geradas.
- **Impressão em Grade (4x15):** Layout otimizado para papel adesivo A4 em 4 colunas por 15 linhas.
- **Quantidade Dinâmica:** Gera automaticamente o número de etiquetas correspondente à quantidade de cada item na nota.
- **Dados Impressos:** Código do produto, Descrição e Locação (setor/prateleira).

---

## 📂 Estrutura de Arquivos

- `app.py`: Servidor Flask e registro de rotas (Blueprints).
- `database.py`: Gerencia a conexão com o arquivo `.accdb`.
- `produto.py`: Lógica de negócio para saldos e informações de produtos.
- `notas.py`: Lógica para listagem de notas fiscais.
- `produtos_nota.py`: Lógica para detalhamento de itens de uma nota.
- `conversao.py`: Gerenciamento de códigos e unidades alternativas.
- `testar_produto.html`: Interface visual para testes rápidos de todos os endpoints.

---

## 🔗 Endpoints da API

| Rota | Método | Descrição |
| :--- | :--- | :--- |
| `/api/produto/<codigo>` | `GET` | Retorna descrição, saldo e conversões de um produto. |
| `/api/notas-entrada` | `GET` | Lista notas de entrada (parâmetros: `inicio`, `fim`, `numero`). |
| `/api/produtos-da-nota/<nro>` | `GET` | Lista os itens/produtos de uma nota específica. |
| `/api/conversoes/<codigo>` | `GET` | Retorna as unidades de conversão de um produto. |

---

## 🎯 Objetivo de Negócio
Este projeto visa modernizar o acesso aos dados do sistema **Nazamak**, permitindo que outras aplicações consumam informações de estoque e fiscais de forma padronizada via JSON, sem a necessidade de interagir diretamente com o banco de dados Access.
