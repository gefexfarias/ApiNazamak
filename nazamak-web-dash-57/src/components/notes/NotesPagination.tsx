
import { Button } from "@/components/ui/button";

interface NotesPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const NotesPagination = ({ currentPage, totalPages, onPageChange }: NotesPaginationProps) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center gap-2 mt-6">
      <Button
        variant="outline"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="border-nazamak-yellow text-nazamak-black hover:bg-nazamak-yellow hover:text-nazamak-black"
      >
        Anterior
      </Button>
      
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <Button
          key={page}
          variant={currentPage === page ? "default" : "outline"}
          onClick={() => onPageChange(page)}
          className={
            currentPage === page
              ? "bg-nazamak-yellow text-nazamak-black hover:bg-nazamak-yellow/90"
              : "border-nazamak-yellow text-nazamak-black hover:bg-nazamak-yellow hover:text-nazamak-black"
          }
        >
          {page}
        </Button>
      ))}
      
      <Button
        variant="outline"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="border-nazamak-yellow text-nazamak-black hover:bg-nazamak-yellow hover:text-nazamak-black"
      >
        Próximo
      </Button>
    </div>
  );
};

export default NotesPagination;
