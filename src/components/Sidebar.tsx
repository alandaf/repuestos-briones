import { Wrench, Package, Cpu, GitBranch, Headset, ShoppingBag } from 'lucide-react';

interface SidebarProps {
  currentSection: string;
  setCurrentSection: (section: string) => void;
}

export default function Sidebar({ currentSection, setCurrentSection }: SidebarProps) {
  const menuItems = [
    { name: 'Catálogo', label: 'Catálogo Principal', icon: ShoppingBag },
    { name: 'Garaje', label: 'Mi Garaje Virtual', icon: Wrench },
    { name: 'Diagramas OEM', label: 'Diagramas OEM', icon: GitBranch },
    { name: 'Pedidos', label: 'Seguimiento Pedidos', icon: Package },
    { name: 'Soporte Técnico', label: 'Asistente Técnico IA', icon: Headset },
  ];

  return (
    <aside className="hidden lg:flex fixed left-0 top-16 h-[calc(100vh-64px)] w-80 bg-gray-950 border-r border-gray-850 flex-col py-6 z-40">
      <div className="px-8 mb-8">
        <div className="flex items-center gap-2 mb-1">
          <Cpu className="text-orange-500" size={16} />
          <h2 className="text-sm font-bold text-gray-300 uppercase tracking-widest">Portal Mayorista</h2>
        </div>
        <p className="text-xs text-gray-500 font-mono">B2B SUITE v2.4</p>
      </div>

      <div className="flex flex-col gap-1 px-4">
        {menuItems.map((item) => {
          const isActive = currentSection === item.name;
          return (
            <button
              key={item.name}
              onClick={() => setCurrentSection(item.name)}
              className={`w-full text-left rounded-lg px-4 py-3 flex items-center gap-4 transition-all cursor-pointer ${
                isActive
                  ? 'bg-orange-600/10 border border-orange-500/30 text-orange-400 font-bold'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-900 border border-transparent'
              }`}
            >
              <item.icon size={18} className={isActive ? 'text-orange-500' : 'text-gray-400'} />
              <span className="text-sm tracking-wide">{item.label}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-auto px-6 py-4">
        <div className="bg-gray-900 border border-gray-850 p-4 rounded-xl">
          <span className="text-[10px] font-bold text-orange-400 uppercase block mb-1 tracking-wider">Convenio Activo</span>
          <p className="text-xs text-gray-300 font-semibold mb-1">Distribuidor: Repuestos Briones</p>
          <p className="text-[10px] text-gray-500 mb-3">Precios mayoristas con 10% Dcto. directo en compras.</p>
          <button
            onClick={() => setCurrentSection('Soporte Técnico')}
            className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-2 rounded text-xs transition-colors cursor-pointer uppercase tracking-wider"
          >
            Soporte IA Express
          </button>
        </div>
      </div>
    </aside>
  );
}
