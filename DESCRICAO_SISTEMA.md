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
Um módulo de impressão unificado (`printLabels.ts`) com suporte a múltiplos modelos de folha configurados em `labelLayouts.ts`.

#### 🖨️ Regra Permanente: "Manobra A4"

> **Esta regra deve ser respeitada em TODOS os layouts, presentes e futuros, sem exceção.**

O sistema imprime em papel físico **Carta (Letter, 8,5" × 11" = 215,9 × 279,4mm)**, mas o **driver da impressora e o CSS `@page` são sempre configurados como A4**.

| | Configuração |
|---|---|
| **Driver da impressora** | A4 |
| **CSS `@page { size: ... }`** | A4 |
| **Papel físico na bandeja** | Carta (Letter) |
| **Campo `tamanhoPagina` no layout** | `'A4'` — sempre |

**Por que funciona:** o A4 (297mm) é mais alto que o Carta (279,4mm). O conteúdo das etiquetas é dimensionado para caber dentro da altura do Carta, e os ~17mm de diferença ficam como margem inferior extra — invisível na impressão.

**O campo `paginaAltMm`** nos layouts controla apenas a altura da **grade HTML** (o div de impressão), não o driver:
- Papel **Carta** → `paginaAltMm: 279.4`
- Papel **A4 puro** → `paginaAltMm: 297`

**Configuração obrigatória no navegador ao imprimir:**
- Tamanho do papel: **A4**
- Escala: **100%** (sem ajuste automático)
- Margens: **Nenhuma / Zeradas**

#### Layouts Cadastrados

| ID | Nome | Etiquetas/Folha | Etiqueta (mm) | Papel |
|---|---|---|---|---|
| `carta_4x15` | Carta 4×15 (Padrão) | 60 | 44,45 × 16,93 | Carta |
| `carta_4x20_8020` | Carta 4×20 — Pimaco 8020-1 | 80 | 44,45 × 12,7 | Carta |

Para adicionar um novo layout: editar apenas `src/utils/labelLayouts.ts`.

#### Seletor Persistente de Layout
O último layout selecionado pelo usuário é memorizado via `localStorage` (chave: `nazamak_layout_etiqueta`) e restaurado automaticamente na próxima sessão, mesmo após fechar o navegador. Implementado no hook `src/hooks/useLabelLayout.ts`.

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
- `src/pages/ManualLabelPrint.tsx`: Interface de impressão avulsa (bipagem manual de produtos).
- `src/pages/ProductQuery.tsx`: Consulta moderna de estoque.
- `src/components/notes/NoteProductsList.tsx`: Lista de produtos de uma NF com seleção e impressão de etiquetas.
- `src/utils/labelLayouts.ts`: **Catálogo de layouts de etiquetas.** Único arquivo a editar para adicionar novos modelos de folha. Contém a regra permanente "Manobra A4".
- `src/utils/printLabels.ts`: **Motor de impressão.** Gera o HTML e CSS de `@media print` dinamicamente a partir do layout selecionado.
- `src/hooks/useLabelLayout.ts`: Hook que persiste o último layout selecionado no `localStorage`.
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
