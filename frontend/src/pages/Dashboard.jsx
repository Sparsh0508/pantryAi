import { dashboardService, insightsService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import './Dashboard.css';


const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState([
        { label: 'Items in Pantry', value: '...', trend: '+0', color: 'var(--color-primary)' },
        { label: 'Grocery List', value: '...', trend: '+0', color: 'var(--color-accent)' },
        { label: 'Meals Planned', value: '...', trend: '+0', color: 'var(--color-info)' },
        { label: 'Monthly Savings', value: '₹0', trend: '+0%', color: 'var(--color-success)' },
    ]);
    const [recentActivity, setRecentActivity] = useState([]);
    const [lowStockItems, setLowStockItems] = useState([]);
    const [aiSuggestions, setAiSuggestions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, insightsRes] = await Promise.all([
                    dashboardService.getStats(),
                    insightsService.getSuggestions()
                ]);

                setStats(statsRes.data.stats);
                setRecentActivity(statsRes.data.recentActivity);
                setLowStockItems(statsRes.data.lowStockItems);
                setAiSuggestions(insightsRes.data.suggestions || []);
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <DashboardLayout>
            <div className="dashboard-page">
                <div className="page-header">
                    <div>
                        <h1>Welcome back, {user?.name?.split(' ')[0] || 'Chef'}! 👋</h1>
                        <p>Here's what's happening with your pantry today</p>
                    </div>
                    <div className="ai-badge sparkle">
                        <Sparkles size={16} />
                        AI Active
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="stats-grid">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="stat-card glass-card"
                        >
                            <div className="stat-header">
                                <span className="stat-label">{stat.label}</span>
                                <span className="stat-trend" style={{ color: stat.color }}>
                                    {stat.trend}
                                </span>
                            </div>
                            <div className="stat-value" style={{ color: stat.color }}>
                                {stat.value}
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="dashboard-grid">
                    {/* AI Suggestions */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="dashboard-card glass-card"
                    >
                        <div className="card-header">
                            <h3>🤖 AI Suggestions</h3>
                            <span className="ai-badge">Smart</span>
                        </div>
                        <div className="card-content">
                            <div className="ai-message">
                                <Sparkles size={20} className="ai-icon" />
                                <p>"{aiSuggestions.length > 0 ? aiSuggestions[0].message : "Loading insights..."}"</p>
                            </div>
                            <div className="suggestion-actions">
                                <button className="btn btn-primary btn-sm" onClick={() => toast.success('Ingredients added to list')}>Add missing ingredients</button>
                                <button className="btn btn-secondary btn-sm" onClick={() => toast('Meal suggestions refresher coming soon!', { icon: '🤖' })}>Suggest meals</button>
                            </div>
                        </div>
                    </motion.div>

                    {/* Low Stock Items */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="dashboard-card glass-card"
                    >
                        <div className="card-header">
                            <h3>⚠️ Low Stock Alert</h3>
                            <span className="badge-warning">{lowStockItems.length}</span>
                        </div>
                        <div className="card-content">
                            <div className="item-list">
                                {lowStockItems.map((item, index) => (
                                    <div key={index} className="item-row">
                                        <div className="item-info">
                                            <span className="item-icon">{item.icon}</span>
                                            <div>
                                                <div className="item-name">{item.name}</div>
                                                <div className="item-quantity">{item.quantity}</div>
                                            </div>
                                        </div>
                                        <span className={`status-badge status-${item.status}`}>
                                            {item.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <button className="btn btn-accent btn-sm btn-full">Add All to List</button>
                        </div>
                    </motion.div>

                    {/* Recent Activity */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="dashboard-card glass-card"
                    >
                        <div className="card-header">
                            <h3>📋 Recent Activity</h3>
                        </div>
                        <div className="card-content">
                            <div className="activity-list">
                                {recentActivity.map((activity, index) => (
                                    <div key={index} className="activity-item">
                                        <span className="activity-icon">{activity.icon}</span>
                                        <div className="activity-details">
                                            <div className="activity-action">
                                                {activity.action}
                                                {activity.ai && <span className="ai-badge-mini">AI</span>}
                                            </div>
                                            <div className="activity-time">{activity.time}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Dashboard;
