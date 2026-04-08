
import { FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface NotesEmptyStateProps {
  isAllNotes?: boolean;
}

const NotesEmptyState = ({ isAllNotes = false }: NotesEmptyStateProps) => {
  return (
    <Card className="text-center py-12 border-2 border-dashed border-nazamak-gray-medium">
      <CardContent>
        <FileText className="h-16 w-16 mx-auto mb-4 text-nazamak-gray-medium" />
        <h3 className="text-lg font-semibold text-nazamak-black mb-2">
          Nenhuma nota encontrada
        </h3>
        <p className="text-muted-foreground">
          {isAllNotes 
            ? "Não foram encontradas notas fiscais no sistema"
            : "Não foram encontradas notas fiscais no período selecionado"
          }
        </p>
      </CardContent>
    </Card>
  );
};

export default NotesEmptyState;
