
/**
 * Utilitário centralizado para impressão de etiquetas (4x15 - Carta)
 */

export interface LabelItem {
  CodigoProduto: string;
  Descricao: string;
  Locacao?: string;
  Quantidade: number;
}

export const printLabels = (items: LabelItem[], startRow: number, startCol: number) => {
  // Remover contêiner de impressão anterior se existir
  const existingPrint = document.getElementById('print-container');
  if (existingPrint) {
    existingPrint.remove();
  }

  // Criar lista de todas as etiquetas a serem impressas
  const allLabels: HTMLElement[] = [];

  // 1. ADICIONAR ETIQUETAS VAZIAS (OFFSET)
  const offset = ((startRow - 1) * 4) + (startCol - 1);
  for (let i = 0; i < offset; i++) {
    const spacer = document.createElement('div');
    spacer.className = 'etiqueta';
    spacer.style.visibility = 'hidden';
    allLabels.push(spacer);
  }

  // 2. ADICIONAR ETIQUETAS REAIS
  items.forEach((item) => {
    const count = Math.max(0, Math.floor(item.Quantidade));
    for (let i = 0; i < count; i++) {
      const label = document.createElement('div');
      label.className = 'etiqueta';
      label.innerHTML = `
        <div class="etiqueta-codigo">${item.CodigoProduto}</div>
        <div class="etiqueta-desc">${item.Descricao}</div>
        <div class="etiqueta-loc">${item.Locacao || ''}</div>
      `;
      allLabels.push(label);
    }
  });

  if (allLabels.length <= offset) {
    return false;
  }

  const printContainer = document.createElement('div');
  printContainer.id = 'print-container';
  printContainer.style.display = 'none';

  // Agrupar em páginas de 60 etiquetas (15 linhas x 4 colunas)
  const labelsPerPage = 60;
  for (let i = 0; i < allLabels.length; i += labelsPerPage) {
    const page = document.createElement('div');
    page.className = 'print-page';
    
    // Só adicionar réguas se for uma folha nova (1x1)
    if (startRow === 1 && startCol === 1) {
      // Adicionar números das linhas (1 a 15) na margem esquerda
      for (let r = 1; r <= 15; r++) {
        const rowNum = document.createElement('div');
        rowNum.className = 'row-number';
        rowNum.innerText = r.toString();
        rowNum.style.top = `${13 + (r - 1) * 16.93}mm`;
        page.appendChild(rowNum);
      }

      // Adicionar números das colunas (1 a 4) no topo
      for (let c = 1; c <= 4; c++) {
        const colNum = document.createElement('div');
        colNum.className = 'col-number';
        colNum.innerText = c.toString();
        colNum.style.left = `${15 + (c - 1) * (44.45 + 3)}mm`;
        page.appendChild(colNum);
      }
    }
    
    const pageLabels = allLabels.slice(i, i + labelsPerPage);
    pageLabels.forEach(label => page.appendChild(label.cloneNode(true)));
    
    printContainer.appendChild(page);
  }

  document.body.appendChild(printContainer);
  
  // Aguardar renderização e disparar impressão
  setTimeout(() => {
    window.print();
  }, 150);

  return true;
};
