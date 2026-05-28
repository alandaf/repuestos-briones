import { ShoppingCart, User, Wrench, Menu } from 'lucide-react';

interface Vehicle {
  plateOrVin: string;
  brand: string;
  model: string;
  year: number;
  engine: string;
}

interface HeaderProps {
  activeVehicle: Vehicle | null;
  cartCount: number;
  onCartClick: () => void;
  currentSection: string;
  setCurrentSection: (section: string) => void;
}

export default function Header({
  activeVehicle,
  cartCount,
  onCartClick,
  currentSection,
  setCurrentSection
}: HeaderProps) {
  return (
    <header className="bg-gray-950 sticky top-0 z-50 border-b border-gray-850 glass">
      <div className="flex items-center justify-between w-full px-4 md:px-8 max-w-7xl mx-auto h-16">
        <div className="flex items-center gap-4">
          <Menu className="text-orange-500 lg:hidden cursor-pointer" />
          <button 
            onClick={() => setCurrentSection('Catálogo')}
            className="flex items-center gap-2 text-left cursor-pointer"
          >
            <div className="bg-orange-600 p-1.5 rounded-lg text-white">
              <Wrench size={20} />
            </div>
            <h1 className="text-xl font-black tracking-tighter text-white uppercase">
              Briones<span className="text-orange-500">Repuestos</span>
            </h1>
          </button>
        </div>

        <nav className="hidden lg:flex items-center gap-8">
          {[
            { name: 'Catálogo', label: 'Catálogo' },
            { name: 'Garaje', label: 'Garaje' },
            { name: 'Diagramas OEM', label: 'Diagramas OEM' },
            { name: 'Pedidos', label: 'Mis Pedidos' },
            { name: 'Soporte Técnico', label: 'Asistente IA' }
          ].map((item) => (
            <button
              key={item.name}
              onClick={() => setCurrentSection(item.name)}
              className={`transition-colors uppercase text-[11px] font-bold tracking-widest cursor-pointer ${
                currentSection === item.name
                  ? 'text-orange-500'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          {/* Active Vehicle Button */}
          <button
            onClick={() => setCurrentSection('Garaje')}
            className="bg-gray-900 border border-gray-800 hover:border-orange-500/50 hover:bg-gray-850 px-3 py-1.5 text-xs text-gray-300 font-bold uppercase tracking-wider rounded-lg transition-all flex items-center gap-1.5 cursor-pointer max-w-[160px] md:max-w-xs"
          >
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="truncate">
              {activeVehicle ? `${activeVehicle.brand} ${activeVehicle.model}` : 'Vehículo: Buscar'}
            </span>
          </button>

          {/* Cart Icon */}
          <button
            onClick={onCartClick}
            className="relative p-2.5 bg-gray-900 border border-gray-800 rounded-lg hover:border-orange-500/40 text-gray-400 hover:text-white transition-all cursor-pointer"
          >
            <ShoppingCart size={18} />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-orange-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border border-gray-950 animate-bounce">
                {cartCount}
              </span>
            )}
          </button>

          {/* User Profile */}
          <button className="p-2.5 bg-gray-900 border border-gray-800 rounded-lg hover:border-orange-500/40 text-gray-400 hover:text-white transition-all cursor-pointer hidden md:block">
            <User size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
