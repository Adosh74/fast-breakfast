import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axios';
import { toast } from 'react-toastify';
import { format, parseISO } from 'date-fns';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

export default function Receipts() {
  const [receipts, setReceipts] = useState([]);
  const [selectedDay, setSelectedDay] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [expandedUsers, setExpandedUsers] = useState(new Set());
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get('/api/users/currentuser');
        if (!response.data.currentUser) {
          navigate('/');
        }
        setUser(response.data.currentUser);
      } catch (err) {
        console.error(err);
        
        navigate('/signin');
      }
    };

    fetchUser();
  }, [navigate]);

  useEffect(() => {
    const fetchReceipts = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/api/receipts?day=${selectedDay}`);
        setReceipts(response.data);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load receipts');
      } finally {
        setLoading(false);
      }
    };

    fetchReceipts();
    // if (user?.role === 'admin') {
    // }
  }, [selectedDay, user]);

  const toggleUserExpansion = (userId) => {
    const newExpanded = new Set(expandedUsers);
    newExpanded.has(userId) ? newExpanded.delete(userId) : newExpanded.add(userId);
    setExpandedUsers(newExpanded);
  };

  const getUserItems = (receipt, userId) => {
    return receipt.ordersId
      ?.filter(order => order.userId?.id === userId)
      ?.flatMap(order => order.items)
      ?.reduce((acc, item) => {
        const existing = acc.find(i => i.itemId.id === item.itemId.id);
        existing ? existing.quantity += item.quantity : acc.push({ ...item });
        return acc;
      }, []) || [];
  };

  const getOrderCount = (receipt) => receipt.ordersId?.length || 0;
  const getUserName = (userTotal) => userTotal.userId?.name || 'Unknown User';

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Receipts Management</h1>
          <input
            type="date"
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
            className="bg-white border rounded-lg px-4 py-2"
          />
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : receipts.length === 0 ? (
          <div className="text-center text-gray-500 text-xl py-8">
            No receipts found for {selectedDay}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {receipts.map((receipt) => (
              <div key={receipt.id} className="bg-white rounded-xl shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-semibold">{receipt.name}</h2>
                    <p className="text-gray-600">{receipt.title}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      {format(parseISO(receipt.day), 'MMM dd, yyyy')} • {getOrderCount(receipt)} orders
                    </p>
                  </div>
                  <span className="text-lg font-bold text-green-600">
                    ${receipt.total}
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 font-medium border-b pb-2">
                    <span>User</span>
                    <span className="text-right">Amount</span>
                  </div>
                  
                  {receipt.userTotals.map((userTotal) => {
                    const userId = userTotal.userId?.id;
                    const isExpanded = expandedUsers.has(userId);
                    const userItems = getUserItems(receipt, userId);

                    return (
                      <div key={userTotal._id}>
                        <div 
                          className="grid grid-cols-2 gap-4 border-b pb-2 cursor-pointer hover:bg-gray-50"
                          onClick={() => toggleUserExpansion(userId)}
                        >
                          <div className="flex items-center gap-2">
                            {isExpanded ? (
                              <ChevronUpIcon className="h-4 w-4" />
                            ) : (
                              <ChevronDownIcon className="h-4 w-4" />
                            )}
                            <div>
                              <p className="font-medium">{getUserName(userTotal)}</p>
                              {userTotal.userId?.email && (
                                <p className="text-sm text-gray-500">{userTotal.userId.email}</p>
                              )}
                            </div>
                          </div>
                          <p className="text-right font-medium">
                            ${userTotal.total}
                          </p>
                        </div>

                        {isExpanded && userItems.length > 0 && (
                          <div className="ml-8 mt-2 space-y-2">
                            {userItems.map((item, index) => (
                              <div 
                                key={index} 
                                className="flex justify-between items-center text-sm"
                              >
                                <div className="flex items-center gap-3">
                                  <img
                                    src={item.itemId.avatar}
                                    alt={item.itemId.name}
                                    className="w-10 h-10 object-cover rounded"
                                  />
                                  <div>
                                    <p>{item.itemId.name}</p>
                                    <p className="text-gray-500 text-xs">
                                      {item.quantity} × ${item.itemId.price}
                                    </p>
                                  </div>
                                </div>
                                <span className="font-medium">
                                  ${(item.itemId.price * item.quantity).toFixed(2)}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}

                  <div className="grid grid-cols-2 gap-4 pt-4 font-bold border-t">
                    <span>Total</span>
                    <span className="text-right">${receipt.total}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}