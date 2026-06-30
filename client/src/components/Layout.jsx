import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaPizzaSlice, FaUser, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';

const Header = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Only transparent on Home page
    const isHome = location.pathname === '/';

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Auto-close mobile menu on page navigate
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location.pathname]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Header styling based on scroll and mobile menu toggle state
    const headerClass = (isHome && !scrolled) 
        ? (mobileMenuOpen ? 'header scrolled open-mobile' : 'header') 
        : 'header scrolled';
        
    const linkColor = (isHome && !scrolled && !mobileMenuOpen) ? 'white' : 'var(--text-main)';
    
    const btnSecondaryStyle = (isHome && !scrolled && !mobileMenuOpen)
        ? { background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white' }
        : { background: 'white', border: '1px solid #EEE', color: 'var(--text-main)' };

    return (
        <header className={headerClass} style={{ transition: 'all 0.3s ease' }}>
            <div className="container nav" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
                <Link to="/" className="logo" style={{ fontSize: '1.8rem', fontWeight: '800', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '8px', color: linkColor }}>
                    PizzaXpress
                </Link>

                <button 
                    className="menu-toggle" 
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label="Toggle menu"
                    style={{ color: linkColor }}
                >
                    {mobileMenuOpen ? <FaTimes /> : <FaBars />}
                </button>

                <nav className={`nav-links ${mobileMenuOpen ? 'open' : ''}`}>
                    <Link to="/" className="nav-link" style={{ color: linkColor }}>Home</Link>
                    {user ? (
                        <>
                            {user.role === 'admin' || user.isAdmin ? (
                                <Link to="/admin" className="nav-link" style={{ color: linkColor }}>Admin</Link>
                            ) : (
                                <Link to="/dashboard" className="nav-link" style={{ color: linkColor }}>Order</Link>
                            )}
                            <Link to="/my-orders" className="nav-link" style={{ color: linkColor }}>History</Link>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span style={{ color: linkColor, fontWeight: '500' }}>{user.name}</span>
                                <button onClick={handleLogout} className="btn" style={{ padding: '8px 12px', fontSize: '0.9rem', ...btnSecondaryStyle }}>
                                    <FaSignOutAlt />
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="nav-link" style={{ color: linkColor }}>Login</Link>
                            <Link to="/register" className="nav-link" style={{ color: linkColor }}>Sign Up</Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
};

const Layout = ({ children }) => {
    return (
        <>
            <Header />
            <main style={{ minHeight: '80vh', paddingTop: '0px' }}>
                {children}
            </main>
            <footer style={{
                background: '#F8F8F8',
                padding: '60px 0',
                marginTop: 'auto',
                borderTop: '1px solid #EAEAEA'
            }}>
                <div className="container active footer-grid">
                    <div>
                        <h4 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '20px', fontStyle: 'italic' }}>PizzaXpress</h4>
                        <p style={{ color: 'var(--text-muted)' }}>Delivering happiness, one slice at a time.</p>
                    </div>
                    <div>
                        <h5 style={{ textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.9rem', marginBottom: '20px' }}>Company</h5>
                        <ul style={{ listStyle: 'none', color: 'var(--text-muted)', lineHeight: '2' }}>
                            <li>Who We Are</li>
                            <li>Blog</li>
                            <li>Careers</li>
                        </ul>
                    </div>
                    <div>
                        <h5 style={{ textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.9rem', marginBottom: '20px' }}>Learn More</h5>
                        <ul style={{ listStyle: 'none', color: 'var(--text-muted)', lineHeight: '2' }}>
                            <li>Privacy</li>
                            <li>Security</li>
                            <li>Terms</li>
                        </ul>
                    </div>
                    <div>
                        <h5 style={{ textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.9rem', marginBottom: '20px' }}>Social Links</h5>
                        <p style={{ color: 'var(--text-muted)' }}>Instagram, Twitter, Facebook</p>
                    </div>
                </div>
            </footer>
        </>
    );
};

export default Layout;

