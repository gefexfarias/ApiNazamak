
interface NotesResultsSummaryProps {
  totalNotes: number;
  currentPage: number;
  totalPages: number;
  isAllNotes?: boolean;
}

const NotesResultsSummary = ({ 
  totalNotes, 
  currentPage, 
  totalPages, 
  isAllNotes = false 
}: NotesResultsSummaryProps) => {
  return (
    <div className="flex items-center justify-between bg-nazamak-white p-4 rounded-lg border">
      <div className="text-sm text-muted-foreground">
        Encontradas <span className="font-semibold text-nazamak-black">{totalNotes}</span> notas fiscais
        {isAllNotes && <span className="ml-2 text-nazamak-yellow font-medium">(Todas as notas)</span>}
      </div>
      <div className="text-sm text-muted-foreground">
        Página {currentPage} de {totalPages}
      </div>
    </div>
  );
};

export default NotesResultsSummary;
