
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCart } from '../contexts/CartContext';
import { Plus } from 'lucide-react';

interface Pizza {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category?: string;
}

interface PizzaCardProps {
  pizza: Pizza;
}

const PizzaCard = ({ pizza }: PizzaCardProps) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(pizza);
  };

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="relative">
        <img
          src={pizza.image || '/placeholder.svg'}
          alt={pizza.name}
          className="w-full h-48 object-cover"
        />
        {pizza.category && (
          <Badge className="absolute top-2 left-2 bg-red-500">
            {pizza.category}
          </Badge>
        )}
      </div>
      
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          {pizza.name}
        </h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {pizza.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-red-500">
            ${pizza.price.toFixed(2)}
          </span>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button 
          onClick={handleAddToCart}
          className="w-full bg-red-500 hover:bg-red-600 text-white"
          size="sm"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PizzaCard;
