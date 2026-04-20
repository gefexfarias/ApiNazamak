
import { useState, useRef, useEffect } from "react";
import { Search, Package, Printer, Trash2, Plus, Loader2, LayoutGrid } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { apiService } from "@/services/api";
import { printLabels, LabelItem } from "@/utils/printLabels";
import { LABEL_LAYOUTS, LabelLayoutId } from "@/utils/labelLayouts";
import { useLabelLayout } from "@/hooks/useLabelLayout";

const ManualLabelPrint = () => {
  const [productCode, setProductCode] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState<LabelItem[]>([]);
  const [startRow, setStartRow] = useState(1);
  const [startCol, setStartCol] = useState(1);
  const { layoutId, layout, setLayoutId } = useLabelLayout();

  const codeInputRef = useRef<HTMLInputElement>(null);
  const qtyInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    codeInputRef.current?.focus();
  }, []);

  const handleAddProduct = async () => {
    if (!productCode.trim()) {
      toast.error("Digite um código de produto.");
      codeInputRef.current?.focus();
      return;
    }

    const qty = parseInt(quantity);
    if (isNaN(qty) || qty <= 0) {
      toast.error("Digite uma quantidade válida.");
      qtyInputRef.current?.focus();
      return;
    }

    setIsLoading(true);
    try {
      const product = await apiService.getProduct(productCode.trim());
      
      const newItem: LabelItem = {
        CodigoProduto: product.CodigoProduto,
        Descricao: product.Descricao,
        Locacao: product.Locacao,
        Quantidade: qty
      };

      // Adicionar à lista (se já existe, soma a quantidade ou apenas adiciona novo)
      setItems(prev => [...prev, newItem]);
      
      // Limpar campos e voltar o foco para o código
      setProductCode("");
      setQuantity("1");
      toast.success(`${product.Descricao} adicionado à lista.`);
      codeInputRef.current?.focus();
    } catch (error: any) {
      toast.error("Produto não encontrado.");
      setProductCode(""); // Limpa para a próxima tentativa
      codeInputRef.current?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveItem = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const handlePrint = () => {
    if (items.length === 0) {
      toast.error("Adicione itens à lista para imprimir.");
      return;
    }

    // Verificar itens sem locação
    const itemsSemLoc = items.filter(it => !it.Locacao || it.Locacao.trim() === "");
    if (itemsSemLoc.length > 0) {
      const codigos = itemsSemLoc.map(it => it.CodigoProduto).join(", ");
      const proceed = window.confirm(
        `Atenção: Os seguintes produtos estão sem LOCAÇÃO definida:\n\n${codigos}\n\nDeseja imprimir mesmo assim?`
      );
      if (!proceed) return;
    }

    const success = printLabels(items, startRow, startCol, layout);
    if (!success) {
      toast.error("Erro ao gerar impressão.");
    }
  };

  const handleCodeKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      qtyInputRef.current?.focus();
    }
  };

  const handleQtyKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddProduct();
    }
  };

  return (
    <div className="max-w-5xl mx-auto animate-fade-in space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-nazamak-yellow rounded-2xl mb-4">
          <Printer className="h-8 w-8 text-nazamak-black" />
        </div>
        <h1 className="text-3xl font-bold text-nazamak-black mb-2">
          Impressão de Etiquetas Avulsas
        </h1>
        <p className="text-muted-foreground">
          Monte sua folha de etiquetas digitando o código e a quantidade para cada produto
        </p>
      </div>

      {/* Seletor de Layout */}
      <Card className="border-2 border-nazamak-yellow/30 bg-nazamak-yellow/5">
        <CardContent className="py-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex items-center gap-2 text-nazamak-black font-semibold text-sm whitespace-nowrap">
              <LayoutGrid className="h-4 w-4 text-nazamak-yellow" />
              Modelo de Folha:
            </div>
            <select
              value={layoutId}
              onChange={(e) => {
                setLayoutId(e.target.value as LabelLayoutId);
                setStartRow(1);
                setStartCol(1);
              }}
              className="flex-1 h-10 rounded-lg border-2 border-nazamak-yellow/40 bg-white px-3 text-sm font-medium text-nazamak-black focus:outline-none focus:border-nazamak-yellow cursor-pointer"
            >
              {(Object.entries(LABEL_LAYOUTS) as [LabelLayoutId, typeof layout][]).map(([id, l]) => (
                <option key={id} value={id}>{l.nome} — {l.descricao}</option>
              ))}
            </select>
            {layout.observacoes && (
              <p className="text-[11px] text-muted-foreground sm:max-w-xs">
                ⚙️ {layout.observacoes}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Column */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-2 border-nazamak-yellow/20">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Plus className="h-5 w-5 text-nazamak-yellow" />
                Adicionar Produto
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-nazamak-black">Código (ou Ref. Cruzada)</label>
                <div className="relative">
                  <Input
                    ref={codeInputRef}
                    placeholder="Ex: 040957"
                    value={productCode}
                    onChange={(e) => setProductCode(e.target.value)}
                    onKeyPress={handleCodeKeyPress}
                    className="pl-9 h-11 border-2 focus:border-nazamak-yellow"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-nazamak-black">Quantidade de Etiquetas</label>
                <Input
                  ref={qtyInputRef}
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  onKeyPress={handleQtyKeyPress}
                  className="h-11 border-2 focus:border-nazamak-yellow"
                />
              </div>

              <Button 
                onClick={handleAddProduct}
                disabled={isLoading}
                className="w-full h-11 bg-nazamak-yellow text-nazamak-black hover:bg-nazamak-yellow/90 font-bold"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                ) : (
                  <Plus className="h-5 w-5 mr-2" />
                )}
                ADICIONAR À LISTA
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Package className="h-5 w-5 text-nazamak-yellow" />
                Posição na Folha
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-muted-foreground uppercase">Linha Inicial (1-{layout.numLinhas})</label>
                  <Input 
                    type="number" 
                    min="1" 
                    max={layout.numLinhas} 
                    value={startRow}
                    onChange={(e) => setStartRow(Math.max(1, Math.min(layout.numLinhas, parseInt(e.target.value) || 1)))}
                    className="h-10 border-2 focus:border-nazamak-yellow"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-muted-foreground uppercase">Coluna Inicial (1-{layout.numColunas})</label>
                  <Input 
                    type="number" 
                    min="1" 
                    max={layout.numColunas} 
                    value={startCol}
                    onChange={(e) => setStartCol(Math.max(1, Math.min(layout.numColunas, parseInt(e.target.value) || 1)))}
                    className="h-10 border-2 focus:border-nazamak-yellow"
                  />
                </div>
              </div>
              
              <Button 
                onClick={handlePrint}
                disabled={items.length === 0}
                className="w-full h-12 bg-nazamak-black text-white hover:bg-nazamak-black/90 font-bold gap-2"
              >
                <Printer className="h-5 w-5" />
                IMPRIMIR FOLHA (${items.reduce((acc, item) => acc + item.Quantidade, 0)})
              </Button>

              {items.length > 0 && (
                <Button 
                  variant="outline" 
                  onClick={() => setItems([])} 
                  className="w-full text-destructive border-destructive/20 hover:bg-destructive/10 gap-2 h-10"
                >
                  <Trash2 className="h-4 w-4" />
                  LIMPAR TODA A LISTA
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* List Column */}
        <div className="lg:col-span-2">
          <Card className="h-full min-h-[400px]">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Lista para Impressão</CardTitle>
                  <CardDescription>
                    Produtos que serão impressos nesta folha
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                  <Package className="h-12 w-12 mb-4 opacity-20" />
                  <p>A lista está vazia.</p>
                  <p className="text-sm">Adicione produtos pelo formulário ao lado.</p>
                </div>
              ) : (
                <div className="overflow-auto max-h-[600px]">
                  <table className="w-full text-left">
                    <thead className="bg-muted/50 text-[11px] uppercase font-bold text-muted-foreground sticky top-0">
                      <tr>
                        <th className="px-6 py-3 w-32">Código</th>
                        <th className="px-6 py-3">Descrição</th>
                        <th className="px-6 py-3 w-24 text-center">Etiquetas</th>
                        <th className="px-6 py-3 w-16"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {items.map((item, index) => (
                        <tr key={index} className="hover:bg-muted/30 transition-colors group">
                          <td className="px-6 py-4 font-mono font-bold text-nazamak-black uppercase">{item.CodigoProduto}</td>
                          <td className="px-6 py-4">
                            <div className="font-medium text-nazamak-black">{item.Descricao}</div>
                            {item.Locacao && (
                              <div className="text-[10px] text-muted-foreground uppercase flex items-center gap-1">
                                <span className="bg-nazamak-yellow/20 text-nazamak-black/70 px-1 rounded">
                                  {item.Locacao}
                                </span>
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-nazamak-gray-light font-bold text-nazamak-black text-sm">
                              {item.Quantidade}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleRemoveItem(index)}
                              className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ManualLabelPrint;
