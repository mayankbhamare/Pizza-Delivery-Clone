import React, { useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaPizzaSlice } from 'react-icons/fa';

const UserDashboard = () => {
    const { user } = useContext(AuthContext);
    const [step, setStep] = useState(1);
    const [inventory, setInventory] = useState([]);
    const [selections, setSelections] = useState({
        base: null,
        sauce: null,
        cheese: null,
        veggies: [],
        meat: [],
    });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchInventory = async () => {
            setLoading(true);
            try {
                const { data } = await api.get('/inventory');
                if (Array.isArray(data)) {
                    setInventory(data);
                } else {
                    console.error("Invalid inventory data:", data);
                    toast.error("Format error: Menu not loaded correctly");
                }
            } catch (error) {
                console.error("Dashboard Fetch Error:", error);
                if (error.response) {
                    toast.error(`Error: ${error.response.data.message || 'Failed to load menu'}`);
                } else if (error.request) {
                    toast.error('Network error. Is the server running?');
                } else {
                    toast.error('Error setting up request.');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchInventory();
    }, []);

    const filterByCategory = (category) => inventory.filter(item => item.category === category);

    const handleSelection = (category, item) => {
        if (category === 'veggies' || category === 'meat') {
            const currentItems = selections[category];
            if (currentItems.find(v => v._id === item._id)) {
                setSelections({ ...selections, [category]: currentItems.filter(v => v._id !== item._id) });
            } else {
                setSelections({ ...selections, [category]: [...currentItems, item] });
            }
        } else {
            setSelections({ ...selections, [category]: item });
        }
    };

    const calculateTotal = () => {
        let total = 0;
        if (selections.base) total += selections.base.price;
        if (selections.sauce) total += selections.sauce.price;
        if (selections.cheese) total += selections.cheese.price;
        selections.veggies.forEach(v => total += v.price);
        selections.meat.forEach(m => total += m.price);
        return total;
    };

    const finalizeOrder = async (razorpayResponse = null) => {
        const amount = calculateTotal();
        try {
            const orderItems = [{
                name: 'Custom Pizza',
                quantity: 1,
                price: amount,
                image: '',
                options: {
                    base: selections.base.name,
                    sauce: selections.sauce.name,
                    cheese: selections.cheese.name,
                    veggies: selections.veggies.map(v => v.name),
                    meat: selections.meat.map(m => m.name),
                }
            }];

            await api.post('/orders', {
                orderItems,
                shippingAddress: {
                    address: '123 Pizza St',
                    city: 'Pizzaville',
                    postalCode: '12345',
                    country: 'India'
                },
                paymentMethod: 'Razorpay (Demo)',
                totalPrice: amount,
                itemsPrice: amount,
                taxPrice: 0,
                shippingPrice: 0,
                paymentResult: razorpayResponse || { id: 'demo_' + Date.now(), status: 'success' }
            });

            toast.success('Order Placed Successfully! (Demo Mode)');
            navigate('/my-orders');
        } catch (err) {
            console.error(err);
            toast.error('Order placement failed');
        }
    };

    const handlePayment = async () => {
        const amount = calculateTotal();
        if (amount === 0) return;

        if (!user) {
            toast.error("Please login first to place an order");
            navigate('/login');
            return;
        }

        // CHECK IF KEY IS VALID
        const keyId = import.meta.env.VITE_RAZORPAY_KEY_ID;
        const isDemo = !keyId || keyId === 'YOUR_KEY_ID_HERE' || keyId === 'YOUR_TEST_KEY_ID';

        if (isDemo) {
            if (window.confirm("Razorpay keys not configured. Use Demo Mode? (Simulates successful payment)")) {
                finalizeOrder();
                return;
            }
        }

        try {
            const { data: orderData } = await api.post('/orders/razorpay', { amount });

            const options = {
                key: keyId,
                amount: orderData.amount,
                currency: orderData.currency,
                name: 'SliceDash Pizza',
                description: 'Custom Pizza Order',
                order_id: orderData.id,
                handler: function (response) {
                    finalizeOrder(response);
                },
                prefill: {
                    name: user.name,
                    email: user.email,
                    contact: '9999999999'
                },
                theme: {
                    color: '#EF4F5F'
                }
            };

            const rzp1 = new window.Razorpay(options);
            rzp1.open();

        } catch (error) {
            console.error(error);
            if (window.confirm("Razorpay initialization failed (Likely invalid keys). Proceed with Demo Mode?")) {
                finalizeOrder();
            } else {
                toast.error('Payment initiation failed');
            }
        }
    };

    // Render helper for clean white cards with red checkmarks
    const renderCard = (item, type) => {
        const isSelected = type === 'veggies' || type === 'meat'
            ? selections[type].find(v => v._id === item._id)
            : selections[type]?._id === item._id;

        return (
            <div
                key={item._id}
                className={`glass-panel animate-fade-in ${isSelected ? 'selected' : ''}`}
                style={{
                    padding: '0',
                    border: isSelected ? '2px solid var(--primary)' : '2px solid transparent',
                    boxShadow: isSelected ? '0 10px 20px rgba(239, 79, 95, 0.15)' : 'var(--shadow-sm)',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
                    transform: isSelected ? 'translateY(-5px)' : 'none',
                    opacity: item.stock < 1 ? 0.6 : 1,
                    pointerEvents: item.stock < 1 ? 'none' : 'auto'
                }}
                onClick={() => handleSelection(type, item)}
            >
                {/* Visual Placeholder / Image */}
                <div style={{ height: '160px', background: '#F8F8F8', overflow: 'hidden', position: 'relative' }}>
                    {item.image ? (
                        <div style={{
                            width: '100%',
                            height: '100%',
                            backgroundImage: `url("${item.image}")`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            transition: 'transform 0.5s ease'
                        }} />
                    ) : (
                        <div style={{
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'linear-gradient(135deg, #EF4F5F, #D93E4D)',
                            color: 'white'
                        }}>
                            <FaPizzaSlice style={{ fontSize: '3rem', marginBottom: '10px' }} />
                            <span style={{ fontSize: '0.7rem', fontWeight: 'bold' }}>GOURMET {type.toUpperCase()}</span>
                        </div>
                    )}
                    {item.stock < 1 && (
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
                            OUT OF STOCK
                        </div>
                    )}
                </div>

                {isSelected && (
                    <div style={{ position: 'absolute', top: '10px', right: '10px', color: 'white', fontSize: '1.2rem', background: 'var(--primary)', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.2)', zIndex: 10 }}>
                        <FaCheckCircle />
                    </div>
                )}

                <div style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <h3 style={{ fontSize: '1.2rem', margin: 0, color: isSelected ? 'var(--primary)' : 'inherit' }}>{item.name}</h3>
                        <span style={{ fontWeight: '800', color: 'var(--text-main)', background: '#F4F4F4', padding: '4px 10px', borderRadius: '6px', fontSize: '0.9rem' }}>₹{item.price}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {item.stock < item.threshold && item.stock > 0 && <span className="badge-low-stock" style={{ fontSize: '0.7rem' }}>Limited Stock</span>}
                        {item.stock === 0 && <span style={{ color: '#EF4F5F', fontSize: '0.7rem', fontWeight: 'bold' }}>SOLD OUT</span>}
                    </div>
                </div>
            </div>
        );
    };

    if (loading) return (
        <div style={{ padding: '100px', textAlign: 'center' }}>
            <div className="animate-pulse" style={{ fontSize: '1.5rem', color: 'var(--primary)' }}>Preparing the Kitchen...</div>
            <p style={{ color: '#999', marginTop: '10px' }}>Connecting to 127.0.0.1:5000</p>
        </div>
    );

    return (
        <div className="container" style={{ paddingTop: '100px', paddingBottom: '100px' }}>
            {/* Main Builder Area - Centered and Responsive */}
            <div style={{ maxWidth: '900px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
                    <div style={{ marginBottom: '40px' }}>
                        <h2 style={{ fontSize: '1.8rem', marginBottom: '15px' }}>Popular Varieties</h2>
                        <div
                            className="no-scrollbar"
                            style={{
                                display: 'flex',
                                gap: '20px',
                                overflowX: 'auto',
                                padding: '5px 20px 20px 5px',
                                margin: '0 -20px',
                                scrollbarWidth: 'none',
                                msOverflowStyle: 'none'
                            }}
                        >
                            {[
                                { name: 'Pepperoni Classic', price: 450, image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400' },
                                { name: 'Farmhouse Special', price: 380, image: 'https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?w=400' },
                                { name: 'Paneer Tikka', price: 420, image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400' },
                                { name: 'BBQ Chicken', price: 480, image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400' },
                                { name: 'Veggie Paradise', price: 350, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400' },
                                { name: 'Double Cheese Margherita', price: 390, image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=400' },
                                { name: 'Spicy Mexican', price: 460, image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=400' },
                                { name: 'Classic Meatball', price: 495, image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=400' },
                                { name: 'Pesto Veggie', price: 410, image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=400' },
                                { name: 'Buffalo Chicken', price: 470, image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400' }
                            ].map((pizza, idx) => (
                                <div key={idx} className="glass-panel" style={{ minWidth: '240px', flex: '0 0 auto', padding: '0', overflow: 'hidden', boxShadow: 'var(--shadow-md)' }}>
                                    <div style={{ height: '120px', backgroundImage: `url("${pizza.image}")`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                                    <div style={{ padding: '12px' }}>
                                        <h4 style={{ margin: '0 0 4px 0', fontSize: '1rem' }}>{pizza.name}</h4>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontWeight: '600', color: 'var(--primary)' }}>₹{pizza.price}</span>
                                            <button
                                                className="btn btn-primary"
                                                style={{ padding: '4px 10px', fontSize: '0.8rem' }}
                                                onClick={() => toast.info("Customizing flow starting for " + pizza.name)}
                                            >
                                                Add
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{ marginBottom: '30px' }}>
                        <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Customize Your Pizza</h1>
                        <p style={{ color: 'var(--text-muted)' }}>Choose your favorite ingredients for a perfect slice.</p>

                        {/* Step Indicators */}
                        <div style={{ display: 'flex', gap: '8px', marginTop: '30px', background: 'white', padding: '10px', borderRadius: '12px', boxShadow: 'var(--shadow-sm)', overflowX: 'auto', scrollbarWidth: 'none' }}>
                            {['Base', 'Sauce', 'Cheese', 'Veggies', 'Meat', 'Checkout'].map((label, idx) => {
                                const stepNum = idx + 1;
                                const isAccessible = stepNum <= step + 1 || (stepNum === 1) ||
                                    (stepNum === 2 && selections.base) ||
                                    (stepNum === 3 && selections.sauce) ||
                                    (stepNum === 4 && selections.cheese) ||
                                    (stepNum === 5 && selections.veggies.length > 0) ||
                                    (stepNum === 6 && selections.meat.length > 0);

                                return (
                                    <div
                                        key={idx}
                                        onClick={() => isAccessible && setStep(stepNum)}
                                        style={{
                                            padding: '10px 18px',
                                            borderRadius: '10px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '10px',
                                            background: step === stepNum ? 'rgba(239, 79, 95, 0.1)' : 'transparent',
                                            color: step === stepNum ? 'var(--primary)' : isAccessible ? '#2D2D2D' : 'var(--text-light)',
                                            fontWeight: step === stepNum ? '600' : '500',
                                            cursor: isAccessible ? 'pointer' : 'default',
                                            transition: 'all 0.3s ease',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        <div style={{
                                            width: '26px',
                                            height: '26px',
                                            borderRadius: '50%',
                                            background: step === stepNum ? 'var(--primary)' : isAccessible && stepNum < step ? '#21BA45' : '#EEE',
                                            color: 'white',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '0.85rem',
                                            fontWeight: '800'
                                        }}>
                                            {isAccessible && stepNum < step ? <FaCheckCircle /> : stepNum}
                                        </div>
                                        {label}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="animate-fade-in" style={{ animationDuration: '0.4s' }}>
                        {step === 6 ? (
                            <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', borderTop: '4px solid #21BA45' }}>
                                <div style={{ fontSize: '4rem', color: '#21BA45', marginBottom: '20px' }} className="animate-fade-in">
                                    <FaCheckCircle />
                                </div>
                                <h1 style={{ marginBottom: '15px' }}>Almost Done!</h1>
                                <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginBottom: '40px' }}>Review your custom creation before placing the order.</p>

                                <div className="summary-grid">
                                    {[
                                        { label: 'Foundation', value: selections.base?.name, icon: '🍕' },
                                        { label: 'Sauce', value: selections.sauce?.name, icon: '🍅' },
                                        { label: 'Cheese', value: selections.cheese?.name, icon: '🧀' },
                                        { label: 'Veggies', value: selections.veggies.map(v => v.name).join(', ') || 'None', icon: '🥗' },
                                        { label: 'Meats', value: selections.meat.map(m => m.name).join(', ') || 'None', icon: '🍖' }
                                    ].map((row, i) => (
                                        <div key={i} style={{ padding: '15px', background: '#F9F9F9', borderRadius: '12px', border: '1px solid #EEE' }}>
                                            <div style={{ fontSize: '0.8rem', color: '#999', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '5px' }}>{row.label}</div>
                                            <div style={{ fontSize: '1rem', fontWeight: '700' }}>{row.icon} {row.value}</div>
                                        </div>
                                    ))}
                                    <div style={{ gridColumn: '1 / -1', padding: '20px', background: 'rgba(239, 79, 95, 0.05)', borderRadius: '12px', border: '1px dashed var(--primary)', textAlign: 'center' }}>
                                        <div style={{ fontSize: '1rem' }}>Total Amount to Pay</div>
                                        <div style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--primary)' }}>₹{calculateTotal()}</div>
                                    </div>
                                </div>

                                <button
                                    className="btn btn-primary btn-mobile-full"
                                    style={{ width: '100%', height: '70px', fontSize: '1.4rem', borderRadius: '15px', boxShadow: '0 10px 30px rgba(239, 79, 95, 0.4)' }}
                                    onClick={handlePayment}
                                >
                                    Confirm & Pay Now
                                </button>
                                <p style={{ marginTop: '15px', color: '#999', fontSize: '0.9rem' }}>Secure payment via Razorpay</p>
                            </div>
                        ) : (
                            <div className="grid-cols-2">
                                {step === 1 && filterByCategory('base').map(item => renderCard(item, 'base'))}
                                {step === 2 && filterByCategory('sauce').map(item => renderCard(item, 'sauce'))}
                                {step === 3 && filterByCategory('cheese').map(item => renderCard(item, 'cheese'))}
                                {step === 4 && filterByCategory('veggies').map(item => renderCard(item, 'veggies'))}
                                {step === 5 && filterByCategory('meat').map(item => renderCard(item, 'meat'))}

                                {((step === 1 && filterByCategory('base').length === 0) ||
                                    (step === 2 && filterByCategory('sauce').length === 0) ||
                                    (step === 3 && filterByCategory('cheese').length === 0) ||
                                    (step === 4 && filterByCategory('veggies').length === 0) ||
                                    (step === 5 && filterByCategory('meat').length === 0)) && (
                                        <div style={{ gridColumn: '1 / -1', padding: '100px', textAlign: 'center', background: '#F9F9F9', borderRadius: '12px' }}>
                                            <FaPizzaSlice style={{ fontSize: '3rem', color: '#EEE', marginBottom: '20px' }} />
                                            <h3>No items available in this category</h3>
                                            <p style={{ color: 'var(--text-muted)' }}>Fresh ingredients arriving soon!</p>
                                        </div>
                                    )}
                            </div>
                        )}

                        <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                            {step > 1 && (
                                <button className="btn btn-secondary btn-mobile-full" style={{ padding: '12px 30px', borderRadius: '12px' }} onClick={() => setStep(step - 1)}>
                                    Go Back
                                </button>
                            )}
                            {step < 6 && (
                                <button
                                    className="btn btn-primary btn-mobile-full"
                                    style={{ marginLeft: 'auto', padding: '12px 40px', borderRadius: '12px' }}
                                    onClick={() => setStep(step + 1)}
                                    disabled={
                                        (step === 1 && !selections.base) ||
                                        (step === 2 && !selections.sauce) ||
                                        (step === 3 && !selections.cheese)
                                    }
                                >
                                    {step === 5 ? 'Review Order' : 'Continue'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
};

export default UserDashboard;
