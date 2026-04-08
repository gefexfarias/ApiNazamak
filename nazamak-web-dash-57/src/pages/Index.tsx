
import { Link } from "react-router-dom";
import { Search, FileText, TrendingUp, Package } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Index = () => {
  const features = [
    {
      title: "Consulta de Produtos",
      description: "Busque produtos por código e visualize saldo, descrição e conversões disponíveis",
      icon: Search,
      href: "/produtos",
      color: "bg-blue-500"
    },
    {
      title: "Consulta de Notas Fiscais",
      description: "Visualize notas de entrada por período com detalhes completos",
      icon: FileText,
      href: "/notas",
      color: "bg-green-500"
    }
  ];

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-nazamak-yellow rounded-2xl mb-6">
          <Package className="h-8 w-8 text-nazamak-black" />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-nazamak-black mb-4">
          Nazamak Web
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Sistema moderno para consulta rápida e eficiente de produtos e notas fiscais. 
          Interface otimizada para uso empresarial e técnico.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="bg-nazamak-yellow hover:bg-nazamak-yellow/90 text-nazamak-black font-semibold">
            <Link to="/produtos">
              <Search className="mr-2 h-5 w-5" />
              Consultar Produtos
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="border-nazamak-black text-nazamak-black hover:bg-nazamak-black hover:text-nazamak-white">
            <Link to="/notas">
              <FileText className="mr-2 h-5 w-5" />
              Consultar Notas
            </Link>
          </Button>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Card key={feature.title} className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-nazamak-yellow">
              <CardHeader className="text-center">
                <div className={`inline-flex items-center justify-center w-12 h-12 ${feature.color} rounded-xl mb-4 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-nazamak-black">{feature.title}</CardTitle>
                <CardDescription className="text-muted-foreground">
                  {feature.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button asChild className="w-full bg-nazamak-yellow hover:bg-nazamak-yellow/90 text-nazamak-black font-semibold">
                  <Link to={feature.href}>
                    Acessar
                  </Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Stats Section */}
      <div className="bg-nazamak-white rounded-2xl p-8 shadow-sm border">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-nazamak-black mb-2">Sistema Integrado</h2>
          <p className="text-muted-foreground">Conectado com ApiNazamak para dados em tempo real</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-nazamak-yellow/20 rounded-xl mb-3">
              <Package className="h-6 w-6 text-nazamak-black" />
            </div>
            <h3 className="font-semibold text-nazamak-black mb-1">Produtos</h3>
            <p className="text-sm text-muted-foreground">Consulta por código com dados atualizados</p>
          </div>
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-nazamak-yellow/20 rounded-xl mb-3">
              <FileText className="h-6 w-6 text-nazamak-black" />
            </div>
            <h3 className="font-semibold text-nazamak-black mb-1">Notas Fiscais</h3>
            <p className="text-sm text-muted-foreground">Histórico completo de entrada</p>
          </div>
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-nazamak-yellow/20 rounded-xl mb-3">
              <TrendingUp className="h-6 w-6 text-nazamak-black" />
            </div>
            <h3 className="font-semibold text-nazamak-black mb-1">Relatórios</h3>
            <p className="text-sm text-muted-foreground">Análises detalhadas e exportação</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
