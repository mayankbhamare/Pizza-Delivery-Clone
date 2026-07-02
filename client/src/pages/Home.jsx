import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaMapMarkerAlt, FaSearch, FaLeaf, FaShippingFast, FaPizzaSlice } from 'react-icons/fa';

const Home = () => {
    const { user } = useContext(AuthContext);

    return (
        <div style={{ paddingBottom: '80px' }}>
            {/* Hero Section */}
            <section style={{
                height: '600px',
                position: 'relative',
                overflow: 'hidden',
                backgroundImage: 'url("https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1600&q=80")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                textAlign: 'center'
            }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.3))' }}></div>

                <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px', padding: '0 20px' }}>
                    <h1 style={{ 
                        fontSize: '4.5rem', 
                        fontWeight: '900', 
                        marginBottom: '20px', 
                        letterSpacing: '-1.5px',
                        filter: 'drop-shadow(0px 4px 12px rgba(0, 0, 0, 0.45))'
                    }}>
                        <span style={{
                            background: 'linear-gradient(135deg, #FFFFFF 40%, #FFD066 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>
                            PizzaXpress
                        </span>
                    </h1>
                    <p style={{ fontSize: '1.8rem', marginBottom: '30px', fontWeight: '400' }}>
                        Craving the perfect pizza? Build it, order it, love it.
                    </p>
                    {/* Search / Action */}
                    <div className="hero-search-container">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ color: '#FF7E8B', fontSize: '1.2rem', display: 'flex', alignItems: 'center' }}><FaMapMarkerAlt /></div>
                            <div style={{ color: '#333', whiteSpace: 'nowrap', fontWeight: '500' }}>
                                Pizzaville, India
                            </div>
                        </div>
                        <div className="search-divider" style={{ width: '1px', height: '24px', background: '#eee' }}></div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, width: '100%' }}>
                            <div style={{ fontSize: '1.2rem', color: '#999', display: 'flex', alignItems: 'center' }}><FaSearch /></div>
                            <input
                                type="text"
                                placeholder="Order a custom pizza..."
                                style={{ border: 'none', outline: 'none', fontSize: '1rem', flex: 1, padding: '10px', width: '100%' }}
                            />
                        </div>
                        {user ? (
                            <Link to="/dashboard" className="btn btn-primary btn-mobile-full" style={{ height: '45px' }}>Order Now</Link>
                        ) : (
                            <Link to="/login" className="btn btn-primary btn-mobile-full" style={{ height: '45px' }}>Login</Link>
                        )}
                    </div>
                </div>
            </section>

            {/* Features Section - Clean Cards */}
            <section className="container">
                <h2 style={{ fontSize: '2rem', marginBottom: '10px', fontWeight: '500', color: '#333' }}>Why PizzaXpress?</h2>
                <div style={{ width: '60px', height: '2px', background: 'var(--primary)', marginBottom: '40px' }}></div>

                <div className="grid-cols-3">
                    <div className="glass-panel" style={{ overflow: 'hidden' }}>
                        <div style={{ height: '220px', backgroundImage: 'url("https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80")', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                        </div>
                        <div style={{ padding: '25px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                                <FaLeaf style={{ color: '#4CAF50' }} />
                                <h3 style={{ fontSize: '1.4rem', margin: 0 }}>Fresh & Organic</h3>
                            </div>
                            <p style={{ color: 'var(--text-muted)' }}>Farm-fresh veggies and ethically sourced meats for guilt-free indulgence.</p>
                        </div>
                    </div>

                    <div className="glass-panel" style={{ overflow: 'hidden' }}>
                        <div style={{ height: '220px', backgroundImage: 'url("https://images.unsplash.com/photo-1528150177508-7cc0c36cda5c?auto=format&fit=crop&w=800&q=80")', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                        </div>
                        <div style={{ padding: '25px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                                <FaShippingFast style={{ color: '#FF7E8B' }} />
                                <h3 style={{ fontSize: '1.4rem', margin: 0 }}>Spark Delivery</h3>
                            </div>
                            <p style={{ color: 'var(--text-muted)' }}>Hot and fresh at your doorstep in under 30 minutes, or it's on the house.</p>
                        </div>
                    </div>

                    <div className="glass-panel" style={{ overflow: 'hidden' }}>
                        <div style={{ height: '220px', backgroundImage: 'url("https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80")', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                        </div>
                        <div style={{ padding: '25px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                                <FaPizzaSlice style={{ color: '#F48C06' }} />
                                <h3 style={{ fontSize: '1.4rem', margin: 0 }}>Build Your Own</h3>
                            </div>
                            <p style={{ color: 'var(--text-muted)' }}>Thousands of combinations. You choose the base, sauce, and toppings.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
