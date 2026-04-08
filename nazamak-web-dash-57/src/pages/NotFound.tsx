
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { AlertTriangle, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Card className="max-w-md w-full mx-4 text-center border-2 border-nazamak-gray-medium">
        <CardContent className="pt-12 pb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-nazamak-yellow/20 rounded-2xl mb-6">
            <AlertTriangle className="h-8 w-8 text-nazamak-yellow" />
          </div>
          
          <h1 className="text-6xl font-bold text-nazamak-black mb-4">404</h1>
          <h2 className="text-xl font-semibold text-nazamak-black mb-2">
            Página não encontrada
          </h2>
          <p className="text-muted-foreground mb-8">
            A página que você está procurando não existe ou foi movida.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild className="bg-nazamak-yellow hover:bg-nazamak-yellow/90 text-nazamak-black font-semibold">
              <Link to="/">
                <Home className="mr-2 h-4 w-4" />
                Ir para Home
              </Link>
            </Button>
            
            <Button 
              asChild 
              variant="outline"
              className="border-nazamak-black text-nazamak-black hover:bg-nazamak-black hover:text-nazamak-white"
              onClick={() => window.history.back()}
            >
              <button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </button>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
