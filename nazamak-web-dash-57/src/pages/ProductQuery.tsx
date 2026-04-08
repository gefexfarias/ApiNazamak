
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Package, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { apiService, Product } from "@/services/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useRef, useEffect } from "react";

const ProductQuery = () => {
  const [productCode, setProductCode] = useState("");
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [codigoConversao, setCodigoConversao] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
 
  useEffect(() => {
    // Foca no input ao entrar na página
    inputRef.current?.focus();
  }, []);
 
  const focusInput = () => {
    setTimeout(() => inputRef.current?.focus(), 50);
  };
 
  const handleSearch = async () => {
    const code = productCode.trim();
    if (!code) {
      toast.error("Digite um código de produto.");
      focusInput();
      return;
    }

    setIsLoading(true);
    setProduct(null); // Limpar resultado anterior antes de nova busca

    try {
      const data = await apiService.getProduct(code);
      setProduct(data);
      setProductCode(""); // Limpa o campo após encontrar o sucesso
      toast.success(`Encontrado: ${data.Descricao}`);
    } catch (error: any) {
      toast.error("Produto não encontrado.");
      setProduct(null);
      setProductCode(""); // Limpa o campo mesmo em caso de erro
    } finally {
      setIsLoading(false);
      focusInput();
    }
  };
 
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
 
  const formatLocation = (location: string) => {
    if (location && location.length > 1) {
      return location.charAt(0) + '-' + location.slice(1);
    }
    return location;
  };
 
  const handleOpenModal = () => {
    setCodigoConversao("");
    setIsModalOpen(true);
  };
 
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
 
  const handleSubmitConversao = async () => {
    if (!product?.CodigoProduto || !codigoConversao.trim()) {
      toast.error("Preencha o código de conversão.");
      return;
    }
    setIsSubmitting(true);
    try {
      const result = await apiService.cadastrarConversao({
        codigo_principal: product.CodigoProduto,
        codigo_conversao: codigoConversao.trim(),
      });
      if (result.success) {
        toast.success(result.message || "Conversão cadastrada com sucesso!");
        setIsModalOpen(false);
        setCodigoConversao("");
        // Refaz a busca do produto principal para atualizar a lista visual
        const updatedProduct = await apiService.getProduct(product.CodigoProduto);
        setProduct(updatedProduct);
      } else {
        toast.error(result.message || "Erro ao cadastrar conversão.");
      }
    } catch (e: any) {
      toast.error("Erro na conexão com o servidor.");
    } finally {
      setIsSubmitting(false);
      focusInput();
    }
  };
 
  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-nazamak-yellow rounded-2xl mb-4">
          <Search className="h-8 w-8 text-nazamak-black" />
        </div>
        <h1 className="text-3xl font-bold text-nazamak-black mb-2 px-2">
          Consulta de Produtos
        </h1>
        <p className="text-muted-foreground">
          Digite o código original ou referência cruzada
        </p>
      </div>

      {/* Search Form */}
      <Card className="mb-8 border-2 hover:border-nazamak-yellow transition-colors">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-nazamak-black">
            <Package className="h-5 w-5" />
            Buscar Produto
          </CardTitle>
          <CardDescription>
            Informe o código do produto para consultar saldo e conversões
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Input
                ref={inputRef}
                placeholder="Digite o código do produto..."
                value={productCode}
                onChange={(e) => setProductCode(e.target.value)}
                onKeyPress={handleKeyPress}
                onFocus={() => setProductCode("")}
                className="pl-10 h-12 text-lg border-2 focus:border-nazamak-yellow"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            </div>
            <Button 
              onClick={handleSearch} 
              disabled={isLoading || !productCode.trim()}
              className="h-12 px-8 bg-nazamak-yellow hover:bg-nazamak-yellow/90 text-nazamak-black font-semibold"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Search className="h-4 w-4 mr-2" />
              )}
              Buscar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {isLoading && (
        <Card className="text-center py-12">
          <CardContent>
            <div className="animate-pulse-yellow">
              <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-nazamak-yellow" />
            </div>
            <p className="text-muted-foreground">Buscando produto...</p>
          </CardContent>
        </Card>
      )}
 
      {/* Product Result */}
      {product && (
        <Card className="border-2 border-green-200 bg-green-50">
          <CardHeader className="border-b border-green-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-12 h-12 bg-green-500 rounded-xl">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-nazamak-black text-xl">
                    {product.Descricao}
                  </CardTitle>
                  <CardDescription className="text-green-700 font-medium">
                    Código: {product.CodigoProduto}
                    {product.Locacao && ` • Locação: ${formatLocation(product.Locacao)}`}
                  </CardDescription>
                </div>
              </div>
              <Badge variant="secondary" className="bg-nazamak-yellow text-nazamak-black font-semibold text-lg px-4 py-2">
                Saldo: {product.Saldo}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="pt-6">
            {(product.Conversoes && product.Conversoes.length > 0) || true ? (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-nazamak-black flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    Ref. Cruzada
                  </h3>
                  <Button size="sm" variant="outline" onClick={handleOpenModal}>
                    + Cadastrar Conversão
                  </Button>
                </div>
                {product.Conversoes && product.Conversoes.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {product.Conversoes.map((conversao, index) => (
                      <div key={index} className="bg-nazamak-white p-4 rounded-lg border border-nazamak-gray-medium">
                        <div className="text-sm text-muted-foreground">Código</div>
                        <div className="font-semibold text-nazamak-black">{conversao}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-muted-foreground text-sm">Nenhuma conversão cadastrada.</div>
                )}
              </div>
            ) : null}
          </CardContent>
        </Card>
      )}

      {/* Modal de Cadastro de Conversão */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Cadastrar Conversão</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <label className="block text-sm font-medium text-nazamak-black mb-1">Código Principal</label>
              <Input value={product?.CodigoProduto || ""} disabled className="bg-gray-100" />
            </div>
            <div>
              <label className="block text-sm font-medium text-nazamak-black mb-1">Código de Conversão *</label>
              <Input
                value={codigoConversao}
                onChange={e => setCodigoConversao(e.target.value)}
                placeholder="Digite o código de conversão"
                className="border-2 focus:border-nazamak-yellow"
                disabled={isSubmitting}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSubmitConversao();
                  }
                }}
              />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={handleCloseModal} disabled={isSubmitting}>Cancelar</Button>
              <Button onClick={handleSubmitConversao} disabled={isSubmitting} className="bg-nazamak-yellow text-nazamak-black font-semibold">
                {isSubmitting ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductQuery;
