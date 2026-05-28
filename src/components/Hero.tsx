import { Search, AlertCircle, CheckCircle, RefreshCw, HelpCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';

interface Vehicle {
  plateOrVin: string;
  brand: string;
  model: string;
  year: number;
  engine: string;
}

interface PRTDetails extends Vehicle {
  tipo: string;
  motor: string;
  chasis: string;
  vin: string;
  sello: string;
}

interface HeroProps {
  onVehicleIdentified: (vehicle: Vehicle) => void;
  activeVehicle: Vehicle | null;
}

export default function Hero({ onVehicleIdentified, activeVehicle }: HeroProps) {
  const [plate, setPlate] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // PRT Specific states
  const [isCaptchaChecked, setIsCaptchaChecked] = useState(false);
  const [isCaptchaLoading, setIsCaptchaLoading] = useState(false);
  const [prtData, setPrtData] = useState<PRTDetails | null>(null);

  // Reset PRT results when user changes the plate input
  useEffect(() => {
    setPrtData(null);
    setIsCaptchaChecked(false);
  }, [plate]);

  const handleCaptchaClick = () => {
    if (!plate.trim() || isCaptchaChecked || isCaptchaLoading) return;
    
    setIsCaptchaLoading(true);
    // Simulate reCAPTCHA verification delay
    setTimeout(() => {
      setIsCaptchaLoading(false);
      setIsCaptchaChecked(true);
      // Trigger the search automatically after solving captcha
      fetchVehicleDetails();
    }, 1500);
  };

  const fetchVehicleDetails = async () => {
    const cleanPlate = plate.trim().toUpperCase().replace(/[- ]/g, "");
    if (!cleanPlate) return;
    setLoading(true);
    setErrorMessage('');
    
    try {
      const response = await fetch(`/api/vehicle/${encodeURIComponent(cleanPlate)}`);
      const data = await response.json();
      
      if (response.ok) {
        // Generate realistic PRT details from the fetched vehicle data
        const isCelerio = cleanPlate === 'CPPT27';
        const motorNum = isCelerio ? 'K10BN1173646' : `${data.brand[0].toUpperCase()}${data.model[0].toUpperCase()}${data.year}X${Math.floor(100000 + Math.random() * 900000)}`;
        const chasisNum = isCelerio ? 'MA3FC31S7AA273609' : `MA3FC31S7${data.brand[0].toUpperCase()}A${Math.floor(100000 + Math.random() * 900000)}`;
        
        setPrtData({
          ...data,
          tipo: data.brand.toLowerCase() === 'toyota' && data.model.toLowerCase() === 'hilux' ? 'CAMIONETA' : 'AUTOMOVIL',
          motor: motorNum,
          chasis: chasisNum,
          vin: '',
          sello: 'SELLO VERDE'
        });
      } else {
        setErrorMessage(data.error || 'Patente no encontrada en el registro de plantas');
        setIsCaptchaChecked(false);
      }
    } catch (error) {
      setErrorMessage('Error de conexión con el sistema de plantas PRT');
      setIsCaptchaChecked(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSyncVehicle = () => {
    if (prtData) {
      onVehicleIdentified({
        plateOrVin: prtData.plateOrVin,
        brand: prtData.brand,
        model: prtData.model,
        year: prtData.year,
        engine: prtData.engine
      });
    }
  };

  return (
    <section className="w-full py-12 px-4 md:px-8 bg-gray-950 border-b border-gray-850 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,#ea580c10_0%,transparent_50%)]" />

      {/* Main container */}
      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Header Title (Automotive/PRT context) */}
        <div className="text-center mb-10">
          <span className="text-orange-500 font-bold uppercase text-[10px] tracking-widest bg-orange-600/10 border border-orange-500/20 px-3 py-1 rounded-full">
            Consulta Técnica Integrada
          </span>
          <h2 className="text-2xl md:text-4xl font-black text-white mt-4 tracking-tight uppercase">
            Consulte el estado de su <span className="text-gradient-orange">Revisión Técnica</span>
          </h2>
          <p className="text-xs md:text-sm text-gray-400 mt-2">
            Ingrese la patente de su vehículo para consultar los datos técnicos vigentes de la planta PRT.
          </p>
        </div>

        {/* PRT Search Panel */}
        <div className="bg-gray-900 border border-gray-800 p-6 md:p-8 rounded-2xl shadow-2xl glass">
          
          {/* PRT Plate Input & Search Button */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            
            {/* Chilean Plate Frame */}
            <div className="bg-white border-4 border-gray-800 rounded-xl px-4 py-2 flex flex-col items-center justify-center min-w-[200px] h-20 shadow-inner relative overflow-hidden select-none">
              <span className="absolute top-1 text-[8px] font-bold text-gray-400 tracking-widest">CHILE</span>
              <input
                className="w-full bg-transparent border-none text-center text-3xl font-extrabold text-gray-900 tracking-wider focus:outline-none uppercase placeholder-gray-300 mt-2"
                placeholder="CPPT27"
                maxLength={6}
                value={plate}
                onChange={(e) => setPlate(e.target.value)}
              />
            </div>

            {/* Search Button (PRT magnifying glass style) */}
            <button
              onClick={() => {
                if (!plate.trim()) return;
                if (!isCaptchaChecked) {
                  setErrorMessage('Por favor verifica el reCAPTCHA antes de buscar.');
                  return;
                }
                fetchVehicleDetails();
              }}
              disabled={loading || !plate.trim()}
              className="bg-orange-600 hover:bg-orange-500 text-white font-bold p-5 rounded-xl transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center shadow-lg shadow-orange-950/20"
            >
              <Search size={24} />
            </button>
          </div>

          {/* Google reCAPTCHA Simulator Box */}
          <div className="flex justify-center mb-6">
            <div className="bg-gray-950 border border-gray-800 rounded-lg p-3.5 flex items-center justify-between gap-8 min-w-[300px] shadow-lg">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleCaptchaClick}
                  disabled={!plate.trim() || isCaptchaLoading}
                  className={`w-7 h-7 rounded border transition-all flex items-center justify-center cursor-pointer ${
                    isCaptchaChecked
                      ? 'bg-green-600 border-green-500 text-white'
                      : 'bg-gray-900 border-gray-700 hover:border-gray-500'
                  } ${!plate.trim() ? 'opacity-40 cursor-not-allowed' : ''}`}
                >
                  {isCaptchaLoading ? (
                    <RefreshCw size={14} className="animate-spin text-orange-500" />
                  ) : isCaptchaChecked ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : null}
                </button>
                <span className="text-xs font-medium text-gray-300 select-none">No soy un robot</span>
              </div>
              <div className="flex flex-col items-center select-none">
                <img
                  src="https://www.gstatic.com/recaptcha/api2/logo_48.png"
                  alt="reCAPTCHA"
                  className="w-8 h-8 object-contain opacity-70"
                />
                <span className="text-[8px] text-gray-500 mt-0.5">reCAPTCHA</span>
                <span className="text-[6px] text-gray-600">Privacidad - Condiciones</span>
              </div>
            </div>
          </div>

          {/* Quick Plates suggestion for Demo */}
          <div className="text-center mb-4">
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Patentes de prueba disponibles:</p>
            <div className="flex flex-wrap gap-2 justify-center mt-2">
              {['CPPT27', 'TJ6828', 'JG5165', 'KFHD30', 'UE2083'].map((p) => (
                <button
                  key={p}
                  onClick={() => setPlate(p)}
                  className="bg-gray-850 hover:bg-gray-800 hover:border-orange-500/30 text-gray-400 hover:text-white text-[10px] font-bold px-2.5 py-1 rounded-md border border-gray-800 transition-colors cursor-pointer"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Error message */}
          {errorMessage && (
            <div className="flex items-center gap-2 bg-red-950/40 border border-red-900/30 p-3 rounded-lg text-xs text-red-400 mb-6">
              <AlertCircle size={16} className="shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Loading Indicator */}
          {loading && (
            <div className="flex items-center justify-center gap-2 py-4 text-xs text-orange-400">
              <RefreshCw size={16} className="animate-spin" />
              Consultando base de datos técnica PRT...
            </div>
          )}

          {/* PRT Official Table Report */}
          {prtData && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 border border-gray-800 rounded-xl overflow-hidden shadow-2xl"
            >
              {/* Header Tab */}
              <div className="bg-orange-600/10 border-b border-gray-800 px-4 py-3 flex items-center justify-between">
                <span className="text-xs font-bold text-orange-400 uppercase tracking-wider flex items-center gap-2">
                  ✓ Información del Vehículo (PRT Oficial)
                </span>
                <span className="text-[10px] bg-green-500/20 text-green-400 border border-green-500/30 px-2 py-0.5 rounded font-bold uppercase">
                  {prtData.sello}
                </span>
              </div>

              {/* Table Data */}
              <div className="divide-y divide-gray-850 bg-gray-950/50 text-xs md:text-sm">
                {[
                  { label: 'Patente', val: prtData.plateOrVin },
                  { label: 'Tipo', val: prtData.tipo },
                  { label: 'Marca', val: prtData.brand },
                  { label: 'Modelo', val: prtData.model },
                  { label: 'Año Fab.', val: prtData.year },
                  { label: 'N° Motor', val: prtData.motor },
                  { label: 'N° Chasis', val: prtData.chasis },
                  { label: 'N° Vin', val: prtData.vin || 'SIN INFORMACIÓN' },
                  { label: 'Tipo Sello', val: prtData.sello },
                ].map((row, idx) => (
                  <div key={idx} className="flex py-2.5 px-4 justify-between items-center hover:bg-gray-900/40 transition-colors">
                    <span className="font-semibold text-gray-400 uppercase text-[11px]">{row.label}</span>
                    <span className="font-bold text-gray-200 uppercase">{row.val}</span>
                  </div>
                ))}
              </div>

              {/* Sync and Filter Button */}
              <div className="p-4 bg-gray-900 border-t border-gray-800 flex flex-col sm:flex-row gap-3 items-center justify-between">
                <p className="text-[10px] text-gray-500 text-center sm:text-left leading-relaxed">
                  * La información señalada precedentemente, corresponde a la registrada en las plantas de Revisión Técnicas chilenas.
                </p>
                <button
                  onClick={handleSyncVehicle}
                  className="bg-orange-600 hover:bg-orange-500 text-white font-bold py-2.5 px-5 rounded-lg text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-md shadow-orange-950/20 shrink-0"
                >
                  Sincronizar Repuestos Compatibles
                </button>
              </div>
            </motion.div>
          )}

          {/* Active vehicle top indicator banner */}
          {activeVehicle && !prtData && !loading && (
            <div className="flex items-center justify-between gap-4 bg-green-950/20 border border-green-500/30 p-4 rounded-xl mt-6">
              <div className="flex items-center gap-3">
                <CheckCircle size={18} className="text-green-400" />
                <p className="text-xs text-gray-300">
                  Filtro compatible activo para: <strong className="text-white uppercase">{activeVehicle.brand} {activeVehicle.model} ({activeVehicle.year})</strong>
                </p>
              </div>
              <span className="text-[9px] font-bold bg-green-500/20 text-green-400 border border-green-500/30 px-2 py-0.5 rounded uppercase">
                Activo
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
