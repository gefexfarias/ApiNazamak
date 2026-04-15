
import { useState, useMemo } from "react";
import { Package, Loader2, Printer, CheckCircle2, Circle, LayoutGrid } from "lucide-react";
import { ProdutoNota } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

interface NoteProductsListProps {
  noteNumber: string;
  products: ProdutoNota[] | undefined;
  onProductClick: (productCode: string, productDescription: string) => void;
}

import { printLabels, LabelItem } from "@/utils/printLabels";
import { LABEL_LAYOUTS, LabelLayoutId } from "@/utils/labelLayouts";
import { useLabelLayout } from "@/hooks/useLabelLayout";

const NoteProductsList = ({ noteNumber, products, onProductClick }: NoteProductsListProps) => {
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set());
  const [startRow, setStartRow] = useState(1);
  const [startCol, setStartCol] = useState(1);
  const { layoutId, layout, setLayoutId } = useLabelLayout();

  // Inicializar todos como selecionados quando os produtos carregarem
  useMemo(() => {
    if (products && selectedIndices.size === 0) {
      const allIndices = new Set(products.map((_, i) => i));
      setSelectedIndices(allIndices);
    }
  }, [products]);

  const toggleProduct = (index: number) => {
    const newSelected = new Set(selectedIndices);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedIndices(newSelected);
  };

  const toggleAll = () => {
    if (products) {
      if (selectedIndices.size === products.length) {
        setSelectedIndices(new Set());
      } else {
        setSelectedIndices(new Set(products.map((_, i) => i)));
      }
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handlePrint = () => {
    if (!products) return;
    
    const itemsToPrint: LabelItem[] = [];
    products.forEach((product, index) => {
      if (selectedIndices.has(index)) {
        itemsToPrint.push({
          CodigoProduto: product.CodigoProduto,
          Descricao: product.Descricao,
          Locacao: product.Locacao,
          Quantidade: product.Quantidade
        });
      }
    });

    const success = printLabels(itemsToPrint, startRow, startCol, layout);
    if (!success) {
      toast.error("Nenhum item selecionado para impressão.");
    }
  };

  return (
    <div className="pt-4">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4 bg-nazamak-gray-light p-4 rounded-xl border border-nazamak-gray-medium/50 lg:flex-wrap">
        <div className="space-y-1">
            <h4 className="font-semibold text-nazamak-black flex items-center gap-2">
            <Package className="h-4 w-4" />
            Produtos da Nota
            </h4>
            <p className="text-[11px] text-muted-foreground whitespace-nowrap">Selecione os itens e a posição inicial</p>
        </div>
        
        {products && products.length > 0 && (
          <div className="flex flex-wrap items-center gap-4">

            {/* Seletor de Layout */}
            <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-nazamak-gray-medium shadow-sm">
              <LayoutGrid className="h-4 w-4 text-nazamak-yellow shrink-0" />
              <select
                value={layoutId}
                onChange={(e) => {
                  setLayoutId(e.target.value as LabelLayoutId);
                  setStartRow(1);
                  setStartCol(1);
                }}
                className="h-8 rounded border border-nazamak-yellow/40 bg-white px-2 text-xs font-medium text-nazamak-black focus:outline-none focus:border-nazamak-yellow cursor-pointer"
                title={layout.observacoes}
              >
                {(Object.entries(LABEL_LAYOUTS) as [LabelLayoutId, typeof layout][]).map(([id, l]) => (
                  <option key={id} value={id}>{l.nome}</option>
                ))}
              </select>
            </div>

            {/* Posição Inicial UI */}
            <div className="flex items-center gap-3 bg-white p-2 rounded-lg border border-nazamak-gray-medium shadow-sm">
                <div className="space-y-0.5">
                    <label className="text-[10px] font-bold text-nazamak-black/70 uppercase px-1">Linha</label>
                    <input 
                        type="number" 
                        min="1" 
                        max={layout.numLinhas} 
                        value={startRow}
                        onChange={(e) => setStartRow(Math.max(1, Math.min(layout.numLinhas, parseInt(e.target.value) || 1)))}
                        className="w-12 h-8 border rounded px-2 text-sm focus:ring-1 focus:ring-nazamak-yellow outline-none"
                    />
                </div>
                <div className="space-y-0.5">
                    <label className="text-[10px] font-bold text-nazamak-black/70 uppercase px-1">Coluna</label>
                    <input 
                        type="number" 
                        min="1" 
                        max={layout.numColunas} 
                        value={startCol}
                        onChange={(e) => setStartCol(Math.max(1, Math.min(layout.numColunas, parseInt(e.target.value) || 1)))}
                        className="w-12 h-8 border rounded px-2 text-sm focus:ring-1 focus:ring-nazamak-yellow outline-none"
                    />
                </div>
            </div>

            <div className="flex items-center gap-2">
                <Button 
                variant="outline" 
                size="sm" 
                onClick={toggleAll}
                className="text-xs h-9 border-nazamak-gray-medium"
                >
                {selectedIndices.size === products.length ? "Limpar" : "Todos"}
                </Button>
                
                <Button 
                size="sm" 
                onClick={handlePrint}
                disabled={selectedIndices.size === 0}
                className="bg-nazamak-yellow text-nazamak-black hover:bg-nazamak-yellow/90 text-xs h-9 gap-1.5 shadow-sm px-4"
                >
                <Printer className="h-4 w-4" />
                <span className="font-bold">IMPRIMIR (${selectedIndices.size})</span>
                </Button>
            </div>
          </div>
        )}
      </div>
      
      {products ? (
        <div className="space-y-2">
          {products.map((product, index) => (
            <div 
              key={index} 
              className={`p-3 rounded-lg border transition-all ${
                selectedIndices.has(index) 
                  ? "bg-nazamak-yellow/5 border-nazamak-yellow/30" 
                  : "bg-nazamak-gray-light border-transparent opacity-70"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="pt-1" onClick={(e) => { e.stopPropagation(); toggleProduct(index); }}>
                  <Checkbox 
                    checked={selectedIndices.has(index)} 
                    onCheckedChange={() => toggleProduct(index)}
                  />
                </div>
                
                <div 
                  className="flex-1 cursor-pointer"
                  onClick={() => onProductClick(product.CodigoProduto, product.Descricao)}
                >
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Código</div>
                      <div className="font-bold text-nazamak-black">{product.CodigoProduto}</div>
                    </div>
                    <div className="md:col-span-2">
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Descrição</div>
                      <div className="font-medium text-nazamak-black truncate" title={product.Descricao}>
                        {product.Descricao}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Qtd / Locação</div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-nazamak-black">{product.Quantidade}</span>
                        {product.Locacao && (
                          <span className="text-[11px] bg-nazamak-gray-medium px-1.5 py-0.5 rounded text-nazamak-black font-semibold">
                            {product.Locacao}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Unitário</div>
                      <div className="font-bold text-nazamak-yellow">
                        {formatCurrency(product.ValorUnitario)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-nazamak-yellow" />
          <p className="text-sm text-muted-foreground">Carregando produtos da nota...</p>
        </div>
      )}
    </div>
  );
};

export default NoteProductsList;
