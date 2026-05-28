import { X, Trash2, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: number, delta: number) => void;
  onRemoveItem: (id: number) => void;
  onCheckout: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout
}: CartDrawerProps) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  // B2B 10% discount
  const discount = subtotal * 0.10;
  const iva = (subtotal - discount) * 0.19;
  const total = subtotal - discount + iva;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-50 cursor-pointer"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-screen w-full max-w-md bg-gray-900 border-l border-gray-800 text-white z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingBag className="text-orange-500" />
                <h3 className="text-xl font-bold uppercase tracking-wider">Tu Carrito B2B</h3>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-full transition-colors text-gray-400 hover:text-white">
                <X size={24} />
              </button>
            </div>

            {/* Item List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-4">
                  <ShoppingBag size={48} className="opacity-20" />
                  <p className="text-center font-medium">El carrito está vacío</p>
                  <p className="text-xs text-center text-gray-500">Agrega repuestos desde el catálogo o haz un Pedido Rápido</p>
                </div>
              ) : (
                items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex gap-4 p-3 bg-gray-800/50 border border-gray-800 rounded-lg hover:border-gray-700 transition-all"
                  >
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded bg-gray-700" />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-semibold text-sm line-clamp-1">{item.name}</h4>
                        <p className="text-orange-500 font-bold text-sm mt-0.5">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-gray-700 rounded overflow-hidden bg-gray-900">
                          <button
                            onClick={() => onUpdateQuantity(item.id, -1)}
                            className="px-2 py-0.5 hover:bg-gray-800 transition-colors text-gray-400"
                          >
                            -
                          </button>
                          <span className="px-3 py-0.5 text-xs font-bold text-orange-400">{item.quantity}</span>
                          <button
                            onClick={() => onUpdateQuantity(item.id, 1)}
                            className="px-2 py-0.5 hover:bg-gray-800 transition-colors text-gray-400"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors p-1"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Calculations & Checkout */}
            {items.length > 0 && (
              <div className="p-6 border-t border-gray-800 bg-gray-950/80 space-y-4">
                <div className="space-y-2 text-sm text-gray-400">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-white font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-green-400 font-medium">
                    <span>Descuento Mayorista (10%)</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>IVA (19%)</span>
                    <span className="text-white font-medium">${iva.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-800 pt-2 flex justify-between text-base font-bold text-white">
                    <span className="uppercase tracking-wider">Total Final</span>
                    <span className="text-orange-500">${total.toFixed(2)}</span>
                  </div>
                </div>
                <button
                  onClick={onCheckout}
                  className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-3 uppercase tracking-wider rounded transition-colors text-center cursor-pointer shadow-lg shadow-orange-900/20"
                >
                  Confirmar Pedido B2B
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
