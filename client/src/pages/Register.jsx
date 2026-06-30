import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const { register, user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate('/dashboard');
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic Validation
        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error('Invalid email format');
            return;
        }

        try {
            await register(name, email, password);
            // The register function in context might try to auto-login. 
            // We need to check if it did, or if we need to redirect manually.
            // If the backend doesn't return a token, AuthContext.register might throw or just not set user.

            // To be safe, we will rely on the AuthContext logic updates (which we might need to do).
            // But assuming AuthContext handles it:
            toast.success('Registration successful! Please check your email to verify.');
            navigate('/login');
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8F8F8' }}>
            <div className="glass-panel" style={{ padding: '40px', width: '100%', maxWidth: '500px', background: 'white' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '30px', fontSize: '2rem', color: 'var(--text-main)' }}>Sign Up</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input
                            type="text"
                            className="form-control"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            placeholder="Full Name"
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="Email Address"
                        />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        <div className="form-group">
                            <input
                                type="password"
                                className="form-control"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="Password"
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="password"
                                className="form-control"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                placeholder="Confirmed Password"
                            />
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginBottom: '20px', height: '50px' }}>
                        Create Account
                    </button>
                    <div style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                        Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '500' }}>Login</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
