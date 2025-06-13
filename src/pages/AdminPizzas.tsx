
import React, { useState, useEffect } from 'react';
import { pizzaAPI } from '../services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface Pizza {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
}

const AdminPizzas = () => {
  const [pizzas, setPizzas] = useState<Pizza[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPizza, setEditingPizza] = useState<Pizza | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    image: '',
    description: '',
    category: 'classic'
  });

  useEffect(() => {
    fetchPizzas();
  }, []);

  const fetchPizzas = async () => {
    try {
      const response = await pizzaAPI.getAll();
      setPizzas(response.data);
    } catch (error) {
      console.error('Error fetching pizzas:', error);
      // Mock data for demo
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
        }
      ];
      setPizzas(mockPizzas);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const pizzaData = {
        ...formData,
        price: parseFloat(formData.price)
      };

      if (editingPizza) {
        await pizzaAPI.update(editingPizza.id, pizzaData);
        toast.success('Pizza updated successfully!');
      } else {
        await pizzaAPI.create(pizzaData);
        toast.success('Pizza added successfully!');
      }

      resetForm();
      fetchPizzas();
    } catch (error) {
      console.error('Error saving pizza:', error);
      toast.error('Failed to save pizza');
    }
  };

  const handleEdit = (pizza: Pizza) => {
    setEditingPizza(pizza);
    setFormData({
      name: pizza.name,
      price: pizza.price.toString(),
      image: pizza.image,
      description: pizza.description,
      category: pizza.category
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this pizza?')) {
      try {
        await pizzaAPI.delete(id);
        toast.success('Pizza deleted successfully!');
        fetchPizzas();
      } catch (error) {
        console.error('Error deleting pizza:', error);
        toast.error('Failed to delete pizza');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      image: '',
      description: '',
      category: 'classic'
    });
    setEditingPizza(null);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Manage Pizzas</h1>
          <Button 
            onClick={() => setShowForm(true)}
            className="bg-red-500 hover:bg-red-600"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Pizza
          </Button>
        </div>

        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>
                {editingPizza ? 'Edit Pizza' : 'Add New Pizza'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Pizza Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="price">Price ($)</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="image">Image URL</Label>
                  <Input
                    id="image"
                    value={formData.image}
                    onChange={(e) => setFormData({...formData, image: e.target.value})}
                    placeholder="https://example.com/pizza-image.jpg"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <select 
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="classic">Classic</option>
                    <option value="premium">Premium</option>
                    <option value="vegetarian">Vegetarian</option>
                    <option value="meat lovers">Meat Lovers</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={3}
                  />
                </div>
                
                <div className="flex space-x-4">
                  <Button type="submit" className="bg-red-500 hover:bg-red-600">
                    {editingPizza ? 'Update Pizza' : 'Add Pizza'}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pizzas.map((pizza) => (
            <Card key={pizza.id}>
              <CardContent className="p-4">
                <img
                  src={pizza.image || '/placeholder.svg'}
                  alt={pizza.name}
                  className="w-full h-32 object-cover rounded-lg mb-4"
                />
                <h3 className="text-lg font-semibold mb-2">{pizza.name}</h3>
                <p className="text-gray-600 text-sm mb-2">{pizza.description}</p>
                <p className="text-lg font-bold text-red-500 mb-4">${pizza.price.toFixed(2)}</p>
                
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(pizza)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(pizza.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPizzas;
