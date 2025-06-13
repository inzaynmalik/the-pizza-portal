
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';

interface Pizza {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
}

interface CartItem {
  pizza: Pizza;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (pizza: Pizza, quantity?: number) => void;
  removeFromCart: (pizzaId: string) => void;
  updateQuantity: (pizzaId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (pizza: Pizza, quantity = 1) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.pizza.id === pizza.id);
      
      if (existingItem) {
        toast.success(`Added more ${pizza.name} to cart`);
        return prevItems.map(item =>
          item.pizza.id === pizza.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        toast.success(`${pizza.name} added to cart`);
        return [...prevItems, { pizza, quantity }];
      }
    });
  };

  const removeFromCart = (pizzaId: string) => {
    setItems(prevItems => {
      const item = prevItems.find(item => item.pizza.id === pizzaId);
      if (item) {
        toast.success(`${item.pizza.name} removed from cart`);
      }
      return prevItems.filter(item => item.pizza.id !== pizzaId);
    });
  };

  const updateQuantity = (pizzaId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(pizzaId);
      return;
    }

    setItems(prevItems =>
      prevItems.map(item =>
        item.pizza.id === pizzaId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    toast.success('Cart cleared');
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (item.pizza.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotalPrice,
      getTotalItems
    }}>
      {children}
    </CartContext.Provider>
  );
};
