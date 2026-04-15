/**
 * useLabelLayout — Hook para seleção persistente de layout de etiqueta.
 *
 * Salva automaticamente no localStorage a última etiqueta selecionada.
 * Na próxima abertura do app (mesmo após fechar o navegador), o último
 * layout escolhido é restaurado como padrão.
 *
 * Chave de armazenamento: 'nazamak_layout_etiqueta'
 */

import { useState, useCallback } from 'react';
import {
  LABEL_LAYOUTS,
  LabelLayoutId,
  LabelLayout,
  DEFAULT_LAYOUT_ID,
} from '@/utils/labelLayouts';

const STORAGE_KEY = 'nazamak_layout_etiqueta';

/** Lê o último layout salvo, com fallback seguro para o padrão */
function readStoredLayoutId(): LabelLayoutId {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    // Valida que o ID salvo ainda existe no catálogo atual
    if (stored && stored in LABEL_LAYOUTS) {
      return stored as LabelLayoutId;
    }
  } catch {
    // localStorage pode falhar em ambientes restritos (ex: modo privado)
  }
  return DEFAULT_LAYOUT_ID;
}

interface UseLabelLayoutReturn {
  /** ID do layout selecionado */
  layoutId: LabelLayoutId;
  /** Layout completo com todas as medidas */
  layout: LabelLayout;
  /** Atualiza o layout e persiste no localStorage */
  setLayoutId: (id: LabelLayoutId) => void;
}

export function useLabelLayout(): UseLabelLayoutReturn {
  const [layoutId, setLayoutIdState] = useState<LabelLayoutId>(readStoredLayoutId);

  const setLayoutId = useCallback((id: LabelLayoutId) => {
    setLayoutIdState(id);
    try {
      localStorage.setItem(STORAGE_KEY, id);
    } catch {
      // Falha silenciosa — o estado em memória ainda funciona
    }
  }, []);

  return {
    layoutId,
    layout: LABEL_LAYOUTS[layoutId],
    setLayoutId,
  };
}
