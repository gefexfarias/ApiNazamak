
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Package, CheckCircle, Plus, Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiService } from "@/services/api";
import { toast } from "sonner";

interface Product {
  codigo: string;
  descricao: string;
  saldo: number;
  localizacao?: string;
  conversoes?: string[];
}

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onConversionAdded?: (productCode: string) => void;
}

const ProductModal = ({ isOpen, onClose, product, onConversionAdded }: ProductModalProps) => {
  const [isAddingConversion, setIsAddingConversion] = useState(false);
  const [newConversionCode, setNewConversionCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!product) return null;

  const formatLocation = (location: string) => {
    if (location && location.length > 1) {
      return location.charAt(0) + '-' + location.slice(1);
    }
    return location;
  };

  const handleAddConversion = async () => {
    if (!newConversionCode.trim()) {
      toast.error("Informe o código de conversão.");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await apiService.cadastrarConversao({
        codigo_principal: product.codigo,
        codigo_conversao: newConversionCode.trim(),
      });

      if (result.success) {
        toast.success(result.message || "Conversão cadastrada com sucesso!");
        setNewConversionCode("");
        setIsAddingConversion(false);
        if (onConversionAdded) {
          onConversionAdded(product.codigo);
        }
      } else {
        toast.error(result.message || "Erro ao cadastrar conversão.");
      }
    } catch (error: any) {
      toast.error(error.message || "Erro ao cadastrar conversão.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-green-500 rounded-xl mx-auto mb-3">
            <CheckCircle className="h-6 w-6 text-white" />
          </div>
          <DialogTitle className="text-nazamak-black text-xl">
            {product.descricao}
          </DialogTitle>
          <DialogDescription className="text-green-700 font-medium flex items-center justify-between">
            <span>Código: {product.codigo}</span>
            {product.localizacao && (
              <span className="text-blue-600 font-semibold">
                Locação: {formatLocation(product.localizacao)}
              </span>
            )}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 mt-4">
          <div className="flex items-center justify-between p-4 bg-nazamak-yellow/10 rounded-lg border border-nazamak-yellow/30">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-nazamak-black" />
              <span className="font-medium text-nazamak-black">Saldo em Estoque</span>
            </div>
            <Badge variant="secondary" className="bg-nazamak-yellow text-nazamak-black font-semibold text-lg px-4 py-2">
              {product.saldo}
            </Badge>
          </div>

          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-nazamak-black flex items-center gap-2">
                <Package className="h-4 w-4" />
                Ref. Cruzada (Conversões)
              </h3>
              {!isAddingConversion && (
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => setIsAddingConversion(true)}
                  className="h-8 gap-1"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Cadastrar
                </Button>
              )}
            </div>

            {isAddingConversion && (
              <div className="bg-nazamak-gray-light p-3 rounded-lg border border-nazamak-yellow/30 mb-4 animate-in fade-in slide-in-from-top-2">
                <div className="flex gap-2">
                  <Input
                    placeholder="Novo código..."
                    value={newConversionCode}
                    onChange={(e) => setNewConversionCode(e.target.value)}
                    className="h-9"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddConversion();
                      if (e.key === 'Escape') setIsAddingConversion(false);
                    }}
                  />
                  <Button 
                    size="sm" 
                    onClick={handleAddConversion}
                    disabled={isSubmitting}
                    className="bg-nazamak-yellow text-nazamak-black hover:bg-nazamak-yellow/90"
                  >
                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Salvar"}
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => setIsAddingConversion(false)}
                    disabled={isSubmitting}
                  >
                    X
                  </Button>
                </div>
              </div>
            )}

            {product.conversoes && product.conversoes.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {product.conversoes.map((conv, idx) => (
                  <div key={idx} className="bg-nazamak-white p-2 rounded border border-nazamak-gray-medium text-sm font-medium text-nazamak-black">
                    {conv}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">Nenhuma conversão encontrada.</p>
            )}
          </div>
          
          <div className="text-center text-xs text-muted-foreground pt-2">
            Clique fora do modal ou pressione ESC para fechar
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductModal;
