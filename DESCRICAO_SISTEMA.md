# Projeto: Ecossistema Nazamak (API + Dashboard)

O sistema **Nazamak** é uma solução moderna de integração que serve como ponte entre um banco de dados legado em Microsoft Access e interfaces de alta performance. Ele oferece gestão de estoque, consulta de notas fiscais e um sofisticado sistema de impressão de etiquetas térmicas/adesivas.

## 🛠 Tecnologias Utilizadas

### Backend (API)
- **Linguagem:** Python 3.11+ (Flask)
- **Banco de Dados:** Microsoft Access (`NAZAMAK.accdb`) via `pyodbc`.
- **Arquitetura:** Baseada em Blueprints para separação de domínios (Produtos, Notas, Conversões).

### Frontend (Dashboard Moderno)
- **Framework:** React + Vite (Typescript)
- **Estilização:** Tailwind CSS (Modern UI/UX)
- **Ícones:** Lucide React
- **Gerenciamento de Estado:** React Query & Local Hooks

---

## 🚀 Funcionalidades Principais

### 1. Busca Inteligente de Produtos
O sistema possui um motor de busca que unifica códigos principais e referências cruzadas (conversões).
- **Resolução Automática:** Ao pesquisar por um código de barras ou referência alternativa, o sistema identifica e exibe os dados do **Produto Principal** automaticamente.
- **Cálculo de Saldo Real:** O estoque é calculado em tempo real percorrendo todo o histórico de movimentações (Entradas vs Saídas).

### 2. Impressão de Etiquetas High-Precision
Um módulo de impressão unificado (`printLabels.ts`) configurado para papel **Carta (Letter - 217x280mm)**.
- **Layout de Grade:** 4 colunas x 15 linhas (60 etiquetas por folha).
- **Posição Inicial (Offset):** O usuário pode escolher em qual Linha e Coluna a impressão deve começar, permitindo o reaproveitamento de folhas adesivas já iniciadas.
- **Réguas de Auxílio:** Números indicadores (1-15 e 1-4) impressos nas margens para facilitar a identificação da posição inicial em folhas novas.

### 3. Módulos de Impressão
- **Por Nota Fiscal:** Seleção rápida de itens de uma NF de entrada com quantidades automáticas.
- **Impressão Avulsa (Manual):** Interface para "bipagem" manual de produtos e quantidades, permitindo montar uma folha de etiquetas customizada.

### 4. Gestão de Referências Cruzadas
Interface para vincular novos códigos de barras ou códigos de fornecedores a produtos existentes no cadastro master.

---

## 📂 Estrutura de Arquivos Relevante

### Raiz (Backend)
- `app.py`: Ponto de entrada da API.
- `produto.py`: Motor de busca e saldo de produtos.
- `conversao.py`: Lógica de gerenciamento de referências cruzadas.

### `nazamak-web-dash-57` (Frontend)
- `src/pages/ManualLabelPrint.tsx`: Interface de impressão manual.
- `src/pages/ProductQuery.tsx`: Consulta moderna de estoque.
- `src/utils/printLabels.ts`: **Motor mestre de impressão**. Contém toda a lógica de CSS `@media print`, margens e paginação.
- `src/services/api.ts`: Camada de comunicação com o backend Python.

---

## 🔗 Endpoints Principais (API)

| Rota | Método | Descrição |
| :--- | :--- | :--- |
| `/api/produto/<codigo>` | `GET` | Retorna descrição, saldo, locação e conversões. |
| `/api/produtos-da-nota/<nro>` | `GET` | Detalha itens de uma NF para conferência/etiquetagem. |
| `/api/cadastrar-conversao` | `POST` | Vincula uma nova referência cruzada a um código principal. |

---

## 🎯 Objetivo de Negócio
Garantir agilidade na identificação de peças e precisão no controle de estoque da **Nazamak**, transformando dados legados em informações acionáveis em tempo real através de uma interface web premium e funcional.
