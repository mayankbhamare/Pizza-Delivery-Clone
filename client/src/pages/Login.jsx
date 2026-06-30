import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            user.isAdmin ? navigate('/admin') : navigate('/dashboard');
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="glass-panel" style={{ padding: '40px', width: '100%', maxWidth: '400px', borderTop: '4px solid var(--primary)' }}>
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>PizzaXpress</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Login to continue ordering</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input
                            type="email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="Email Address"
                            style={{ height: '50px' }}
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Password"
                            style={{ height: '50px' }}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '50px', fontSize: '1.1rem' }}>
                        Send One-Time Password
                    </button>
                    {/* Note: UI text says OTP to mimic Zomato, but functionality is Password for now */}
                    <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '0.8rem', color: '#999' }}>
                        (Actually using Password for this demo)
                    </div>
                    <div style={{ textAlign: 'center', marginTop: '15px' }}>
                        <Link to="/forgot-password" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Forgot Password?</Link>
                    </div>
                </form>

                <div style={{ textAlign: 'center', marginTop: '30px' }}>
                    New here? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: '500' }}>Create an account</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
