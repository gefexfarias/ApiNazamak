/**
 * ============================================================
 * Motor de Impressão de Etiquetas — printLabels.ts
 * ============================================================
 * Gera o HTML e CSS de impressão dinamicamente a partir de um
 * LabelLayout configurado em labelLayouts.ts.
 *
 * O CSS de @media print é injetado no DOM a cada chamada,
 * respeitando as dimensões do layout escolhido.
 * ============================================================
 */

import { LabelLayout } from './labelLayouts';

export interface LabelItem {
  CodigoProduto: string;
  Descricao: string;
  Locacao?: string;
  Quantidade: number;
}

export const printLabels = (
  items: LabelItem[],
  startRow: number,
  startCol: number,
  layout: LabelLayout
) => {
  // ── 1. Limpeza de execuções anteriores ───────────────────
  const existingPrint = document.getElementById('print-container');
  if (existingPrint) existingPrint.remove();

  const existingStyle = document.getElementById('print-dynamic-style');
  if (existingStyle) existingStyle.remove();

  // ── 2. Injetar CSS dinâmico baseado no layout ─────────────
  const etiqPorFolha = layout.numColunas * layout.numLinhas;
  const style = document.createElement('style');
  style.id = 'print-dynamic-style';
  style.textContent = `
    @media print {
      @page {
        margin: 0;
        size: ${layout.tamanhoPagina};
      }

      body > *:not(#print-container) {
        display: none !important;
      }

      #print-container {
        display: block !important;
        position: absolute;
        left: 0;
        top: 0;
        width: ${layout.paginaLargMm}mm;
        background: white !important;
        z-index: 9999;
      }

      .print-page {
        display: grid !important;
        position: relative;
        width: ${layout.paginaLargMm}mm;
        height: ${layout.paginaAltMm}mm;
        padding-top: ${layout.margemSupMm}mm;
        padding-bottom: ${layout.margemInfMm}mm;
        padding-left: ${layout.margemEsqMm}mm;
        padding-right: ${layout.margemDirMm}mm;
        grid-template-columns: repeat(${layout.numColunas}, ${layout.etiqLargMm}mm);
        grid-template-rows: repeat(${layout.numLinhas}, ${layout.etiqAltMm}mm);
        column-gap: ${layout.gapColMm}mm;
        row-gap: ${layout.gapLinMm}mm;
        page-break-after: always;
        break-after: page;
        box-sizing: border-box;
        overflow: hidden;
      }

      .row-number {
        position: absolute;
        left: 4mm;
        font-size: 7pt;
        color: #bbb;
        font-weight: bold;
        height: ${layout.etiqAltMm}mm;
        display: flex;
        align-items: center;
        pointer-events: none;
      }

      .col-number {
        position: absolute;
        top: 4mm;
        font-size: 7pt;
        color: #bbb;
        font-weight: bold;
        width: ${layout.etiqLargMm}mm;
        text-align: center;
        pointer-events: none;
      }

      .etiqueta {
        padding: 1mm 1.5mm;
        box-sizing: border-box;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        justify-content: center;
        font-family: Arial, sans-serif;
        color: black !important;
        text-align: left;
        border: 0.01mm solid transparent;
      }

      .etiqueta-codigo {
        font-weight: bold;
        font-size: ${layout.fonteCodPt}pt;
        margin-bottom: 2pt;
        line-height: 1;
      }

      .etiqueta-desc {
        font-size: ${layout.fonteDescPt}pt;
        white-space: normal;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        max-width: 100%;
        line-height: 1.1;
        margin-bottom: 2pt;
      }

      .etiqueta-loc {
        font-size: ${layout.fonteLocPt}pt;
        font-weight: bold;
        margin-top: 0px;
        line-height: 1;
      }
    }
  `;
  document.head.appendChild(style);

  // ── 3. Montar lista de etiquetas (offset + reais) ─────────
  const allLabels: HTMLElement[] = [];

  // Etiquetas vazias para offset de posição inicial
  const offset = ((startRow - 1) * layout.numColunas) + (startCol - 1);
  for (let i = 0; i < offset; i++) {
    const spacer = document.createElement('div');
    spacer.className = 'etiqueta';
    spacer.style.visibility = 'hidden';
    allLabels.push(spacer);
  }

  // Etiquetas reais
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

  // ── 4. Agrupar em páginas e montar container ──────────────
  const printContainer = document.createElement('div');
  printContainer.id = 'print-container';
  printContainer.style.display = 'none';

  for (let i = 0; i < allLabels.length; i += etiqPorFolha) {
    const page = document.createElement('div');
    page.className = 'print-page';

    // Réguas de auxílio apenas na primeira folha completa
    if (startRow === 1 && startCol === 1) {
      // Números das linhas na margem esquerda
      for (let r = 1; r <= layout.numLinhas; r++) {
        const rowNum = document.createElement('div');
        rowNum.className = 'row-number';
        rowNum.innerText = r.toString();
        rowNum.style.top = `${layout.margemSupMm + (r - 1) * (layout.etiqAltMm + layout.gapLinMm)}mm`;
        page.appendChild(rowNum);
      }

      // Números das colunas no topo
      for (let c = 1; c <= layout.numColunas; c++) {
        const colNum = document.createElement('div');
        colNum.className = 'col-number';
        colNum.innerText = c.toString();
        colNum.style.left = `${layout.margemEsqMm + (c - 1) * (layout.etiqLargMm + layout.gapColMm)}mm`;
        page.appendChild(colNum);
      }
    }

    const pageLabels = allLabels.slice(i, i + etiqPorFolha);
    pageLabels.forEach(label => page.appendChild(label.cloneNode(true)));

    printContainer.appendChild(page);
  }

  document.body.appendChild(printContainer);

  // ── 5. Disparar impressão após renderização ───────────────
  setTimeout(() => {
    window.print();
  }, 150);

  return true;
};
