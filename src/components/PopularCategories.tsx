import { Zap, Droplet, Disc3, Gauge, Settings, ShieldCheck } from 'lucide-react';

export default function PopularCategories() {
  const categories = [
    { name: 'Frenos', icon: Disc3 },
    { name: 'Baterías', icon: Zap },
    { name: 'Aceite de Motor', icon: Droplet },
    { name: 'Filtros', icon: Settings },
    { name: 'Suspensión', icon: Gauge },
    { name: 'Seguridad General', icon: ShieldCheck },
  ];

  return (
    <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="mb-10">
        <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">Categorías Populares</h3>
        <p className="text-sm text-gray-400">Encuentra repuestos rápidos por sistemas mecánicos principales.</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {categories.map((cat) => (
          <a
            key={cat.name}
            href="#"
            className="bg-gray-900 border border-gray-850 p-6 rounded-xl flex flex-col items-center gap-4 hover:border-orange-500 hover:bg-gray-850 transition-all group"
          >
            <cat.icon className="text-orange-500 group-hover:text-orange-400 transition-colors group-hover:scale-110 duration-200" size={32} />
            <span className="font-bold text-xs text-center uppercase tracking-wider text-gray-300 group-hover:text-white transition-colors">
              {cat.name}
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
