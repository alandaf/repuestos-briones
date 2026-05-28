import React, { useState } from 'react';
import { Car, Plus, Trash2, CheckCircle2, Wrench } from 'lucide-react';
import { motion } from 'motion/react';

interface Vehicle {
  plateOrVin: string;
  brand: string;
  model: string;
  year: number;
  engine: string;
}

interface GarageProps {
  activeVehicle: Vehicle | null;
  setActiveVehicle: (v: Vehicle | null) => void;
}

export default function Garage({ activeVehicle, setActiveVehicle }: GarageProps) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([
    { plateOrVin: 'ABCD12', brand: 'Hyundai', model: 'Accent', year: 2018, engine: '1.4L DOHC' },
    { plateOrVin: 'XYZW99', brand: 'Toyota', model: 'Hilux', year: 2022, engine: '2.8L Diésel' }
  ]);

  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState(2020);
  const [plate, setPlate] = useState('');
  const [engine, setEngine] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brand || !model || !plate) return;

    const newVehicle: Vehicle = {
      brand,
      model,
      year: Number(year),
      plateOrVin: plate.toUpperCase(),
      engine: engine || 'N/A'
    };

    setVehicles([...vehicles, newVehicle]);
    setActiveVehicle(newVehicle);
    setBrand('');
    setModel('');
    setYear(2020);
    setPlate('');
    setEngine('');
    setShowAddForm(false);
  };

  const handleDelete = (plateOrVin: string) => {
    setVehicles(vehicles.filter(v => v.plateOrVin !== plateOrVin));
    if (activeVehicle?.plateOrVin === plateOrVin) {
      setActiveVehicle(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 md:px-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gradient uppercase tracking-tight">Mi Garaje Virtual</h2>
          <p className="text-sm text-gray-400">Administra los vehículos de tu flota para verificar compatibilidad de repuestos en un clic.</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-orange-600 hover:bg-orange-500 text-white font-bold py-2.5 px-4 rounded-lg flex items-center gap-2 transition-colors cursor-pointer text-sm"
        >
          <Plus size={18} /> {showAddForm ? 'Cancelar' : 'Agregar Vehículo'}
        </button>
      </div>

      {showAddForm && (
        <motion.form
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleAddVehicle}
          className="bg-gray-900 border border-gray-800 p-6 rounded-xl space-y-4 mb-8"
        >
          <h3 className="font-bold text-white text-lg">Nuevo Vehículo</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Patente o VIN</label>
              <input
                required
                type="text"
                placeholder="Ej: ABCD12 o VIN"
                value={plate}
                onChange={e => setPlate(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500 uppercase"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Marca</label>
              <input
                required
                type="text"
                placeholder="Ej: Toyota"
                value={brand}
                onChange={e => setBrand(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Modelo</label>
              <input
                required
                type="text"
                placeholder="Ej: Hilux"
                value={model}
                onChange={e => setModel(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Año</label>
              <input
                required
                type="number"
                min="1950"
                max="2027"
                value={year}
                onChange={e => setYear(Number(e.target.value))}
                className="w-full bg-gray-950 border border-gray-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Motor (Opcional)</label>
              <input
                type="text"
                placeholder="Ej: 2.8L Diésel"
                value={engine}
                onChange={e => setEngine(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>
          <button
            type="submit"
            className="bg-orange-600 hover:bg-orange-500 text-white font-bold py-2 px-5 text-sm uppercase rounded cursor-pointer transition-colors"
          >
            Guardar en mi Garaje
          </button>
        </motion.form>
      )}

      {/* Grid of saved vehicles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {vehicles.map((v) => {
          const isActive = activeVehicle?.plateOrVin === v.plateOrVin;
          return (
            <div
              key={v.plateOrVin}
              className={`p-5 rounded-xl border flex flex-col justify-between transition-all ${
                isActive
                  ? 'bg-orange-500/10 border-orange-500/50 shadow-lg shadow-orange-950/20'
                  : 'bg-gray-900 border-gray-800 hover:border-gray-700'
              }`}
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-lg border ${isActive ? 'bg-orange-600 border-orange-500/50 text-white' : 'bg-gray-850 border-gray-850 text-gray-400'}`}>
                      <Car size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-white">{v.brand} {v.model}</h4>
                      <p className="text-xs text-gray-400">{v.engine} • {v.year}</p>
                    </div>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded text-xs font-bold border tracking-wider ${isActive ? 'bg-orange-600/20 border-orange-500/30 text-orange-400' : 'bg-gray-850 border-gray-800 text-gray-500'}`}>
                    {v.plateOrVin}
                  </span>
                </div>

                <div className="mt-4 flex gap-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1"><Wrench size={12} /> Búsqueda Activa</span>
                </div>
              </div>

              <div className="flex gap-2 mt-6 pt-4 border-t border-gray-850">
                {!isActive ? (
                  <button
                    onClick={() => setActiveVehicle(v)}
                    className="flex-1 bg-gray-850 hover:bg-gray-800 text-xs font-bold text-white uppercase tracking-wider py-2 rounded transition-colors cursor-pointer"
                  >
                    Activar Compatibilidad
                  </button>
                ) : (
                  <span className="flex-1 bg-orange-600/10 text-orange-400 border border-orange-500/20 py-2 rounded flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wider">
                    <CheckCircle2 size={14} /> Vehículo Activo
                  </span>
                )}
                <button
                  onClick={() => handleDelete(v.plateOrVin)}
                  className="p-2 border border-gray-800 text-gray-500 hover:text-red-500 hover:border-red-500/20 rounded transition-colors cursor-pointer"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
