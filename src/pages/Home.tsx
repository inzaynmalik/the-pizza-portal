
import React, { useState, useEffect } from 'react';
import { pizzaAPI } from '../services/api';
import PizzaCard from '../components/PizzaCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter } from 'lucide-react';
import { toast } from 'sonner';

interface Pizza {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category?: string;
}

const Home = () => {
  const [pizzas, setPizzas] = useState<Pizza[]>([]);
  const [filteredPizzas, setFilteredPizzas] = useState<Pizza[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  const categories = ['all', 'classic', 'premium', 'vegetarian', 'meat lovers'];

  useEffect(() => {
    fetchPizzas();
  }, []);

  useEffect(() => {
    filterPizzas();
  }, [pizzas, searchTerm, selectedCategory]);

  const fetchPizzas = async () => {
    try {
      const response = await pizzaAPI.getAll();
      setPizzas(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching pizzas:', error);
      toast.error('Failed to load pizzas');
      // For demo purposes, let's add some mock data
      const mockPizzas: Pizza[] = [
        {
          id: '1',
          name: 'Margherita',
          price: 12.99,
          image: '/placeholder.svg',
          description: 'Fresh tomatoes, mozzarella cheese, and basil',
          category: 'classic'
        },
        {
          id: '2',
          name: 'Pepperoni',
          price: 15.49,
          image: '/placeholder.svg',
          description: 'Classic pepperoni with mozzarella cheese',
          category: 'classic'
        },
        {
          id: '3',
          name: 'Supreme',
          price: 18.99,
          image: '/placeholder.svg',
          description: 'Pepperoni, sausage, bell peppers, onions, and mushrooms',
          category: 'premium'
        },
        {
          id: '4',
          name: 'Veggie Delight',
          price: 16.49,
          image: '/placeholder.svg',
          description: 'Bell peppers, mushrooms, onions, olives, and tomatoes',
          category: 'vegetarian'
        }
      ];
      setPizzas(mockPizzas);
      setLoading(false);
    }
  };

  const filterPizzas = () => {
    let filtered = pizzas;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(pizza =>
        pizza.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pizza.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(pizza => pizza.category === selectedCategory);
    }

    setFilteredPizzas(filtered);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading delicious pizzas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-500 to-red-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Fresh. Hot. Delicious.
          </h1>
          <p className="text-xl md:text-2xl mb-8">
            Order your favorite pizza and get it delivered in 30 minutes or less!
          </p>
          <Button size="lg" className="bg-white text-red-500 hover:bg-gray-100 text-lg px-8 py-3">
            Order Now
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search pizzas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <Badge
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  className={`cursor-pointer capitalize ${
                    selectedCategory === category 
                      ? 'bg-red-500 hover:bg-red-600' 
                      : 'hover:bg-red-50 hover:text-red-500'
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Pizza Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPizzas.map((pizza) => (
            <PizzaCard key={pizza.id} pizza={pizza} />
          ))}
        </div>

        {filteredPizzas.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No pizzas found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
