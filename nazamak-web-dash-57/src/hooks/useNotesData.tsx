
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiService, NotaFiscal, ProdutoNota } from "@/services/api";

export const useNotesData = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchParams, setSearchParams] = useState<{ inicio?: string; fim?: string; all?: boolean } | null>(null);
  const [expandedNotes, setExpandedNotes] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const { data: notes, isLoading, error, isError } = useQuery({
    queryKey: ['notes', searchParams],
    queryFn: async (): Promise<NotaFiscal[]> => {
      if (!searchParams) return [];
      
      if (searchParams.all) {
        return await apiService.getAllNotes();
      }
      
      if (searchParams.inicio && searchParams.fim) {
        return await apiService.getNotesByPeriod(searchParams.inicio, searchParams.fim);
      }
      
      return [];
    },
    enabled: !!searchParams,
    retry: 1,
  });

  const { data: noteProducts } = useQuery({
    queryKey: ['note-products', Array.from(expandedNotes)],
    queryFn: async (): Promise<Record<string, ProdutoNota[]>> => {
      const results: Record<string, ProdutoNota[]> = {};
      
      for (const noteNumber of expandedNotes) {
        try {
          results[noteNumber] = await apiService.getNoteProducts(noteNumber);
        } catch (error) {
          console.error(`Erro ao buscar produtos da nota ${noteNumber}:`, error);
          results[noteNumber] = [];
        }
      }
      
      return results;
    },
    enabled: expandedNotes.size > 0,
  });

  const handleSearch = () => {
    if (!startDate || !endDate) {
      toast.error("Selecione as datas de início e fim");
      return;
    }
    
    if (new Date(startDate) > new Date(endDate)) {
      toast.error("A data de início deve ser anterior à data de fim");
      return;
    }

    setSearchParams({ inicio: startDate, fim: endDate });
    setCurrentPage(1);
    setExpandedNotes(new Set());
  };

  const handleSearchAll = () => {
    setSearchParams({ all: true });
    setCurrentPage(1);
    setExpandedNotes(new Set());
    setStartDate("");
    setEndDate("");
  };

  const toggleNoteExpansion = (noteNumber: string) => {
    const newExpanded = new Set(expandedNotes);
    if (newExpanded.has(noteNumber)) {
      newExpanded.delete(noteNumber);
    } else {
      newExpanded.add(noteNumber);
    }
    setExpandedNotes(newExpanded);
  };

  // Pagination
  const paginatedNotes = notes?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  ) || [];

  const totalPages = Math.ceil((notes?.length || 0) / itemsPerPage);

  return {
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
    paginatedNotes,
    totalPages,
    handleSearch,
    handleSearchAll,
    toggleNoteExpansion,
  };
};
