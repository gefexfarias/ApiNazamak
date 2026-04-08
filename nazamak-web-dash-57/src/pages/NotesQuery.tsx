import { useState } from "react";
import { FileText, Loader2, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import ProductModal from "@/components/ProductModal";
import { apiService } from "@/services/api";
import { useNotesData } from "@/hooks/useNotesData";
import NotesSearchForm from "@/components/notes/NotesSearchForm";
import NotesResultsSummary from "@/components/notes/NotesResultsSummary";
import NoteCard from "@/components/notes/NoteCard";
import NotesPagination from "@/components/notes/NotesPagination";
import NotesEmptyState from "@/components/notes/NotesEmptyState";

const NotesQuery = () => {
  const [selectedProduct, setSelectedProduct] = useState<{ 
    codigo: string; 
    descricao: string; 
    saldo: number; 
    localizacao?: string;
    conversoes?: string[];
  } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fornecedorFilter, setFornecedorFilter] = useState("");

  const {
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    searchParams,
    expandedNotes,
    currentPage,
    setCurrentPage,
    notes,
    isLoading,
    error,
    isError,
    noteProducts,
    handleSearch,
    handleSearchAll,
    toggleNoteExpansion,
  } = useNotesData();

  const handleProductClick = async (productCode: string, productDescription: string) => {
    console.log('Product clicked:', productCode, productDescription);
    
    try {
      const productData = await apiService.getProduct(productCode);
      setSelectedProduct({
        codigo: productData.CodigoProduto,
        descricao: productData.Descricao,
        saldo: productData.Saldo,
        localizacao: productData.Locacao,
        conversoes: productData.Conversoes
      });
      setIsModalOpen(true);
    } catch (error: any) {
      let msg = "Erro ao buscar detalhes do produto. Tente novamente ou contate o suporte.";
      if (error?.response) {
        try {
          const data = await error.response.json();
          msg = data.message || msg;
        } catch {}
      } else if (error?.message) {
        const match = error.message.match(/HTTP \d+: (.+)/);
        if (match && match[1]) {
          msg = match[1];
        } else {
          msg = error.message;
        }
      }
      toast.error(msg);
    }
  };

  const handleConversionAdded = async (productCode: string) => {
    // Atualiza os dados do produto no modal após adicionar uma conversão
    try {
      const productData = await apiService.getProduct(productCode);
      setSelectedProduct({
        codigo: productData.CodigoProduto,
        descricao: productData.Descricao,
        saldo: productData.Saldo,
        localizacao: productData.Locacao,
        conversoes: productData.Conversoes
      });
    } catch (error) {
      console.error("Erro ao atualizar dados do produto:", error);
    }
  };

  const handleModalClose = () => {
    console.log('Closing modal');
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  // Filtrar notas pelo nome do fornecedor (trecho, case-insensitive)
  const filteredNotes = notes?.filter(note =>
    fornecedorFilter.trim() === "" ||
    note.Fornecedor.toLowerCase().includes(fornecedorFilter.trim().toLowerCase())
  ) || [];

  const itemsPerPage = 5;
  const paginatedNotes = filteredNotes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-nazamak-yellow rounded-2xl mb-4">
          <FileText className="h-8 w-8 text-nazamak-black" />
        </div>
        <h1 className="text-3xl font-bold text-nazamak-black mb-2">
          Consulta de Notas Fiscais
        </h1>
        <p className="text-muted-foreground">
          Selecione o período para visualizar as notas de entrada ou consulte todas as notas
        </p>
      </div>

      {/* Search Form */}
      <NotesSearchForm
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        onSearch={handleSearch}
        onSearchAll={handleSearchAll}
        isLoading={isLoading}
        fornecedorFilter={fornecedorFilter}
        setFornecedorFilter={setFornecedorFilter}
      />

      {/* Loading State */}
      {isLoading && (
        <Card className="text-center py-12">
          <CardContent>
            <div className="animate-pulse-yellow">
              <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-nazamak-yellow" />
            </div>
            <p className="text-muted-foreground">
              {searchParams?.all ? "Buscando todas as notas fiscais..." : "Buscando notas fiscais..."}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {isError && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            {error?.message || "Erro ao buscar notas fiscais. Tente novamente."}
          </AlertDescription>
        </Alert>
      )}

      {/* Results */}
      {filteredNotes && filteredNotes.length > 0 && (
        <div className="space-y-4">
          {/* Results Summary */}
          <NotesResultsSummary
            totalNotes={filteredNotes.length}
            currentPage={currentPage}
            totalPages={Math.ceil(filteredNotes.length / 5)}
            isAllNotes={searchParams?.all}
          />

          {/* Notes List */}
          {paginatedNotes.map((note) => (
            <NoteCard
              key={note.NumeroNota}
              note={note}
              isExpanded={expandedNotes.has(note.NumeroNota)}
              products={noteProducts?.[note.NumeroNota]}
              onToggleExpansion={toggleNoteExpansion}
              onProductClick={handleProductClick}
            />
          ))}

          {/* Pagination */}
          <NotesPagination
            currentPage={currentPage}
            totalPages={Math.ceil(filteredNotes.length / 5)}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* Empty State */}
      {filteredNotes && filteredNotes.length === 0 && !isLoading && (
        <NotesEmptyState isAllNotes={searchParams?.all} />
      )}

      {/* Product Modal */}
      <ProductModal 
        isOpen={isModalOpen}
        onClose={handleModalClose}
        product={selectedProduct}
        onConversionAdded={handleConversionAdded}
      />
    </div>
  );
};

export default NotesQuery;
