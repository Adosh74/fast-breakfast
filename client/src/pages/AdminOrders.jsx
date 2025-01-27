import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axios';
import { toast } from 'react-toastify';
import { format, parseISO } from 'date-fns';

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [selectedDay, setSelectedDay] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [processingReceipt, setProcessingReceipt] = useState(false);
    const [receiptName, setReceiptName] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axiosInstance.get('/api/users/currentuser');
                if (!response.data.currentUser || response.data.currentUser.role !== 'admin') {
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
        const fetchOrders = async () => {
            try {
                setLoading(true);
                const response = await axiosInstance.get(`/api/orders/day/${selectedDay}`);
                setOrders(response.data);
            } catch (err) {
                console.error(err);
                toast.error('Failed to load orders');
            } finally {
                setLoading(false);
            }
        };

        if (user?.role === 'admin') {
            fetchOrders();
        }
    }, [selectedDay, user]);

    const calculateTotal = (items) => {
        return items.reduce((sum, item) => sum + (item.itemId.price * item.quantity), 0);
    };

    const calculateDayTotal = () => {
        return orders.reduce((total, order) => total + calculateTotal(order.items), 0);
    };

    const calculateItemTotals = () => {
        const itemMap = {};
        
        orders.forEach(order => {
            order.items.forEach(item => {
                const itemId = item.itemId.id;
                if (!itemMap[itemId]) {
                    itemMap[itemId] = {
                        id: itemId,
                        name: item.itemId.name,
                        totalQuantity: 0,
                        totalPrice: 0,
                        unitPrice: item.itemId.price
                    };
                }
                itemMap[itemId].totalQuantity += item.quantity;
                itemMap[itemId].totalPrice += item.itemId.price * item.quantity;
            });
        });

        return Object.values(itemMap);
    };

    const formatPrice = (price) => {
        return price % 1 === 0 ? `$${price}` : `$${price.toFixed(2)}`;
    };

    const handleProcessReceipt = async () => {
        if (!receiptName.trim()) {
            toast.error('Please enter a receipt name');
            return;
        }
        
        try {
            setProcessingReceipt(true);
            const response = await axiosInstance.post('/api/receipts/', {
                name: receiptName.trim()
            });
            
            toast.success(`Receipt created: ${response.data.name}`);
            setReceiptName('');
            const ordersRes = await axiosInstance.get(`/api/orders/day/${selectedDay}`);
            setOrders(ordersRes.data);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to process receipt');
        } finally {
            setProcessingReceipt(false);
        }
    };

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
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Admin Orders Dashboard</h1>
                    <button
                        onClick={() => navigate('/admin/receipts')}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    >
                        📑 View Receipts
                    </button>
                    <input
                        type="date"
                        value={selectedDay}
                        onChange={(e) => setSelectedDay(e.target.value)}
                        className="bg-white border rounded-lg px-4 py-2"
                    />
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                    <input
                        type="text"
                        placeholder="Receipt Name"
                        value={receiptName}
                        onChange={(e) => setReceiptName(e.target.value)}
                        className="bg-white border rounded-lg px-4 py-2 flex-1"
                    />
                    
                    <button
                        onClick={handleProcessReceipt}
                        disabled={processingReceipt || orders.length === 0 || !receiptName.trim()}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                            processingReceipt || orders.length === 0 || !receiptName.trim()
                                ? 'bg-gray-300 cursor-not-allowed'
                                : 'bg-green-500 hover:bg-green-600 text-white'
                        }`}
                    >
                        {processingReceipt ? (
                            <span className="flex items-center gap-2">
                                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                                Processing...
                            </span>
                        ) : (
                            '📄 Create Receipt'
                        )}
                    </button>
                </div>
                    {/* add space */}
                <div className="h-4"></div>
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-ct-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="text-center text-gray-500 text-xl py-8">
                        No orders found for {selectedDay}
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div key={order.id} className="bg-white rounded-xl shadow-md p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h2 className="text-xl font-semibold">{order.userId.name}</h2>
                                        <p className="text-gray-600">{order.userId.email}</p>
                                        <p className="text-sm text-gray-500">
                                            {format(parseISO(order.day), 'MMM dd, yyyy')}
                                        </p>
                                    </div>
                                    <span className="text-lg font-bold text-green-600">
                                        {formatPrice(calculateTotal(order.items))}
                                    </span>
                                </div>
                                
                                <div className="space-y-2">
                                    {order.items.map((item) => (
                                        <div key={item._id} className="flex justify-between items-center border-b pb-2">
                                            <div className="flex items-center gap-4">
                                                <img
                                                    src={item.itemId.avatar}
                                                    alt={item.itemId.name}
                                                    className="w-16 h-16 object-cover rounded-lg"
                                                />
                                                <div>
                                                    <h3 className="font-medium">{item.itemId.name}</h3>
                                                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                                </div>
                                            </div>
                                            <span className="font-medium">
                                                {formatPrice(item.itemId.price * item.quantity)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}

                        {/* Item Totals Section */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h3 className="text-xl font-bold mb-4">Item Totals</h3>
                            {calculateItemTotals().map(item => (
                                <div key={item.id} className="flex justify-between items-center border-b pb-2 mb-2">
                                    <div>
                                        <h4 className="font-medium">{item.name}</h4>
                                        <p className="text-sm text-gray-500">
                                            Unit Price: {formatPrice(item.unitPrice)}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium">
                                            Total Quantity: {item.totalQuantity}
                                        </p>
                                        <p className="font-medium">
                                            Total Price: {formatPrice(item.totalPrice)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Day Total Section */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <div className="flex justify-between items-center">
                                <h3 className="text-xl font-bold">Day Total</h3>
                                <span className="text-2xl font-bold text-green-600">
                                    {formatPrice(calculateDayTotal())}
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}