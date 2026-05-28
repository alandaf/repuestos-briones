import { useState } from 'react';
import { Package, Clock, Truck, ShieldCheck, CheckCircle2, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

interface OrderItem {
  name: string;
  qty: number;
  price: number;
}

interface Order {
  id: string;
  date: string;
  total: number;
  status: 'Recibido' | 'Preparación' | 'Despachado' | 'Entregado';
  items: OrderItem[];
}

export default function Orders() {
  const [orders] = useState<Order[]>([
    {
      id: 'PED-98218-CL',
      date: '2026-05-27',
      total: 215.80,
      status: 'Despachado',
      items: [
        { name: 'Disco de Freno Ventilado', qty: 2, price: 90.00 },
        { name: 'Pastillas de Freno Cerámicas', qty: 1, price: 35.80 }
      ]
    },
    {
      id: 'PED-97401-CL',
      date: '2026-05-10',
      total: 145.00,
      status: 'Entregado',
      items: [
        { name: 'Batería de Alto Rendimiento 12V', qty: 1, price: 145.00 }
      ]
    }
  ]);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(orders[0]);

  const statusSteps = [
    { name: 'Recibido', icon: Clock, desc: 'Pedido confirmado y pagado' },
    { name: 'Preparación', icon: Package, desc: 'Empaquetado en centro de distribución' },
    { name: 'Despachado', icon: Truck, desc: 'En tránsito a destino' },
    { name: 'Entregado', icon: CheckCircle2, desc: 'Recibido conforme' }
  ];

  const getStepIndex = (status: Order['status']) => {
    return statusSteps.findIndex(step => step.name === status);
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 md:px-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gradient uppercase tracking-tight">Historial de Pedidos B2B</h2>
        <p className="text-sm text-gray-400">Revisa el estado de tus compras mayoristas y rastrea los despachos de repuestos en tiempo real.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Orders List */}
        <div className="space-y-4">
          <h3 className="font-bold text-xs uppercase tracking-wider text-gray-400">Tus Compras</h3>
          {orders.map((order) => (
            <button
              key={order.id}
              onClick={() => setSelectedOrder(order)}
              className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer ${
                selectedOrder?.id === order.id
                  ? 'bg-orange-500/10 border-orange-500/50 shadow-md shadow-orange-950/20'
                  : 'bg-gray-900 border-gray-850 hover:border-gray-800'
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-sm text-white">{order.id}</span>
                <span className="text-xs text-gray-400">{order.date}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-orange-500">${order.total.toFixed(2)}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                  order.status === 'Entregado'
                    ? 'bg-green-600/20 border-green-500/30 text-green-400'
                    : 'bg-blue-600/20 border-blue-500/30 text-blue-400'
                }`}>
                  {order.status}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Tracking Details */}
        <div className="lg:col-span-2">
          {selectedOrder ? (
            <motion.div
              key={selectedOrder.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-900 border border-gray-850 rounded-xl p-6 md:p-8 space-y-8"
            >
              {/* Header Details */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-gray-850">
                <div>
                  <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Identificador de Compra</span>
                  <h3 className="text-xl font-bold text-white mt-1">{selectedOrder.id}</h3>
                </div>
                <div className="text-left md:text-right">
                  <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Total Facturado</span>
                  <p className="text-2xl font-bold text-orange-500 mt-1">${selectedOrder.total.toFixed(2)}</p>
                </div>
              </div>

              {/* Timeline Status */}
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-gray-400 mb-6">Estado del Despacho</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative">
                  {statusSteps.map((step, idx) => {
                    const currentIdx = getStepIndex(selectedOrder.status);
                    const isCompleted = idx <= currentIdx;
                    const isCurrent = idx === currentIdx;

                    return (
                      <div key={step.name} className="flex flex-col items-center text-center space-y-2">
                        <div className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${
                          isCompleted
                            ? 'bg-orange-600 border-orange-500 text-white shadow-lg shadow-orange-950/20'
                            : 'bg-gray-950 border-gray-800 text-gray-600'
                        } ${isCurrent ? 'scale-110 ring-4 ring-orange-500/10' : ''}`}>
                          <step.icon size={18} />
                        </div>
                        <div>
                          <p className={`text-xs font-bold uppercase tracking-wider ${isCompleted ? 'text-white' : 'text-gray-600'}`}>
                            {step.name}
                          </p>
                          <p className="text-[10px] text-gray-500 max-w-[120px] mx-auto mt-0.5">
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Items Breakdown */}
              <div className="pt-6 border-t border-gray-850">
                <h4 className="font-bold text-xs uppercase tracking-wider text-gray-400 mb-4">Piezas en el Envío</h4>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center bg-gray-950/50 p-3 rounded-lg border border-gray-850">
                      <div>
                        <p className="font-bold text-sm text-gray-200">{item.name}</p>
                        <p className="text-xs text-gray-500">Cantidad: {item.qty}</p>
                      </div>
                      <span className="font-semibold text-sm text-orange-400">${(item.price * item.qty).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="bg-gray-900 border border-gray-850 rounded-xl p-8 text-center text-gray-500">
              Selecciona un pedido para ver los detalles.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
