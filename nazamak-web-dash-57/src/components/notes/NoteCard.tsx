
import { FileText, ChevronDown, ChevronRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { NotaFiscal, ProdutoNota } from "@/services/api";
import NoteProductsList from "./NoteProductsList";

interface NoteCardProps {
  note: NotaFiscal;
  isExpanded: boolean;
  products: ProdutoNota[] | undefined;
  onToggleExpansion: (noteNumber: string) => void;
  onProductClick: (productCode: string, productDescription: string) => void;
}

const NoteCard = ({ 
  note, 
  isExpanded, 
  products, 
  onToggleExpansion, 
  onProductClick 
}: NoteCardProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR });
    } catch {
      return dateString;
    }
  };

  return (
    <Card className="border-2 hover:border-nazamak-yellow transition-colors">
      <Collapsible>
        <CollapsibleTrigger asChild>
          <div 
            className="cursor-pointer"
            onClick={() => onToggleExpansion(note.NumeroNota)}
          >
            <CardHeader className="hover:bg-nazamak-gray-light transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-nazamak-yellow rounded-lg">
                    <FileText className="h-5 w-5 text-nazamak-black" />
                  </div>
                  <div>
                    <CardTitle className="text-nazamak-black">
                      Nota #{note.NumeroNota}
                    </CardTitle>
                    <CardDescription>
                      {note.Fornecedor} • {formatDate(note.DataEmissao)}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-semibold text-nazamak-black">
                      {formatCurrency(note.ValorTotal)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {note.QuantidadeItens} itens
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
              </div>
            </CardHeader>
          </div>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="pt-0 border-t border-nazamak-gray-medium">
            <NoteProductsList 
              noteNumber={note.NumeroNota}
              products={products}
              onProductClick={onProductClick}
            />
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default NoteCard;
