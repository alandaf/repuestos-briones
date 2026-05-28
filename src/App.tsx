import { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Hero from './components/Hero';
import PopularCategories from './components/PopularCategories';
import ProductCatalog from './components/ProductCatalog';
import CartDrawer from './components/CartDrawer';
import AIChat from './components/AIChat';
import Garage from './components/Garage';
import OEMDiagrams from './components/OEMDiagrams';
import Orders from './components/Orders';

interface Vehicle {
  plateOrVin: string;
  brand: string;
  model: string;
  year: number;
  engine: string;
}

interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export default function App() {
  const [currentSection, setCurrentSection] = useState<string>('Catálogo');
  const [activeVehicle, setActiveVehicle] = useState<Vehicle | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showCheckoutSuccess, setShowCheckoutSuccess] = useState(false);

  const handleAddToCart = (product: { id: number; name: string; price: number; image: string }) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    // Open cart drawer when adding item
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (id: number, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const nextQty = item.quantity + delta;
            return { ...item, quantity: nextQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveItem = (id: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleCheckout = () => {
    // Perform checkout logic (clearing cart, showing success message)
    setCartItems([]);
    setIsCartOpen(false);
    setShowCheckoutSuccess(true);
    // Hide success message after 4s
    setTimeout(() => {
      setShowCheckoutSuccess(false);
    }, 4000);
  };

  const renderSection = () => {
    switch (currentSection) {
      case 'Garaje':
        return <Garage activeVehicle={activeVehicle} setActiveVehicle={setActiveVehicle} />;
      case 'Diagramas OEM':
        return <OEMDiagrams onAddToCart={handleAddToCart} />;
      case 'Pedidos':
        return <Orders />;
      case 'Soporte Técnico':
        return <AIChat />;
      case 'Catálogo':
      default:
        return (
          <>
            <Hero onVehicleIdentified={setActiveVehicle} activeVehicle={activeVehicle} />
            <PopularCategories />
            <ProductCatalog activeVehicle={activeVehicle} onAddToCart={handleAddToCart} />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col font-sans">
      <Header
        activeVehicle={activeVehicle}
        cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        onCartClick={() => setIsCartOpen(true)}
        currentSection={currentSection}
        setCurrentSection={setCurrentSection}
      />
      
      <div className="flex flex-1">
        <Sidebar currentSection={currentSection} setCurrentSection={setCurrentSection} />
        
        <main className="flex-1 lg:ml-80 min-h-[calc(100vh-64px)] pb-12">
          {renderSection()}
        </main>
      </div>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
      />

      {/* Checkout Success Modal */}
      {showCheckoutSuccess && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/70 animate-fade-in">
          <div className="bg-gray-900 border border-green-500/30 p-8 rounded-2xl max-w-sm text-center space-y-4 shadow-2xl shadow-green-950/20">
            <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto border border-green-500/30">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white uppercase tracking-wider">¡Pedido Confirmado!</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              El pedido B2B se ha registrado con éxito. Puedes realizar el seguimiento en la pestaña "Mis Pedidos".
            </p>
            <button
              onClick={() => {
                setShowCheckoutSuccess(false);
                setCurrentSection('Pedidos');
              }}
              className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-6 rounded-lg text-xs uppercase tracking-wider transition-colors cursor-pointer w-full"
            >
              Ver mis Pedidos
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
