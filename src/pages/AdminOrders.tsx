
import React, { useState, useEffect } from 'react';
import { orderAPI } from '../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock, CheckCircle, Truck, Package } from 'lucide-react';
import { toast } from 'sonner';

interface Order {
  id: string;
  userId: string;
  customerName: string;
  items: Array<{
    pizzaId: string;
    pizzaName: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  status: 'pending' | 'preparing' | 'out_for_delivery' | 'delivered';
  createdAt: string;
  deliveryAddress: string;
  phone: string;
}

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await orderAPI.getAllOrders();
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      // Mock data for demo
      const mockOrders: Order[] = [
        {
          id: '1',
          userId: 'user1',
          customerName: 'John Doe',
          items: [
            { pizzaId: '1', pizzaName: 'Margherita', quantity: 2, price: 12.99 },
            { pizzaId: '2', pizzaName: 'Pepperoni', quantity: 1, price: 15.49 }
          ],
          totalAmount: 45.46,
          status: 'preparing',
          createdAt: '2024-01-15T10:30:00Z',
          deliveryAddress: '123 Main St, City, State',
          phone: '+1234567890'
        },
        {
          id: '2',
          userId: 'user2',
          customerName: 'Jane Smith',
          items: [
            { pizzaId: '3', pizzaName: 'Supreme', quantity: 1, price: 18.99 }
          ],
          totalAmount: 25.06,
          status: 'pending',
          createdAt: '2024-01-15T11:15:00Z',
          deliveryAddress: '456 Oak Ave, City, State',
          phone: '+1987654321'
        }
      ];
      setOrders(mockOrders);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      await orderAPI.updateStatus(orderId, newStatus);
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus as any } : order
      ));
      toast.success('Order status updated successfully!');
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'preparing':
        return <Package className="h-4 w-4" />;
      case 'out_for_delivery':
        return <Truck className="h-4 w-4" />;
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500';
      case 'preparing':
        return 'bg-blue-500';
      case 'out_for_delivery':
        return 'bg-purple-500';
      case 'delivered':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const filteredOrders = statusFilter === 'all' 
    ? orders 
    : orders.filter(order => order.status === statusFilter);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Manage Orders</h1>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orders</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="preparing">Preparing</SelectItem>
              <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <Card key={order.id}>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                  <p className="text-sm text-gray-600">
                    Customer: {order.customerName} | Phone: {order.phone}
                  </p>
                  <p className="text-sm text-gray-600">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
                <Badge className={`${getStatusColor(order.status)} text-white`}>
                  <div className="flex items-center space-x-1">
                    {getStatusIcon(order.status)}
                    <span className="capitalize">{order.status.replace('_', ' ')}</span>
                  </div>
                </Badge>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Items:</h4>
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{item.pizzaName} x{item.quantity}</span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-between items-center pt-2 border-t">
                  <div>
                    <span className="font-medium">Total: ${order.totalAmount.toFixed(2)}</span>
                    <br />
                    <span className="text-sm text-gray-600">
                      Delivery: {order.deliveryAddress}
                    </span>
                  </div>
                  
                  <div className="flex space-x-2">
                    {order.status !== 'delivered' && (
                      <>
                        {order.status === 'pending' && (
                          <Button
                            size="sm"
                            onClick={() => handleStatusUpdate(order.id, 'preparing')}
                            className="bg-blue-500 hover:bg-blue-600"
                          >
                            Start Preparing
                          </Button>
                        )}
                        {order.status === 'preparing' && (
                          <Button
                            size="sm"
                            onClick={() => handleStatusUpdate(order.id, 'out_for_delivery')}
                            className="bg-purple-500 hover:bg-purple-600"
                          >
                            Out for Delivery
                          </Button>
                        )}
                        {order.status === 'out_for_delivery' && (
                          <Button
                            size="sm"
                            onClick={() => handleStatusUpdate(order.id, 'delivered')}
                            className="bg-green-500 hover:bg-green-600"
                          >
                            Mark Delivered
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-24 w-24 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No orders found</h2>
            <p className="text-gray-600">
              {statusFilter === 'all' 
                ? 'No orders have been placed yet.' 
                : `No orders with status "${statusFilter}".`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
