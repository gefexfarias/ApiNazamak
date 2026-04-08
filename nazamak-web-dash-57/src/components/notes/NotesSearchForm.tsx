import { Calendar, Search, List, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface NotesSearchFormProps {
  startDate: string;
  setStartDate: (date: string) => void;
  endDate: string;
  setEndDate: (date: string) => void;
  onSearch: () => void;
  onSearchAll: () => void;
  isLoading: boolean;
  fornecedorFilter: string;
  setFornecedorFilter: (value: string) => void;
}

const NotesSearchForm = ({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  onSearch,
  onSearchAll,
  isLoading,
  fornecedorFilter,
  setFornecedorFilter
}: NotesSearchFormProps) => {
  // Funções utilitárias para datas rápidas
  const today = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  const format = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

  const setToday = () => {
    const f = format(today);
    setStartDate(f);
    setEndDate(f);
  };

  const setCurrentMonth = () => {
    const first = new Date(today.getFullYear(), today.getMonth(), 1);
    const last = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    setStartDate(format(first));
    setEndDate(format(last));
  };

  const setCurrentYear = () => {
    const first = new Date(today.getFullYear(), 0, 1);
    const last = new Date(today.getFullYear(), 11, 31);
    setStartDate(format(first));
    setEndDate(format(last));
  };

  const setLast7Days = () => {
    const last7 = new Date(today);
    last7.setDate(today.getDate() - 6);
    setStartDate(format(last7));
    setEndDate(format(today));
  };

  const setLast30Days = () => {
    const last30 = new Date(today);
    last30.setDate(today.getDate() - 29);
    setStartDate(format(last30));
    setEndDate(format(today));
  };

  return (
    <Card className="mb-8 border-2 hover:border-nazamak-yellow transition-colors">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-nazamak-black">
          <Calendar className="h-5 w-5" />
          Filtro por Período
        </CardTitle>
        <CardDescription>
          Selecione as datas de início e fim para consultar as notas fiscais ou busque todas as notas
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Filtros rápidos */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Button type="button" variant="outline" size="sm" onClick={setToday}>Hoje</Button>
          <Button type="button" variant="outline" size="sm" onClick={setCurrentMonth}>Este mês</Button>
          <Button type="button" variant="outline" size="sm" onClick={setCurrentYear}>Este ano</Button>
          <Button type="button" variant="outline" size="sm" onClick={setLast7Days}>Últimos 7 dias</Button>
          <Button type="button" variant="outline" size="sm" onClick={setLast30Days}>Últimos 30 dias</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-nazamak-black mb-2">
              Data Inicial
            </label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="h-12 border-2 focus:border-nazamak-yellow"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-nazamak-black mb-2">
              Data Final
            </label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="h-12 border-2 focus:border-nazamak-yellow"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-nazamak-black mb-2">
              Fornecedor (trecho do nome)
            </label>
            <Input
              type="text"
              placeholder="Ex: mercado, distribuidora..."
              value={fornecedorFilter}
              onChange={e => setFornecedorFilter(e.target.value)}
              className="h-12 border-2 focus:border-nazamak-yellow"
            />
          </div>
          <div className="flex items-end">
            <Button 
              onClick={onSearch} 
              disabled={isLoading}
              className="w-full h-12 bg-nazamak-yellow hover:bg-nazamak-yellow/90 text-nazamak-black font-semibold"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Search className="h-4 w-4 mr-2" />
              )}
              Buscar por Período
            </Button>
          </div>
          <div className="flex items-end">
            <Button 
              onClick={onSearchAll} 
              disabled={isLoading}
              variant="outline"
              className="w-full h-12 border-2 border-nazamak-yellow text-nazamak-black hover:bg-nazamak-yellow hover:text-nazamak-black font-semibold"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <List className="h-4 w-4 mr-2" />
              )}
              Buscar Todas
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotesSearchForm;
