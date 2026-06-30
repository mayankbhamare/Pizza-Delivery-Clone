import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data } = await api.get('/orders/myorders');
                setOrders(data);
                setLoading(false);
            } catch (error) {
                setLoading(false);
            }
        };
        fetchOrders();
        const interval = setInterval(fetchOrders, 5000);
        return () => clearInterval(interval);
    }, []);

    if (loading) return <div className="container" style={{ paddingTop: '100px' }}>Loading...</div>;

    const getStatusColor = (status) => {
        switch (status) {
            case 'Delivered': return '#21BA45';
            case 'Sent to Delivery': return '#EF4F5F';
            case 'In Kitchen': return '#F48C06';
            default: return '#666666'; // Use 6 digits for opacity appending
        }
    };

    return (
        <div className="container" style={{ paddingBottom: '50px', paddingTop: '100px' }}>
            <h1 style={{ marginBottom: '30px', fontSize: '2.5rem' }}>Past Orders</h1>
            <div style={{ display: 'grid', gap: '20px' }}>
                {orders.map(order => (
                    <div key={order._id} className="glass-panel animate-fade-in" style={{ padding: '0', overflow: 'hidden' }}>

                        <div style={{ padding: '20px', borderBottom: '1px solid #EEE', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#FAFAFA' }}>
                            <div>
                                <h3 style={{ fontSize: '1.2rem', margin: 0 }}>PizzaXpress {order.orderItems[0].name}</h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
                                    {new Date(order.createdAt).toDateString()} | {new Date(order.createdAt).toLocaleTimeString()}
                                </p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '0.9rem', color: '#999', textTransform: 'uppercase', marginBottom: '2px' }}>Total Amount</div>
                                <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>₹{order.totalPrice}</div>
                            </div>
                        </div>

                        <div style={{ padding: '20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '15px' }}>
                                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                    <div style={{
                                        width: '50px', height: '50px',
                                        borderRadius: '8px',
                                        background: '#FFF0F1',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '1.5rem', color: 'var(--primary)'
                                    }}>
                                        🍕
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: '500' }}>Custom Pizza</div>
                                        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                            {order.orderItems[0].options.base}, {order.orderItems[0].options.sauce}
                                        </div>
                                    </div>
                                </div>
                                <div style={{
                                    padding: '6px 12px',
                                    borderRadius: '6px',
                                    background: `${getStatusColor(order.status)}15`,
                                    color: getStatusColor(order.status),
                                    fontWeight: '600',
                                    fontSize: '0.9rem'
                                }}>
                                    {order.status}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {orders.length === 0 && (
                    <div className="glass-panel" style={{ padding: '50px', textAlign: 'center' }}>
                        <h3>No orders yet!</h3>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>Hungry? Order a pizza now.</p>
                        <a href="/dashboard" className="btn btn-primary">Browse Menu</a>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyOrders;
