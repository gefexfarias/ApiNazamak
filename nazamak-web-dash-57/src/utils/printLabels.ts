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
        padding: 1mm 2.5mm;
        box-sizing: border-box;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        font-family: Arial, sans-serif;
        color: black !important;
        text-align: left;
        border: 0.01mm solid transparent;
      }

      .etiqueta-codigo {
        font-weight: bold;
        white-space: nowrap;
        width: 100%;
        text-align: center;
        margin-bottom: 2pt;
        line-height: 1;
        overflow: hidden;
      }

      .etiqueta-corpo {
        display: flex;
        justify-content: space-between;
        align-items: flex-end; /* Alinha a locação com o fundo da descrição */
        width: 100%;
        gap: 2mm;
        margin-top: auto;
        min-height: 0;
        overflow: hidden;
      }

      .etiqueta-desc-wrapper {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
      }

      .etiqueta-desc {
        font-size: ${layout.fonteDescPt}pt;
        white-space: normal;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        line-height: 1.1;
        width: 100%;
      }

      .etiqueta-loc {
        font-size: ${Math.max(10, layout.fonteLocPt + 3)}pt; /* Aumentado conforme solicitado */
        font-weight: bold;
        white-space: nowrap;
        flex-shrink: 0;
        text-align: right;
        background: #eee;
        padding: 1pt 3pt;
        border-radius: 2pt;
        line-height: 1;
        margin-bottom: 0.5pt; /* Alinha um pouco acima do limite extremo */
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
    const loc = (item.Locacao || '').trim();
    const cod = item.CodigoProduto.trim();
    
    // Cálculo de fonte dinâmica para o código (agora usando 100% da largura)
    const paddingHorizontalMm = 5; // 2.5mm cada lado
    const larguraDisponivelPt = (layout.etiqLargMm - paddingHorizontalMm) * 2.834;
    
    // Fator 0.85 para Arial Bold (seguro)
    let fontSizeCod = larguraDisponivelPt / (cod.length * 0.85);
    
    // Limites de segurança (baseados na altura da etiqueta)
    // Reservamos ~40% da altura para o código, deixando o resto (60%) para a descrição/locação
    const maxHeightCodPt = (layout.etiqAltMm * 0.40) * 2.834;
    fontSizeCod = Math.min(fontSizeCod, maxHeightCodPt);

    for (let i = 0; i < count; i++) {
      const label = document.createElement('div');
      label.className = 'etiqueta';
      label.innerHTML = `
        <div class="etiqueta-codigo" style="font-size: ${fontSizeCod.toFixed(1)}pt">${cod}</div>
        <div class="etiqueta-corpo">
          <div class="etiqueta-desc-wrapper">
            <div class="etiqueta-desc">${item.Descricao}</div>
          </div>
          ${loc ? `<div class="etiqueta-loc">${loc}</div>` : ''}
        </div>
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
