import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { toast } from 'react-toastify';
import { FaBoxOpen, FaClipboardList, FaCheck, FaTruck, FaFire } from 'react-icons/fa';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('orders'); // orders | inventory
    const [orders, setOrders] = useState([]);
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 10000);
        return () => clearInterval(interval);
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'orders') {
                const { data } = await api.get('/orders');
                setOrders(data);
            } else {
                const { data } = await api.get('/inventory');
                setInventory(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const updateOrderStatus = async (id, status) => {
        try {
            await api.put(`/orders/${id}/status`, { status });
            toast.success(`Order updated to ${status}`);
            fetchData();
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const updateStock = async (item, newStock) => {
        try {
            await api.put(`/inventory/${item._id}`, {
                name: item.name,
                category: item.category,
                price: item.price,
                stock: newStock,
                threshold: item.threshold
            });
            toast.success('Stock updated');
            fetchData();
        } catch (error) {
            toast.error('Failed to update stock');
        }
    };

    const getStatusBadge = (status) => {
        const colors = {
            'Received': '#666',
            'In Kitchen': '#F48C06',
            'Sent to Delivery': '#EF4F5F',
            'Delivered': '#21BA45'
        };
        return (
            <span style={{
                padding: '4px 10px',
                borderRadius: '6px',
                background: `${colors[status] || '#666'}20`,
                border: `1px solid ${colors[status] || '#666'}40`,
                color: colors[status] || '#666',
                fontSize: '0.8rem',
                fontWeight: '600'
            }}>
                {status}
            </span>
        );
    };

    return (
        <div className="container" style={{ paddingBottom: '50px', paddingTop: '100px' }}>
            <div className="flex-between" style={{ marginBottom: '30px', alignItems: 'center' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Admin Portal</h1>
                <div style={{ background: '#FFF', padding: '5px', borderRadius: '30px', boxShadow: 'var(--shadow-sm)', border: '1px solid #EEE' }}>
                    <button
                        onClick={() => setActiveTab('orders')}
                        className="btn"
                        style={{
                            background: activeTab === 'orders' ? 'var(--primary)' : 'transparent',
                            color: activeTab === 'orders' ? 'white' : 'var(--text-muted)',
                            borderRadius: '25px',
                            padding: '8px 20px',
                            fontWeight: '500'
                        }}
                    >
                        Orders
                    </button>
                    <button
                        onClick={() => setActiveTab('inventory')}
                        className="btn"
                        style={{
                            background: activeTab === 'inventory' ? 'var(--primary)' : 'transparent',
                            color: activeTab === 'inventory' ? 'white' : 'var(--text-muted)',
                            borderRadius: '25px',
                            padding: '8px 20px',
                            fontWeight: '500'
                        }}
                    >
                        Inventory
                    </button>
                </div>
            </div>

            {activeTab === 'orders' && (
                <div style={{ display: 'grid', gap: '20px' }}>
                    {orders.map(order => (
                        <div key={order._id} className="glass-panel animate-fade-in" style={{ padding: '20px', borderLeft: `4px solid var(--primary)` }}>
                            <div className="flex-between">
                                <div>
                                    <h3 style={{ fontSize: '1.2rem', margin: 0 }}>
                                        #{order._id.substring(0, 6)} <span style={{ fontWeight: '400', fontSize: '1rem', color: '#888' }}>• {order.user?.name || 'Unknown'}</span>
                                    </h3>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                                        {new Date(order.createdAt).toLocaleString()}
                                    </p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontWeight: '700', fontSize: '1.1rem', marginBottom: '5px' }}>₹{order.totalPrice}</div>
                                    {getStatusBadge(order.status)}
                                </div>
                            </div>

                            <div style={{ margin: '15px 0', padding: '15px', background: '#F9F9F9', borderRadius: '8px', fontSize: '0.95rem' }}>
                                {order.orderItems.map((item, i) => (
                                    <div key={i} style={{ marginBottom: '4px' }}>
                                        <strong>{item.name}</strong> • {item.options.base}, {item.options.sauce}, {item.options.veggies.length > 0 ? item.options.veggies.join(', ') : 'No Veggies'}
                                    </div>
                                ))}
                            </div>

                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                {order.status === 'Received' && (
                                    <button className="btn btn-secondary" onClick={() => updateOrderStatus(order._id, 'In Kitchen')}>
                                        Move to Kitchen
                                    </button>
                                )}
                                {order.status === 'In Kitchen' && (
                                    <button className="btn btn-secondary" onClick={() => updateOrderStatus(order._id, 'Sent to Delivery')}>
                                        Dispatch
                                    </button>
                                )}
                                {order.status === 'Sent to Delivery' && (
                                    <button className="btn btn-secondary" onClick={() => updateOrderStatus(order._id, 'Delivered')} style={{ color: 'green', borderColor: 'green' }}>
                                        Mark Delivered
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                    {orders.length === 0 && <div style={{ textAlign: 'center', padding: '50px', color: 'var(--text-muted)' }}>No active orders</div>}
                </div>
            )}

            {activeTab === 'inventory' && (
                <div className="glass-panel animate-fade-in table-responsive" style={{ padding: '0', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                        <thead style={{ background: '#F5F5F5' }}>
                            <tr>
                                <th style={{ padding: '15px', color: '#555', fontWeight: '600' }}>Item</th>
                                <th style={{ padding: '15px', color: '#555', fontWeight: '600' }}>Category</th>
                                <th style={{ padding: '15px', color: '#555', fontWeight: '600' }}>Price</th>
                                <th style={{ padding: '15px', color: '#555', fontWeight: '600' }}>Stock</th>
                                <th style={{ padding: '15px', color: '#555', fontWeight: '600' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {inventory.map(item => (
                                <tr key={item._id} style={{ borderBottom: '1px solid #EEE' }}>
                                    <td style={{ padding: '15px', fontWeight: '500' }}>{item.name}</td>
                                    <td style={{ padding: '15px', textTransform: 'capitalize' }}>{item.category}</td>
                                    <td style={{ padding: '15px' }}>₹{item.price}</td>
                                    <td style={{ padding: '15px' }}>
                                        {item.stock < item.threshold
                                            ? <span style={{ color: 'red', fontWeight: 'bold' }}>{item.stock}</span>
                                            : item.stock}
                                    </td>
                                    <td style={{ padding: '15px' }}>
                                        <div style={{ display: 'flex', gap: '5px' }}>
                                            <button className="btn btn-secondary" style={{ padding: '2px 10px' }} onClick={() => updateStock(item, item.stock - 1)}>-</button>
                                            <button className="btn btn-secondary" style={{ padding: '2px 10px' }} onClick={() => updateStock(item, item.stock + 1)}>+</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
