import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axios';
import { toast } from 'react-toastify';
import ItemCard from '../components/ItemCard';

export default function Home() {
  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showOrderPanel, setShowOrderPanel] = useState(false);
  const [showMyOrdersPanel, setShowMyOrdersPanel] = useState(false);
  const [myOrders, setMyOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMyOrders, setLoadingMyOrders] = useState(false);
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, itemsRes] = await Promise.all([
          axiosInstance.get('/api/users/currentuser'),
          axiosInstance.get('/api/items')
        ]);
        
        setUser(userRes.data.currentUser);
        setItems(itemsRes.data);
      } catch (err) {
        console.error(err);
        
        toast.error('Failed to load data');
        navigate('/signin');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleAddToOrder = (item) => {
    setSelectedItems(prev => {
      const existing = prev.find(i => i.itemId === item.id);
      if (existing) {
        return prev.map(i => 
          i.itemId === item.id ? {...i, quantity: i.quantity + 1} : i
        );
      }
      return [...prev, { itemId: item.id, quantity: 1, item }];
    });
    setShowOrderPanel(true);
  };

  const handleRemoveItem = (itemId) => {
    setSelectedItems(prev => {
      const existing = prev.find(i => i.itemId === itemId);
      if (existing.quantity > 1) {
        return prev.map(i => 
          i.itemId === itemId ? {...i, quantity: i.quantity - 1} : i
        );
      }
      return prev.filter(i => i.itemId !== itemId);
    });
  };

  const handleSubmitOrder = async () => {
    try {
      setSubmittingOrder(true);
      const orderData = {
        items: selectedItems.map(({ itemId, quantity }) => ({ itemId, quantity }))
      };
      
      await axiosInstance.post('/api/orders', orderData);
      toast.success('Order placed successfully!');
      setSelectedItems([]);
      setShowOrderPanel(false);
    } catch (err) {
      console.error(err);
      toast.error('Failed to place order');
    } finally {
      setSubmittingOrder(false);
    }
  };

  const fetchMyOrders = async () => {
    try {
      setLoadingMyOrders(true);
      const response = await axiosInstance.get('/api/orders');
      setMyOrders(response.data);
    } catch (err) {
      console.error(err);
      
      toast.error('Failed to load orders');
    } finally {
      setLoadingMyOrders(false);
    }
  };

  const handleMyOrdersClick = async () => {
    await fetchMyOrders();
    setShowMyOrdersPanel(true);
    setShowOrderPanel(false);
  };

  const totalItems = selectedItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = selectedItems.reduce(
    (sum, item) => sum + (item.item.price * item.quantity),
    0
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 relative">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Good Morning, {user?.name}</h1>
          <div className="flex flex-nowrap gap-2">
            <button
              onClick={() => navigate('/statistics')}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              📈 Statistics
            </button>
            
            <button
              onClick={() => navigate('/admin/receipts')}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              📑 View Receipts
            </button>
            
            {user?.role === 'admin' && (
              <>
                <button
                  onClick={() => navigate('/admin/orders')}
                  className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
                >
                  📊 Process Orders
                </button>
                
                <button
                  onClick={() => navigate('/admin/users')}
                  className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
                >
                  👤 Users
                </button>
              </>
            )}
            
            <button
              onClick={handleMyOrdersClick}
              className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600"
            >
              📋 My Orders
            </button>
            
            <button
              onClick={() => setShowOrderPanel(!showOrderPanel)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 relative"
            >
              🛒 View Order ({totalItems})
            </button>
            
            <button 
              onClick={() => navigate('/signin')}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              Sign Out
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map(item => (
            <ItemCard 
              key={item.id}
              item={item}
              quantity={selectedItems.find(i => i.itemId === item.id)?.quantity || 0}
              onAdd={() => handleAddToOrder(item)}
            />
          ))}
        </div>

        {/* Order Review Panel */}
        <div className={`fixed top-0 right-0 h-full w-96 bg-white shadow-xl transform transition-transform duration-300 ${
          showOrderPanel ? 'translate-x-0' : 'translate-x-full'
        }`}>
          <div className="p-6 h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Your Order</h2>
              <button
                onClick={() => setShowOrderPanel(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {selectedItems.length === 0 ? (
                <p className="text-gray-500 text-center">No items selected</p>
              ) : (
                selectedItems.map(({ itemId, quantity, item }) => (
                  <div key={itemId} className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-gray-600">
                        {quantity} × ${item.price}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold">${item.price * quantity}</span>
                      <button
                        onClick={() => handleRemoveItem(itemId)}
                        className="bg-red-100 text-red-600 px-2 py-1 rounded hover:bg-red-200"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {selectedItems.length > 0 && (
              <div className="border-t pt-4">
                <div className="flex justify-between mb-4">
                  <span className="font-bold">Total:</span>
                  <span className="font-bold">${totalPrice}</span>
                </div>
                <button
                  onClick={handleSubmitOrder}
                  disabled={submittingOrder}
                  className={`w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors ${
                    submittingOrder ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {submittingOrder ? 'Placing Order...' : 'Place Order'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* My Orders Panel */}
        <div className={`fixed top-0 right-0 h-full w-96 bg-white shadow-xl transform transition-transform duration-300 ${
          showMyOrdersPanel ? 'translate-x-0' : 'translate-x-full'
        }`}>
          <div className="p-6 h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Order History</h2>
              <button
                onClick={() => setShowMyOrdersPanel(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {loadingMyOrders ? (
                <div className="flex justify-center items-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
                </div>
              ) : myOrders.length === 0 ? (
                <p className="text-gray-500 text-center">No past orders found</p>
              ) : (
                myOrders.map(order => {
                  // Calculate total price for the order
                  const total = order.items.reduce((sum, item) => 
                    sum + (item.itemId.price * item.quantity), 0
                  );

                  return (
                    <div key={order.id} className="mb-4 border-b pb-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-sm text-gray-500">
                            
                            {new Date(order.createdAt * 1000).toLocaleString('en-US', {  
                              timeZone: 'Africa/Cairo',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: 'numeric',
                              minute: 'numeric',
                              second: 'numeric'
                            })
                          }
                          </p>
                          <p className="font-semibold">
                            Status: {order.received ? 'Completed' : 'Processing'}
                          </p>
                        </div>
                        <span className="font-bold">${total}</span>
                      </div>
                      <div className="space-y-2">
                        {order.items.map(item => (
                          <div key={item._id} className="flex justify-between text-sm">
                            <span>{item.itemId.name} x{item.quantity}</span>
                            <span>${item.itemId.price * item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
</div>
      </div>
    </div>
  );
}