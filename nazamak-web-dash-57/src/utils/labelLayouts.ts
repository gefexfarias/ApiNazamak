/**
 * ============================================================
 * CONFIGURAÇÃO DE LAYOUTS DE ETIQUETAS  - labelLayouts.ts
 * ============================================================
 * Para adicionar um novo modelo de folha, basta incluir uma nova
 * entrada no objeto LABEL_LAYOUTS abaixo e adicionar o ID dela
 * ao tipo LabelLayoutId.
 *
 * 🖨️ UNIDADES: todas as medidas são em milímetros (mm) e
 * tamanhos de fonte em pontos tipográficos (pt).
 * ============================================================
 *
 * ╔══════════════════════════════════════════════════════════╗
 * ║              ⚠️  REGRA PERMANENTE DO SISTEMA ⚠️           ║
 * ║                     "MANOBRA A4"                         ║
 * ╠══════════════════════════════════════════════════════════╣
 * ║  TODOS os layouts DEVEM usar:                            ║
 * ║    tamanhoPagina: 'A4'                                   ║
 * ║                                                          ║
 * ║  O papel físico na impressora pode ser CARTA (Letter),   ║
 * ║  mas o DRIVER DA IMPRESSORA e o CSS @page devem ser      ║
 * ║  configurados como A4 — sempre.                          ║
 * ║                                                          ║
 * ║  O campo `paginaAltMm` controla a altura da GRADE de     ║
 * ║  etiquetas no HTML (não o driver). Para papel Carta,     ║
 * ║  use 279.4mm (11"). Para A4 puro, use 297mm.             ║
 * ║                                                          ║
 * ║  ✅ CORRETO:  tamanhoPagina: 'A4'  (sempre)              ║
 * ║  ❌ ERRADO:   tamanhoPagina: 'letter'                    ║
 * ║                                                          ║
 * ║  Documentado em: DESCRICAO_SISTEMA.md § Manobra A4       ║
 * ╚══════════════════════════════════════════════════════════╝
 */


export interface LabelLayout {
  /** Nome legível exibido no seletor */
  nome: string;
  /** Descrição curta com dica de uso */
  descricao: string;
  /** Tamanho da página para @page (ex: "A4", "letter") */
  tamanhoPagina: 'A4' | 'letter';
  /** Largura total da folha impressa em mm */
  paginaLargMm: number;
  /** Altura total da folha impressa em mm */
  paginaAltMm: number;
  /** Número de colunas de etiquetas */
  numColunas: number;
  /** Número de linhas de etiquetas */
  numLinhas: number;
  /** Largura de cada etiqueta individual em mm */
  etiqLargMm: number;
  /** Altura de cada etiqueta individual em mm */
  etiqAltMm: number;
  /** Margem esquerda da folha em mm */
  margemEsqMm: number;
  /** Margem superior da folha em mm */
  margemSupMm: number;
  /** Margem direita da folha em mm */
  margemDirMm: number;
  /** Margem inferior da folha em mm */
  margemInfMm: number;
  /** Espaçamento horizontal entre colunas em mm */
  gapColMm: number;
  /** Espaçamento vertical entre linhas em mm */
  gapLinMm: number;
  /** Tamanho da fonte do código do produto (pt) */
  fonteCodPt: number;
  /** Tamanho da fonte da descrição (pt) */
  fonteDescPt: number;
  /** Tamanho da fonte da locação/localização (pt) */
  fonteLocPt: number;
  /** Observações de configuração de impressão para o usuário */
  observacoes?: string;
}

// ─────────────────────────────────────────────────────────────
// IDs disponíveis — adicione o ID da nova etiqueta aqui também
// ─────────────────────────────────────────────────────────────
export type LabelLayoutId =
  | 'carta_4x15'
  | 'carta_4x20_8020';
  // ↑ Para adicionar novo layout: inclua o ID nesta listagem
  //   e adicione a configuração completa no LABEL_LAYOUTS abaixo.

// ─────────────────────────────────────────────────────────────
// CATÁLOGO DE LAYOUTS
// ─────────────────────────────────────────────────────────────
export const LABEL_LAYOUTS: Record<LabelLayoutId, LabelLayout> = {

  /**
   * Layout padrão atual do sistema Nazamak.
   * Folha Carta física impressa com driver A4.
   * ⚠️ Configurar impressora: Tamanho A4 + Escala 100%
   */
  carta_4x15: {
    nome: 'Carta 4×15 (Padrão)',
    descricao: '60 etiquetas/folha — Folha Carta c/ driver A4',
    tamanhoPagina: 'A4',
    paginaLargMm: 210,
    paginaAltMm: 297,
    numColunas: 4,
    numLinhas: 15,
    etiqLargMm: 44.45,
    etiqAltMm: 16.93,
    margemEsqMm: 15,
    margemSupMm: 13,
    margemDirMm: 8.2,
    margemInfMm: 13,
    gapColMm: 3,
    gapLinMm: 0,
    fonteCodPt: 13,
    fonteDescPt: 7.5,
    fonteLocPt: 7.5,
    observacoes: 'Imprimir com driver A4, papel Carta físico. Escala 100%, margens zeradas.',
  },

  /**
   * Pimaco 8020-1 — Carta 4×20 (80 etiquetas/folha)
   * Etiqueta: 44,45mm × 12,7mm
   * ⊐40 colúncias: 15 + 4×44,45 + 3×3 + 8,2 = 210mm ✓
   * ⊐ vertical: 13 + 20×12,7 + 13 = 280mm (Carta 279,4mm) ✓
   * ⚠️ Driver A4 + papel Carta físico, escala 100%
   */
  carta_4x20_8020: {
    nome: 'Carta 4×20 — Pimaco 8020-1',
    descricao: '80 etiquetas/folha — 44,45×12,7mm, Carta c/ driver A4',
    tamanhoPagina: 'A4',
    paginaLargMm: 210,
    paginaAltMm: 279.4,     // Altura real do papel Carta (11")
    numColunas: 4,
    numLinhas: 20,
    etiqLargMm: 44.45,      // Conforme embalagem: 44,45mm
    etiqAltMm: 12.7,        // Conforme embalagem: 12,7mm
    margemEsqMm: 15,
    margemSupMm: 13,
    margemDirMm: 8.2,       // Calculado: 210 - 15 - (4×44.45) - (3×3) = 8.2mm
    margemInfMm: 13,
    gapColMm: 3,
    gapLinMm: 0,
    fonteCodPt: 9,           // Reduzido proporcionalmente (etiq. 25% menor que a 4x15)
    fonteDescPt: 5.5,
    fonteLocPt: 5.5,
    observacoes: 'Pimaco 8020-1. Driver A4, papel Carta físico (11"), escala 100%, margens zeradas.',
  },

};

/** ID do layout que é usado como padrão ao abrir as telas */
export const DEFAULT_LAYOUT_ID: LabelLayoutId = 'carta_4x15';
