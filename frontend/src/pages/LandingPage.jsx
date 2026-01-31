import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    Sparkles,
    ShoppingCart,
    Brain,
    Users,
    Package,
    TrendingUp,
    ChevronRight,
    Check,
    Zap,
    Shield,
    Clock
} from 'lucide-react';
import './LandingPage.css';

const LandingPage = () => {
    const [demoMode, setDemoMode] = useState(false);

    const features = [
        {
            icon: <Brain size={32} />,
            title: 'AI Smart Suggestions',
            description: 'Never forget what you need. Our AI learns your habits and suggests groceries before you run out.',
            color: 'var(--color-ai-primary)'
        },
        {
            icon: <Package size={32} />,
            title: 'Pantry Tracking',
            description: 'Real-time inventory of your pantry with expiry warnings and smart stock alerts.',
            color: 'var(--color-primary)'
        },
        {
            icon: <Users size={32} />,
            title: 'Shared Family Lists',
            description: 'Collaborate with family members in real-time. No more duplicate purchases.',
            color: 'var(--color-accent)'
        }
    ];

    const steps = [
        { number: '01', title: 'Add Purchases', description: 'Log your grocery shopping trips' },
        { number: '02', title: 'Track Pantry', description: 'Monitor what you have at home' },
        { number: '03', title: 'Plan Meals', description: 'Schedule your weekly menu' },
        { number: '04', title: 'AI Generates List', description: 'Get smart suggestions automatically' }
    ];

    const stats = [
        { value: '40%', label: 'Less Food Waste' },
        { value: '₹600+', label: 'Avg. Monthly Savings' },
        { value: '2hrs', label: 'Time Saved Weekly' }
    ];

    return (
        <div className="landing-page">
            {/* Navigation */}
            <nav className="navbar">
                <div className="container">
                    <div className="nav-content">
                        <motion.div
                            className="logo"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <Sparkles className="logo-icon" />
                            <span className="logo-text gradient-text">PantryIQ</span>
                        </motion.div>

                        <div className="nav-links">
                            <a href="#features">Features</a>
                            <a href="#how-it-works">How It Works</a>
                            <Link to="/login" className="btn btn-secondary">Login</Link>
                            <Link to="/signup" className="btn btn-primary">Get Started</Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="hero-section">
                <div className="container">
                    <div className="hero-content">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="ai-badge sparkle">
                                <Zap size={16} />
                                Powered by AI
                            </div>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="hero-title"
                        >
                            Your groceries, planned by AI — <span className="gradient-text">never forget, never overbuy.</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="hero-subtitle"
                        >
                            AI-powered grocery suggestions based on your pantry, habits, and meals.
                            <br />Save money, reduce waste, and never run out of essentials.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="hero-cta"
                        >
                            <Link to="/signup" className="btn btn-primary btn-lg">
                                Try Smart List
                                <ChevronRight size={20} />
                            </Link>
                            <a href="#how-it-works" className="btn btn-secondary btn-lg">
                                See How It Works
                            </a>
                        </motion.div>

                        {/* Animated Grocery Items */}
                        <div className="floating-items">
                            <motion.div
                                className="floating-item"
                                animate={{ y: [0, -20, 0] }}
                                transition={{ duration: 3, repeat: Infinity, delay: 0 }}
                            >
                                🥕
                            </motion.div>
                            <motion.div
                                className="floating-item"
                                animate={{ y: [0, -20, 0] }}
                                transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                            >
                                🥛
                            </motion.div>
                            <motion.div
                                className="floating-item"
                                animate={{ y: [0, -20, 0] }}
                                transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                            >
                                🍞
                            </motion.div>
                            <motion.div
                                className="floating-item"
                                animate={{ y: [0, -20, 0] }}
                                transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
                            >
                                🍎
                            </motion.div>
                            <motion.div
                                className="floating-item"
                                animate={{ y: [0, -20, 0] }}
                                transition={{ duration: 3, repeat: Infinity, delay: 2 }}
                            >
                                🧀
                            </motion.div>
                        </div>
                    </div>

                    {/* Stats */}
                    <motion.div
                        className="stats-grid"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        {stats.map((stat, index) => (
                            <div key={index} className="stat-card glass-card">
                                <div className="stat-value gradient-text">{stat.value}</div>
                                <div className="stat-label">{stat.label}</div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="features-section section">
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="section-header"
                    >
                        <h2>Intelligent Features</h2>
                        <p>Everything you need to manage groceries smarter</p>
                    </motion.div>

                    <div className="features-grid">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="feature-card glass-card hover-glow"
                            >
                                <div className="feature-icon" style={{ color: feature.color }}>
                                    {feature.icon}
                                </div>
                                <h3>{feature.title}</h3>
                                <p>{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="how-it-works-section section">
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="section-header"
                    >
                        <h2>How It Works</h2>
                        <p>Four simple steps to smarter grocery shopping</p>
                    </motion.div>

                    <div className="timeline">
                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="timeline-item"
                            >
                                <div className="timeline-number gradient-text">{step.number}</div>
                                <div className="timeline-content glass-card">
                                    <h4>{step.title}</h4>
                                    <p>{step.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section section">
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="cta-content glass-card"
                    >
                        <Sparkles size={48} className="cta-icon" />
                        <h2>Ready to shop smarter?</h2>
                        <p>Join thousands of families saving time and money with AI-powered grocery planning</p>
                        <Link to="/signup" className="btn btn-primary btn-lg">
                            Start Free Trial
                            <ChevronRight size={20} />
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="container">
                    <div className="footer-content">
                        <div className="footer-brand">
                            <div className="logo">
                                <Sparkles className="logo-icon" />
                                <span className="logo-text gradient-text">PantryIQ</span>
                            </div>
                            <p>Smart Grocery & Meal Intelligence</p>
                        </div>

                        <div className="footer-info">
                            <div className="hackathon-badge">
                                <Zap size={16} />
                                Built in 24 hours 🚀
                            </div>
                            <div className="tech-stack">
                                <span>React</span>
                                <span>•</span>
                                <span>Framer Motion</span>
                                <span>•</span>
                                <span>AI/ML</span>
                            </div>
                        </div>
                    </div>

                    <div className="footer-bottom">
                        <p>© 2026 PantryIQ. Built for Hackathon Demo.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
