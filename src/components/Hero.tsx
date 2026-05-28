import { Search, Car, AlertCircle, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'motion/react';

interface Vehicle {
  plateOrVin: string;
  brand: string;
  model: string;
  year: number;
  engine: string;
}

interface HeroProps {
  onVehicleIdentified: (vehicle: Vehicle) => void;
  activeVehicle: Vehicle | null;
}

export default function Hero({ onVehicleIdentified, activeVehicle }: HeroProps) {
  const [plate, setPlate] = useState('');
  const [vin, setVin] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSearch = async (identifier: string) => {
    if (!identifier.trim()) return;
    setLoading(true);
    setErrorMessage('');
    
    try {
      const response = await fetch(`/api/vehicle/${encodeURIComponent(identifier.trim().toUpperCase())}`);
      const data = await response.json();
      
      if (response.ok) {
        onVehicleIdentified(data);
      } else {
        setErrorMessage(data.error || 'Vehículo no encontrado');
      }
    } catch (error) {
      setErrorMessage('Error al conectar con la base de datos del Registro Civil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full py-16 px-4 md:px-8 bg-gray-950 border-b border-gray-850 relative overflow-hidden">
      {/* Tech grid/lines background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,#ea580c10_0%,transparent_50%)]" />

      <div className="max-w-4xl mx-auto text-center mb-10 relative z-10">
        <span className="text-orange-500 font-bold uppercase text-xs tracking-widest bg-orange-600/10 border border-orange-500/20 px-3 py-1 rounded-full">
          Tecnología de Búsqueda de Repuestos
        </span>
        <h2 className="text-3xl md:text-5xl font-black text-white mt-4 tracking-tight uppercase leading-tight">
          Verificación de <span className="text-gradient-orange">Compatibilidad</span> Exacta
        </h2>
        <p className="text-sm md:text-base text-gray-400 max-w-2xl mx-auto mt-4">
          Ingresa la patente chilena o el número VIN de 17 dígitos para sincronizar las piezas OEM exactas de tu vehículo.
        </p>
      </div>

      {/* Dual Search Card */}
      <div className="max-w-4xl mx-auto bg-gray-900/50 border border-gray-800 p-6 md:p-8 rounded-2xl shadow-2xl relative z-10 glass">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* VIN Input */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400">Buscar por código VIN (17 dígitos)</label>
            <div className="relative flex items-center bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 focus-within:border-orange-500/50 transition-colors">
              <Search className="text-gray-500 mr-3" size={18} />
              <input
                className="w-full bg-transparent border-none focus:outline-none text-sm text-white placeholder-gray-600 uppercase"
                placeholder="INGRESE VIN DE 17 DÍGITOS..."
                type="text"
                maxLength={17}
                value={vin}
                onChange={(e) => setVin(e.target.value)}
              />
            </div>
            <button
              onClick={() => handleSearch(vin)}
              disabled={loading || vin.length < 5}
              className="w-full bg-gray-800 hover:bg-gray-750 text-white font-bold py-2.5 rounded-lg text-xs uppercase transition-colors cursor-pointer disabled:opacity-50"
            >
              Validar VIN
            </button>
          </div>

          {/* Plate Input */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400">Buscar por Patente (Chile)</label>
            <div className="relative flex items-center bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 focus-within:border-orange-500/50 transition-colors">
              <Car className="text-gray-500 mr-3" size={18} />
              <input
                className="w-full bg-transparent border-none focus:outline-none text-sm text-white placeholder-gray-600 uppercase"
                placeholder="N° DE PATENTE (EJ. ABCD12)..."
                type="text"
                maxLength={8}
                value={plate}
                onChange={(e) => setPlate(e.target.value)}
              />
            </div>
            <button
              onClick={() => handleSearch(plate)}
              disabled={loading || plate.length < 4}
              className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-2.5 rounded-lg text-xs uppercase transition-colors cursor-pointer disabled:opacity-50 shadow-lg shadow-orange-950/20"
            >
              Consultar Patente
            </button>
          </div>
        </div>

        {/* Status Messages */}
        {loading && (
          <div className="flex items-center justify-center gap-2 py-2 text-sm text-orange-400">
            <span className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></span>
            Consultando registros vehiculares...
          </div>
        )}

        {errorMessage && (
          <div className="flex items-center gap-2 bg-red-950/40 border border-red-900/30 p-3 rounded-lg text-xs text-red-400 mt-4">
            <AlertCircle size={16} className="shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {activeVehicle && !loading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-green-950/20 border border-green-500/30 p-4 rounded-xl mt-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-lg text-green-400">
                <CheckCircle size={22} />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">Vehículo Sincronizado Activo</h4>
                <p className="text-xs text-gray-400 mt-0.5">
                  {activeVehicle.brand} {activeVehicle.model} ({activeVehicle.year}) • Motor {activeVehicle.engine} • ID: {activeVehicle.plateOrVin}
                </p>
              </div>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-green-500/20 text-green-400 px-3 py-1 rounded-full border border-green-500/30">
              Filtro de compatibilidad activo
            </span>
          </motion.div>
        )}
      </div>
    </section>
  );
}
