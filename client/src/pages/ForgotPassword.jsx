import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/auth/forgotpassword', { email });
            toast.success('Email sent! check your inbox/console for reset link');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to send email');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="glass-panel" style={{ padding: '40px', maxWidth: '400px', width: '100%' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Forgot Password</h2>
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '30px' }}>
                    Enter your email address and we'll send you a link to reset your password.
                </p>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input
                            type="email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="Enter your email"
                            style={{ height: '50px' }}
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%', height: '50px' }}
                        disabled={loading}
                    >
                        {loading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                    <div style={{ textAlign: 'center', marginTop: '20px' }}>
                        <Link to="/login" style={{ color: 'var(--primary)' }}>Back to Login</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
