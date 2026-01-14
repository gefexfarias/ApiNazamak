# Plano: Adicionar Referências Cruzadas ao Modal de Produtos

Este plano descreve as etapas para incluir a exibição e o cadastro de conversões (referências cruzadas) no modal de detalhes do produto, acessado a partir da listagem de notas fiscais.

## 1. Atualização das Interfaces
- Modificar a interface `Product` em [ProductModal.tsx](file:///c:/AppsIA/ApiNazamak/nazamak-web-dash-57/src/components/ProductModal.tsx) para incluir o campo opcional `conversoes: string[]`.
- Atualizar o estado `selectedProduct` em [NotesQuery.tsx](file:///c:/AppsIA/ApiNazamak/nazamak-web-dash-57/src/pages/NotesQuery.tsx) para suportar o novo campo.

## 2. Melhoria do ProductModal
- **Exibição**: Adicionar uma seção "Ref. Cruzada" abaixo do saldo em estoque, listando as conversões existentes em um grid (similar ao [ProductQuery.tsx](file:///c:/AppsIA/ApiNazamak/nazamak-web-dash-57/src/pages/ProductQuery.tsx)).
- **Cadastro**: Implementar a funcionalidade de adicionar novas conversões diretamente pelo modal:
  - Adicionar o botão "+ Cadastrar Conversão".
  - Criar um sub-modal ou expandir o modal atual para entrada do novo código.
  - Integrar com `apiService.cadastrarConversao`.
- **Feedback**: Adicionar estados de carregamento e mensagens de sucesso/erro (sonner).

## 3. Integração no NotesQuery
- Atualizar a função `handleProductClick` para capturar as `Conversoes` retornadas pela API e passá-las ao modal.
- Implementar um mecanismo de atualização (re-fetch) para que, após cadastrar uma conversão no modal, a lista de conversões seja atualizada imediatamente.

## 4. Verificação
- Testar a abertura do modal a partir de uma nota fiscal.
- Validar a exibição de conversões existentes.
- Testar o cadastro de uma nova conversão e verificar se ela aparece na lista sem fechar o modal ou após a reabertura.

Deseja que eu prossiga com essas alterações?