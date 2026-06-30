import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [resetUrl, setResetUrl] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setResetUrl('');
        try {
            const { data } = await api.post('/auth/forgotpassword', { email });
            if (data.resetUrl) {
                setResetUrl(data.resetUrl);
                toast.warning('Email service unavailable. Using Demo Fallback.');
            } else {
                toast.success('Email sent! check your inbox for reset link');
            }
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

                    {resetUrl && (
                        <div style={{
                            marginTop: '25px',
                            padding: '15px',
                            backgroundColor: 'rgba(239, 79, 95, 0.1)',
                            border: '1px solid var(--primary)',
                            borderRadius: '8px',
                            fontSize: '0.9rem',
                            textAlign: 'center'
                        }}>
                            <p style={{ color: 'var(--text)', marginBottom: '5px', fontWeight: '500' }}>
                                ⚠️ Demo Mode Fallback
                            </p>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '10px' }}>
                                Render's free tier blocks email SMTP. You can use the link below to reset your password:
                            </p>
                            <a href={resetUrl} style={{ color: 'var(--primary)', fontWeight: 'bold', wordBreak: 'break-all' }}>
                                Reset Password Link
                            </a>
                        </div>
                    )}

                    <div style={{ textAlign: 'center', marginTop: '20px' }}>
                        <Link to="/login" style={{ color: 'var(--primary)' }}>Back to Login</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
