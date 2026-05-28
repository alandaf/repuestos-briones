import { Plus, Check, ShieldAlert } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  compatibleBrands: string[];
}

interface Vehicle {
  plateOrVin: string;
  brand: string;
  model: string;
  year: number;
  engine: string;
}

interface ProductCatalogProps {
  activeVehicle: Vehicle | null;
  onAddToCart: (product: { id: number; name: string; price: number; image: string }) => void;
}

const products: Product[] = [
  {
    id: 1,
    name: 'Filtro de Aceite Premium OEM',
    price: 15.99,
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a26d7?q=80&w=300&h=200&fit=crop',
    compatibleBrands: ['Hyundai', 'Toyota', 'Nissan']
  },
  {
    id: 2,
    name: 'Pastillas de Freno Cerámicas Ultra-Stop',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1619642751034-7b82df6b2b73?q=80&w=300&h=200&fit=crop',
    compatibleBrands: ['Hyundai', 'Kia']
  },
  {
    id: 3,
    name: 'Batería de Alto Rendimiento AGM 12V',
    price: 145.00,
    image: 'https://images.unsplash.com/photo-1616422285623-13ff016217d9?q=80&w=300&h=200&fit=crop',
    compatibleBrands: ['Toyota', 'Hyundai', 'Nissan', 'Ford']
  },
  {
    id: 4,
    name: 'Amortiguador Delantero Reforzado Gas',
    price: 110.50,
    image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?q=80&w=300&h=200&fit=crop',
    compatibleBrands: ['Toyota', 'Suzuki']
  },
];

export default function ProductCatalog({ activeVehicle, onAddToCart }: ProductCatalogProps) {
  return (
    <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">Catálogo de Repuestos Disponibles</h3>
          <p className="text-sm text-gray-400">Piezas OEM certificadas con garantía de fábrica.</p>
        </div>
        {activeVehicle && (
          <span className="text-xs bg-orange-600/10 border border-orange-500/30 text-orange-400 px-3.5 py-1.5 rounded-lg font-bold uppercase tracking-wider">
            Mostrando compatibilidad para {activeVehicle.brand} {activeVehicle.model}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => {
          const isCompatible = activeVehicle
            ? product.compatibleBrands.some(
                (brand) => brand.toLowerCase() === activeVehicle.brand.toLowerCase()
              )
            : null;

          return (
            <div
              key={product.id}
              className="bg-gray-900 border border-gray-850 p-4 rounded-xl flex flex-col justify-between gap-4 hover:border-gray-700 transition-all group"
            >
              <div className="relative overflow-hidden rounded-lg bg-gray-950 aspect-video">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
                />
                
                {/* Compatibility Badges */}
                {activeVehicle && (
                  <div className="absolute top-2 left-2 right-2">
                    {isCompatible ? (
                      <span className="flex items-center gap-1 text-[10px] font-bold bg-green-900/90 border border-green-500 text-green-300 px-2 py-1 rounded shadow-lg backdrop-blur-sm">
                        <Check size={12} /> 100% COMPATIBLE
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] font-bold bg-red-950/90 border border-red-800 text-red-300 px-2 py-1 rounded shadow-lg backdrop-blur-sm">
                        <ShieldAlert size={12} /> NO COMPATIBLE
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-base text-gray-100 group-hover:text-orange-500 transition-colors line-clamp-1">
                  {product.name}
                </h4>
                <p className="text-xs text-gray-500">
                  Modelos: {product.compatibleBrands.join(', ')}
                </p>
                <div className="flex justify-between items-baseline pt-2">
                  <span className="text-xs font-bold text-gray-400">Precio B2B</span>
                  <span className="text-xl font-black text-orange-500">${product.price.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={() => onAddToCart(product)}
                className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-colors text-sm shadow-md"
              >
                <Plus size={16} /> Agregar al Carrito
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
