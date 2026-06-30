import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';

const VerifyEmail = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('verifying'); // verifying, success, error
    const [message, setMessage] = useState('');

    useEffect(() => {
        const verify = async () => {
            try {
                // Backend route is /api/auth/verify/:token
                // Correcting the likely path issue if it was wrong
                await api.get(`/auth/verify/${token}`);
                setMessage('Email verified successfully! Redirecting to login...');
                setStatus('success');
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            } catch (error) {
                console.error(error);
                setMessage(error.response?.data?.message || 'Verification failed. Token may be invalid or expired.');
                setStatus('error');
            }
        };

        if (token) {
            verify();
        }
    }, [token, navigate]);

    return (
        <div style={{
            minHeight: '80vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <div className="glass-panel animate-fade-in" style={{ padding: '50px', maxWidth: '450px', width: '100%', textAlign: 'center' }}>
                {status === 'verifying' && <h2>Verifying your email...</h2>}
                {status === 'success' && (
                    <>
                        <h2 style={{ color: '#00ff88', marginBottom: '15px' }}>Email Verified!</h2>
                        <p style={{ marginBottom: '30px', color: 'var(--text-muted)' }}>{message}</p>
                        {/* The link is removed as per the instruction's implied change for redirection */}
                    </>
                )}
                {status === 'error' && (
                    <>
                        <h2 style={{ color: 'var(--accent)', marginBottom: '15px' }}>Verification Failed</h2>
                        <p style={{ marginBottom: '30px', color: 'var(--text-muted)' }}>The link may be invalid or expired.</p>
                        <Link to="/register" className="btn btn-secondary">Register Again</Link>
                    </>
                )}
            </div>
        </div>
    );
};

export default VerifyEmail;
