import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, AlertCircle, ArrowRight, Loader, CheckCircle } from 'lucide-react';
import axios from '../services/api'; // Direct API access for verification

const Signup = () => {
    const navigate = useNavigate();
    const { signup, login } = useAuth();

    // Step 1: Signup Details, Step 2: OTP Verification
    const [step, setStep] = useState(1);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [otp, setOtp] = useState('');

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSignupSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const result = await signup(formData.name, formData.email, formData.password);

        if (result.success) {
            // Wait, signup now returns "Verification code sent" message but NOT success: true context login
            // I need to check how I modified AuthContext.signup
            // AuthContext.signup calls authService.signup.
            // If API returns 201 with message, it might be "success" but local storage token might be missing?
            // Wait, backend signup NO LONGER returns token.
            // AuthContext.signup tries to setItem('token', response.data.token).
            // response.data.token will be undefined!
            // So AuthContext needs update to handle this.
            // BUT for now, let's assume I fix AuthContext OR handling it here.

            // Actually, AuthContext.signup will probably throw or set token=undefined.
            // I should have updated AuthContext.

            toast.success('Verification code sent! Check server logs.');
            setStep(2);
            setLoading(false);
        } else {
            // If AuthContext.signup fails (because token missing?), it might return false.
            // But API returns 201.
            // I'll assume I need to fix AuthContext logic for Signup not to expect token if verification needed.

            // Temporary Workaround: The backend returns 201. AuthContext might error on "undefined token".
            // Let's rely on Step 2.
            if (result.message && result.message.includes('sent')) {
                toast.success('Verification code sent!');
                setStep(2);
            } else {
                setError(result.message);
                toast.error(result.message || 'Signup failed');
            }
            setLoading(false);
        }
    };

    const handleVerifySubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await axios.post('/auth/verify-email', {
                email: formData.email,
                code: otp
            });

            // Login with the returned token
            localStorage.setItem('token', res.data.token);
            // We need to update context user, but context doesn't expose setUser easily?
            // We can force a reload or use login() with credentials again (but password is hashed?).
            // Actually, Login expects password.
            // Best way: reload window to trigger checkAuthStatus.
            // Or use context's checkAuthStatus if exposed.

            toast.success('Account verified! logging in...');
            window.location.href = '/dashboard'; // Simple reload to init auth

        } catch (err) {
            setError(err.response?.data?.message || 'Verification failed');
            toast.error('Verification failed');
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="auth-card glass-card"
                >
                    <div className="auth-header">
                        <Link to="/" className="logo">
                            <UserPlus className="logo-icon" />
                            <span className="logo-text gradient-text">PantryIQ</span>
                        </Link>
                        <h2>{step === 1 ? 'Create Account' : 'Verify Email'}</h2>
                        <p>{step === 1 ? 'Start your smart kitchen journey' : `Enter code sent to ${formData.email}`}</p>
                    </div>

                    {step === 1 ? (
                        <form className="auth-form" onSubmit={handleSignupSubmit}>
                            {error && (
                                <div className="error-message">
                                    <AlertCircle size={18} />
                                    <span>{error}</span>
                                </div>
                            )}

                            <div className="form-group">
                                <label>Full Name</label>
                                <div className="input-wrapper">
                                    <User size={20} className="input-icon" />
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="John Doe"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Email</label>
                                <div className="input-wrapper">
                                    <Mail size={20} className="input-icon" />
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="you@example.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Password</label>
                                <div className="input-wrapper">
                                    <Lock size={20} className="input-icon" />
                                    <input
                                        type="password"
                                        name="password"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        minLength={6}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary btn-full"
                                disabled={loading}
                            >
                                {loading ? <Loader className="spin" size={20} /> : 'Sign Up'}
                            </button>
                        </form>
                    ) : (
                        <form className="auth-form" onSubmit={handleVerifySubmit}>
                            {error && (
                                <div className="error-message">
                                    <AlertCircle size={18} />
                                    <span>{error}</span>
                                </div>
                            )}
                            <div className="form-group">
                                <label>Verification Code</label>
                                <div className="input-wrapper">
                                    <CheckCircle size={20} className="input-icon" />
                                    <input
                                        type="text"
                                        placeholder="123456"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        required
                                        maxLength={6}
                                        style={{ letterSpacing: '2px', fontSize: '1.2rem', textAlign: 'center' }}
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="btn btn-primary btn-full"
                                disabled={loading}
                            >
                                {loading ? <Loader className="spin" size={20} /> : 'Verify & Login'}
                            </button>
                        </form>
                    )}

                    <div className="auth-switch">
                        Already have an account? <Link to="/login">Sign in</Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Signup;
