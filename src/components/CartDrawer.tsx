'use client';

import { useCart } from '@/context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { X, Plus, Minus, Trash2 } from 'lucide-react';

export default function CartDrawer() {
  const { cart, isCartOpen, closeCart, updateQuantity, removeFromCart, cartTotal } = useCart();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col"
            style={{ paddingRight: 'max(env(safe-area-inset-right, 0px), 0px)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-neutral-200">
              <h2 className="text-lg sm:text-xl font-bold">Your Cart</h2>
              <button
                onClick={closeCart}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center -mr-2 hover:bg-neutral-100 active:bg-neutral-200 rounded-md transition-colors"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 overscroll-contain">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <p className="font-description text-neutral-500 mb-2">Your cart is empty</p>
                  <p className="font-description text-sm text-neutral-400">Add some items to get started</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {cart.map((item) => (
                    <div
                      key={`${item.id}-${item.selectedSize}`}
                      className="flex gap-3 sm:gap-4 border-b border-neutral-200 pb-4 sm:pb-6"
                    >
                      {/* Image */}
                      <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-neutral-100 rounded-md overflow-hidden flex-shrink-0">
                        <Image
                          src={item.images[0]}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm mb-1 truncate">{item.name}</h3>
                        <p className="font-description text-xs text-neutral-500 mb-2">
                          Size: {item.selectedSize}
                        </p>
                        <p className="font-description text-sm font-semibold">${item.price}</p>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3 mt-3">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.selectedSize, item.quantity - 1)
                            }
                            className="min-w-[36px] min-h-[36px] flex items-center justify-center hover:bg-neutral-100 active:bg-neutral-200 rounded transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="font-description text-sm font-medium w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.selectedSize, item.quantity + 1)
                            }
                            className="min-w-[36px] min-h-[36px] flex items-center justify-center hover:bg-neutral-100 active:bg-neutral-200 rounded transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item.id, item.selectedSize)}
                        className="min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-neutral-100 active:bg-neutral-200 rounded-md transition-colors self-start"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4 text-neutral-500" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="border-t border-neutral-200 p-4 sm:p-6 space-y-4">
                <div className="flex items-center justify-between text-lg font-bold">
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <button className="w-full bg-black text-white py-4 min-h-[48px] rounded-md hover:opacity-90 active:opacity-95 transition-opacity font-medium">
                  Checkout
                </button>
                <p className="font-description text-xs text-neutral-500 text-center">
                  Shipping & taxes calculated at checkout
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
