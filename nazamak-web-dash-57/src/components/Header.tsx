
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Search, FileText, Home, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: "Home", href: "/", icon: Home },
    { name: "Consulta de Produtos", href: "/produtos", icon: Search },
    { name: "Consulta de Notas", href: "/notas", icon: FileText },
    { name: "Etiquetas Avulsas", href: "/etiquetas", icon: Printer },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-nazamak-black shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-nazamak-yellow rounded-md flex items-center justify-center">
              <span className="text-nazamak-black font-bold text-lg">N</span>
            </div>
            <span className="text-nazamak-white font-bold text-xl">Nazamak Web</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? "bg-nazamak-yellow text-nazamak-black"
                      : "text-nazamak-white hover:bg-nazamak-yellow hover:text-nazamak-black"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-nazamak-white hover:bg-nazamak-yellow hover:text-nazamak-black"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-nazamak-black border-t border-nazamak-gray-medium">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      isActive(item.href)
                        ? "bg-nazamak-yellow text-nazamak-black"
                        : "text-nazamak-white hover:bg-nazamak-yellow hover:text-nazamak-black"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
