import { useState } from 'react';
import { Layers, Crosshair, Plus, ShoppingCart } from 'lucide-react';
import { motion } from 'motion/react';

interface PartHotspot {
  id: number;
  name: string;
  code: string;
  price: number;
  x: string;
  y: string;
  category: string;
  image: string;
}

interface OEMDiagramsProps {
  onAddToCart: (product: { id: number; name: string; price: number; image: string }) => void;
}

export default function OEMDiagrams({ onAddToCart }: OEMDiagramsProps) {
  const [selectedSystem, setSelectedSystem] = useState<'Frenos' | 'Motor'>('Frenos');
  const [selectedPart, setSelectedPart] = useState<PartHotspot | null>(null);

  const hotspots: PartHotspot[] = [
    {
      id: 101,
      name: 'Pastilla de Freno Delantera OEM',
      code: 'OEM-48092-A',
      price: 94.50,
      x: '24%',
      y: '58%',
      category: 'Frenos',
      image: 'https://images.unsplash.com/photo-1619642751034-7b82df6b2b73?q=80&w=200&h=200&fit=crop'
    },
    {
      id: 102,
      name: 'Disco de Freno Ventilado',
      code: 'OEM-11204-B',
      price: 135.00,
      x: '52%',
      y: '45%',
      category: 'Frenos',
      image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a26d7?q=80&w=200&h=200&fit=crop'
    },
    {
      id: 103,
      name: 'Calíper de Pistón Simple',
      code: 'OEM-77192-F',
      price: 185.00,
      x: '75%',
      y: '30%',
      category: 'Frenos',
      image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?q=80&w=200&h=200&fit=crop'
    },
    // Motor
    {
      id: 104,
      name: 'Filtro de Aire Premium',
      code: 'OEM-99210-C',
      price: 24.99,
      x: '30%',
      y: '35%',
      category: 'Motor',
      image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a26d7?q=80&w=200&h=200&fit=crop'
    },
    {
      id: 105,
      name: 'Filtro de Aceite Sintético',
      code: 'OEM-22340-X',
      price: 16.50,
      x: '65%',
      y: '68%',
      category: 'Motor',
      image: 'https://images.unsplash.com/photo-1616422285623-13ff016217d9?q=80&w=200&h=200&fit=crop'
    }
  ];

  const currentHotspots = hotspots.filter(h => h.category === selectedSystem);

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 md:px-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gradient uppercase tracking-tight">Diagramas OEM Despiezados</h2>
        <p className="text-sm text-gray-400">Selecciona un sistema mecánico y haz clic en los hotspots para identificar repuestos con sus códigos y precios oficiales.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-850 pb-4">
        {(['Frenos', 'Motor'] as const).map((system) => (
          <button
            key={system}
            onClick={() => {
              setSelectedSystem(system);
              setSelectedPart(null);
            }}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded transition-colors cursor-pointer ${
              selectedSystem === system
                ? 'bg-orange-600 text-white'
                : 'bg-gray-900 border border-gray-850 text-gray-400 hover:text-white'
            }`}
          >
            Sistema de {system}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Schematic Viewer Canvas */}
        <div className="lg:col-span-2 bg-gray-950 border border-gray-850 rounded-xl p-8 relative min-h-[400px] flex items-center justify-center overflow-hidden">
          {/* Tech lines background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-35" />
          
          <div className="relative w-full max-w-[500px] aspect-[4/3] bg-gray-900/50 rounded-xl border border-gray-800/80 flex items-center justify-center">
            <span className="text-gray-600 font-bold uppercase text-xs tracking-widest flex items-center gap-2">
              <Layers size={16} /> Esquema Despiece - {selectedSystem}
            </span>

            {/* Hotspots */}
            {currentHotspots.map((h) => (
              <button
                key={h.id}
                onClick={() => setSelectedPart(h)}
                style={{ left: h.x, top: h.y }}
                className={`absolute w-8 h-8 rounded-full border flex items-center justify-center cursor-pointer transition-all shadow-lg animate-pulse ${
                  selectedPart?.id === h.id
                    ? 'bg-orange-500 border-white text-white scale-125 z-10'
                    : 'bg-orange-600/30 border-orange-500 text-orange-400 hover:bg-orange-600/50'
                }`}
              >
                <Crosshair size={14} />
              </button>
            ))}
          </div>
        </div>

        {/* Selected Part Panel */}
        <div className="bg-gray-900 border border-gray-850 p-6 rounded-xl flex flex-col justify-between">
          {selectedPart ? (
            <motion.div
              key={selectedPart.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div>
                <span className="text-[10px] font-bold tracking-widest bg-orange-600/20 text-orange-400 border border-orange-500/20 px-2 py-0.5 rounded uppercase">
                  Identificado
                </span>
                <h3 className="font-bold text-xl text-white mt-3 leading-snug">{selectedPart.name}</h3>
                <p className="text-xs font-mono text-gray-500 mt-1">CÓDIGO OEM: {selectedPart.code}</p>
              </div>

              <img
                src={selectedPart.image}
                alt={selectedPart.name}
                className="w-full h-40 object-cover rounded bg-gray-800 border border-gray-800"
              />

              <div className="flex justify-between items-baseline py-4 border-y border-gray-850">
                <span className="text-xs font-bold text-gray-400 uppercase">Precio Unitario</span>
                <span className="text-2xl font-bold text-orange-500">${selectedPart.price.toFixed(2)}</span>
              </div>

              <button
                onClick={() => onAddToCart({ id: selectedPart.id, name: selectedPart.name, price: selectedPart.price, image: selectedPart.image })}
                className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-3 uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-2 cursor-pointer text-sm shadow-md"
              >
                <Plus size={16} /> Añadir al Carrito
              </button>
            </motion.div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-500 gap-3 py-12">
              <Crosshair size={40} className="opacity-25 animate-spin" />
              <p className="text-sm font-semibold">Selecciona una pieza en el plano</p>
              <p className="text-xs text-gray-600 max-w-[200px]">Haz clic en cualquiera de los marcadores naranjos del esquema para cargar los detalles oficiales.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
