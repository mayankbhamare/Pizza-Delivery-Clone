import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [verificationUrl, setVerificationUrl] = useState('');

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
            const data = await register(name, email, password);
            if (data && data.verificationUrl) {
                setVerificationUrl(data.verificationUrl);
                toast.warning('Email service unavailable. Using Demo Fallback.');
            } else {
                toast.success('Registration successful! Please check your email to verify.');
                navigate('/login');
            }
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

                    {verificationUrl && (
                        <div style={{
                            marginTop: '15px',
                            padding: '15px',
                            backgroundColor: 'rgba(239, 79, 95, 0.1)',
                            border: '1px solid var(--primary)',
                            borderRadius: '8px',
                            fontSize: '0.9rem',
                            textAlign: 'center',
                            marginBottom: '20px'
                        }}>
                            <p style={{ color: 'var(--text)', marginBottom: '5px', fontWeight: '500' }}>
                                ⚠️ Demo Mode Fallback
                            </p>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '10px' }}>
                                Render's free tier blocks email SMTP or Brevo limits occurred. You can use the link below to verify your email immediately:
                            </p>
                            <a href={verificationUrl} style={{ color: 'var(--primary)', fontWeight: 'bold', wordBreak: 'break-all' }}>
                                Click here to Verify Email
                            </a>
                        </div>
                    )}

                    <div style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                        Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '500' }}>Login</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
