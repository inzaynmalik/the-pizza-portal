import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { orderAPI, Order, OrdersResponse } from "../services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Clock,
  CheckCircle,
  Truck,
  Package,
  Phone,
  MapPin,
  CreditCard,
  LogIn,
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setLoading(false);
      navigate("/login", { state: { from: "/orders" } });
      return;
    }
    fetchOrders();
  }, [user?.id, navigate]);

  const fetchOrders = async () => {
    try {
      if (!user?.id) {
        console.log("No user ID found");
        setLoading(false);
        return;
      }

      const userId =
        typeof user.id === "string" ? parseInt(user.id, 10) : user.id;
      console.log("Fetching orders for user ID:", userId);

      const response = await orderAPI.getUserOrders(userId);
      console.log("Orders API response:", response);

      setOrders(response.orders || []);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error fetching orders:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
        });

        if (error.response?.status === 401) {
          toast.error("Please login to view your orders");
          navigate("/login", { state: { from: "/orders" } });
          return;
        }

        toast.error(error.response?.data?.message || "Failed to load orders");
      } else {
        console.error("Error fetching orders:", error);
        toast.error("Failed to load orders");
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "preparing":
        return <Package className="h-4 w-4" />;
      case "in-delivery":
        return <Truck className="h-4 w-4" />;
      case "delivered":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500";
      case "preparing":
        return "bg-blue-500";
      case "in-delivery":
        return "bg-purple-500";
      case "delivered":
        return "bg-green-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <LogIn className="h-24 w-24 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Please Login First
          </h2>
          <p className="text-gray-600 mb-4">
            You need to be logged in to view your orders.
          </p>
          <Button
            onClick={() => navigate("/login", { state: { from: "/orders" } })}
            className="bg-red-500 hover:bg-red-600"
          >
            Login
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">My Orders</h1>

        {!orders?.length ? (
          <div className="text-center py-12">
            <Package className="h-24 w-24 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              No orders yet
            </h2>
            <p className="text-gray-600 mb-4">
              Your order history will appear here once you place your first
              order.
            </p>
            <Button
              onClick={() => navigate("/")}
              className="bg-red-500 hover:bg-red-600"
            >
              Browse Menu
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id} className="overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between bg-gray-50 border-b">
                  <div>
                    <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                    <p className="text-sm text-gray-600">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <Badge
                    className={`${getStatusColor(order.status)} text-white`}
                  >
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(order.status)}
                      <span className="capitalize ml-1">
                        {order.status.replace("-", " ")}
                      </span>
                    </div>
                  </Badge>
                </CardHeader>

                <CardContent className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Order Items:</h4>
                    {order.pizzaItems.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center py-1"
                      >
                        <div className="flex-1">
                          <span className="font-medium">
                            {item.pizza?.name || `Pizza #${item.pizzaId}`}
                          </span>
                          {item.pizza && (
                            <p className="text-sm text-gray-600">
                              {item.pizza.description}
                            </p>
                          )}
                          <div className="text-sm text-gray-500">
                            Quantity: {item.quantity} × ${item.price.toFixed(2)}
                          </div>
                        </div>
                        <span className="font-medium ml-4">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{order.deliveryAddress}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span>{order.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      <span className="capitalize">{order.paymentMethod}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="font-medium">Total Amount:</span>
                    <span className="font-bold text-lg">
                      ${order.totalAmount.toFixed(2)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
