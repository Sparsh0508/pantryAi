import React from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '../components/DashboardLayout';
import { TrendingUp, TrendingDown, DollarSign, Trash2, ShoppingBag, Sparkles } from 'lucide-react';
import './Dashboard.css';
import './Insights.css';

const Insights = () => {
    const stats = [
        {
            label: 'Monthly Savings',
            value: '₹680',
            change: '+12%',
            trend: 'up',
            icon: <DollarSign size={24} />,
            color: 'var(--color-success)'
        },
        {
            label: 'Food Waste Reduced',
            value: '40%',
            change: '+8%',
            trend: 'up',
            icon: <Trash2 size={24} />,
            color: 'var(--color-primary)'
        },
        {
            label: 'Shopping Trips',
            value: '3/mo',
            change: '-2',
            trend: 'down',
            icon: <ShoppingBag size={24} />,
            color: 'var(--color-info)'
        },
    ];

    const topWasted = [
        { name: 'Bananas', count: '12 times', percentage: '25%', icon: '🍌' },
        { name: 'Lettuce', count: '8 times', percentage: '18%', icon: '🥬' },
        { name: 'Bread', count: '6 times', percentage: '14%', icon: '🍞' },
    ];

    const topForgotten = [
        { name: 'Milk', count: '15 times', icon: '🥛' },
        { name: 'Eggs', count: '12 times', icon: '🥚' },
        { name: 'Onions', count: '9 times', icon: '🧅' },
    ];

    const monthlyData = [
        { month: 'Jan', savings: 520 },
        { month: 'Feb', savings: 680 },
        { month: 'Mar', savings: 750 },
    ];


    return (
        <DashboardLayout>
            <div className="insights-page">
                <div className="page-header">
                    <div>
                        <h1>📊 AI Insights</h1>
                        <p>Smart analytics to help you save more and waste less</p>
                    </div>
                    <div className="ai-badge sparkle">
                        <Sparkles size={16} />
                        AI Powered
                    </div>
                </div>

                {/* Key Stats */}
                <div className="insights-stats">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="insight-stat-card glass-card"
                            style={{ borderLeft: `4px solid ${stat.color}` }}
                        >
                            <div className="stat-icon-wrapper" style={{ background: `${stat.color}15` }}>
                                <div style={{ color: stat.color }}>{stat.icon}</div>
                            </div>
                            <div className="stat-content">
                                <div className="stat-label">{stat.label}</div>
                                <div className="stat-value-large" style={{ color: stat.color }}>
                                    {stat.value}
                                </div>
                                <div className={`stat-change ${stat.trend === 'up' ? 'trend-up' : 'trend-down'}`}>
                                    {stat.trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                                    {stat.change}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* AI Suggestion Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="ai-suggestion-card glass-card"
                >
                    <div className="ai-suggestion-header">
                        <Sparkles size={32} className="ai-glow-icon" />
                        <h3>AI Recommendation</h3>
                    </div>
                    <p className="ai-suggestion-text">
                        "You can save <strong>₹600/month</strong> by avoiding duplicate purchases and reducing food waste.
                        Your biggest opportunity is with <strong>Bananas</strong> - try buying smaller quantities more frequently."
                    </p>
                    <div className="suggestion-actions">
                        <button className="btn btn-primary">Apply Suggestions</button>
                        <button className="btn btn-secondary">Learn More</button>
                    </div>
                </motion.div>

                <div className="insights-grid">
                    {/* Top Wasted Items */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="insight-card glass-card"
                    >
                        <div className="card-header">
                            <h3>🗑️ Most Wasted Items</h3>
                        </div>
                        <div className="insight-list">
                            {topWasted.map((item, index) => (
                                <div key={index} className="insight-item">
                                    <div className="insight-item-left">
                                        <span className="insight-icon">{item.icon}</span>
                                        <div>
                                            <div className="insight-item-name">{item.name}</div>
                                            <div className="insight-item-count">{item.count}</div>
                                        </div>
                                    </div>
                                    <div className="insight-percentage">{item.percentage}</div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Top Forgotten Items */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="insight-card glass-card"
                    >
                        <div className="card-header">
                            <h3>🤔 Top Forgotten Groceries</h3>
                        </div>
                        <div className="insight-list">
                            {topForgotten.map((item, index) => (
                                <div key={index} className="insight-item">
                                    <div className="insight-item-left">
                                        <span className="insight-icon">{item.icon}</span>
                                        <div>
                                            <div className="insight-item-name">{item.name}</div>
                                            <div className="insight-item-count">Forgotten {item.count}</div>
                                        </div>
                                    </div>
                                    <button className="btn btn-accent btn-xs">Add to List</button>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Monthly Savings Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="insight-card glass-card chart-card"
                    >
                        <div className="card-header">
                            <h3>💰 Monthly Savings Trend</h3>
                        </div>
                        <div className="chart-container">
                            <div className="bar-chart">
                                {monthlyData.map((data, index) => (
                                    <div key={index} className="bar-wrapper">
                                        <div className="bar-label">{data.month}</div>
                                        <div className="bar-column">
                                            <div
                                                className="bar"
                                                style={{
                                                    height: `${(data.savings / 750) * 100}%`,
                                                    background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%)'
                                                }}
                                            >
                                                <span className="bar-value">₹{data.savings}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Shopping Patterns */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="insight-card glass-card"
                    >
                        <div className="card-header">
                            <h3>🛒 Shopping Patterns</h3>
                        </div>
                        <div className="pattern-list">
                            <div className="pattern-item">
                                <div className="pattern-label">Best Shopping Day</div>
                                <div className="pattern-value">Saturday</div>
                            </div>
                            <div className="pattern-item">
                                <div className="pattern-label">Avg. Items per Trip</div>
                                <div className="pattern-value">18 items</div>
                            </div>
                            <div className="pattern-item">
                                <div className="pattern-label">Most Bought Category</div>
                                <div className="pattern-value">Vegetables 🥕</div>
                            </div>
                            <div className="pattern-item">
                                <div className="pattern-label">Peak Shopping Time</div>
                                <div className="pattern-value">6-8 PM</div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Insights;
