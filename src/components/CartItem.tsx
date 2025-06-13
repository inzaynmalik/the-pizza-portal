
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCart } from '../contexts/CartContext';
import { Minus, Plus, Trash2 } from 'lucide-react';

interface Pizza {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
}

interface CartItemProps {
  pizza: Pizza;
  quantity: number;
}

const CartItem = ({ pizza, quantity }: CartItemProps) => {
  const { updateQuantity, removeFromCart } = useCart();

  const handleIncrease = () => {
    updateQuantity(pizza.id, quantity + 1);
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      updateQuantity(pizza.id, quantity - 1);
    } else {
      removeFromCart(pizza.id);
    }
  };

  const handleRemove = () => {
    removeFromCart(pizza.id);
  };

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          {/* Pizza Image */}
          <img
            src={pizza.image || '/placeholder.svg'}
            alt={pizza.name}
            className="w-16 h-16 object-cover rounded-lg"
          />
          
          {/* Pizza Details */}
          <div className="flex-1">
            <h3 className="font-semibold text-gray-800">{pizza.name}</h3>
            <p className="text-sm text-gray-600 line-clamp-1">{pizza.description}</p>
            <p className="text-lg font-bold text-red-500">${pizza.price.toFixed(2)}</p>
          </div>
          
          {/* Quantity Controls */}
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDecrease}
              className="h-8 w-8 p-0"
            >
              <Minus className="h-4 w-4" />
            </Button>
            
            <span className="w-8 text-center font-semibold">{quantity}</span>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleIncrease}
              className="h-8 w-8 p-0"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Total Price */}
          <div className="text-right">
            <p className="font-bold text-lg">${(pizza.price * quantity).toFixed(2)}</p>
          </div>
          
          {/* Remove Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CartItem;
