import React from 'react';
import { ShoppingCart, Plus, Minus, X } from 'lucide-react';

const SimpleCartModal = ({ 
  showCart, 
  setShowCart, 
  cart = [], 
  updateCartQuantity, 
  handleCheckout,
  translations = {}
}) => {
  console.log('SimpleCartModal rendered:', { 
    showCart, 
    cartLength: cart.length,
    hasTranslations: Object.keys(translations).length > 0
  });

  if (!showCart) {
    console.log('Modal not showing because showCart is false');
    return null;
  }

  const getSubtotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getShippingCost = () => {
    return getSubtotal() > 50 ? 0 : 5.99;
  };

  const getFinalTotal = () => {
    return getSubtotal() + getShippingCost();
  };

  return (
    <>
      {/* This should appear as a visible test */}
      <div 
        className="fixed top-4 left-4 bg-red-500 text-white p-2 rounded z-50"
        style={{ zIndex: 10000 }}
      >
        Modal Test - Cart has {cart.length} items
      </div>

      {/* Main Modal */}
      <div 
        className="fixed inset-0"
        style={{ 
          zIndex: 9999,
          backgroundColor: 'rgba(0, 0, 0, 0.8)'
        }}
        onClick={() => {
          console.log('Backdrop clicked');
          setShowCart(false);
        }}
      >
        <div className="flex items-center justify-center min-h-screen p-4">
          <div 
            className="bg-white rounded-lg shadow-xl w-full max-w-md p-6"
            onClick={(e) => {
              console.log('Modal content clicked');
              e.stopPropagation();
            }}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-4 border-b border-gray-300 pb-4">
              <h2 className="text-xl font-bold text-gray-900">
                Shopping Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)} items)
              </h2>
              <button
                onClick={() => {
                  console.log('Close button clicked');
                  setShowCart(false);
                }}
                className="text-gray-600 hover:text-gray-900 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Content */}
            <div className="max-h-64 overflow-y-auto mb-4">
              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart className="h-12 w-12 text-gray-500 mx-auto mb-2" />
                  <p className="text-gray-800 font-medium">Your cart is empty</p>
                  <p className="text-gray-600">Add some books to get started!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-12 h-16 object-cover rounded shadow-sm"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 truncate">{item.title}</h4>
                        <p className="text-sm text-gray-700 truncate">{item.author}</p>
                        <p className="font-bold text-blue-700 text-lg">TZS {item.price}</p>
                      </div>
                      <div className="flex items-center gap-2 bg-white rounded-lg p-1 border">
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          className="p-2 hover:bg-gray-100 rounded text-gray-700 hover:text-gray-900"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="font-bold text-gray-900 min-w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          className="p-2 hover:bg-gray-100 rounded text-gray-700 hover:text-gray-900"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <button
                        onClick={() => updateCartQuantity(item.id, 0)}
                        className="p-2 hover:bg-red-100 text-red-600 hover:text-red-800 rounded-full transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="border-t border-gray-300 pt-4 bg-gray-50 rounded-lg p-4">
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-gray-800">
                    <span className="font-medium">Subtotal:</span>
                    <span className="font-semibold">TZS {getSubtotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-800">
                    <span className="font-medium">Shipping:</span>
                    <span className="font-semibold">{getShippingCost() === 0 ? 'Free' : `TZS ${getShippingCost().toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between font-bold text-xl text-gray-900 border-t border-gray-300 pt-3">
                    <span>Total:</span>
                    <span className="text-blue-700">TZS {getFinalTotal().toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowCart(false)}
                    className="flex-1 py-3 px-4 bg-gray-300 text-gray-800 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
                  >
                    Continue Shopping
                  </button>
                  <button
                    onClick={() => {
                      console.log('Checkout clicked');
                      handleCheckout();
                    }}
                    className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all"
                  >
                    Checkout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SimpleCartModal;