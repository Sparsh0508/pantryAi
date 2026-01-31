import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '../components/DashboardLayout';
import { Plus, AlertTriangle, Clock, Package, Trash2 } from 'lucide-react';
import { pantryService } from '../services/api';
import toast from 'react-hot-toast';
import './Dashboard.css';
import './Pantry.css';

const Pantry = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPantry = async () => {
            try {
                const response = await pantryService.getAll();
                setItems(response.data);
            } catch (error) {
                console.error("Error fetching pantry:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPantry();
    }, []);

    const pantryItems = items.map(item => ({
        ...item,
        expiry: item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : 'No expiry',
        status: item.isLowStock ? 'low' : (item.isExpired ? 'expired' : 'good'),
        lastUsed: 'Recently'
    }));

    // Stats calculation
    const totalItems = items.length;
    const lowStockCount = items.filter(i => i.isLowStock).length;
    const expiringCount = items.filter(i => i.expiryDate && new Date(i.expiryDate) < new Date(new Date().setDate(new Date().getDate() + 7))).length;


    const [showAddForm, setShowAddForm] = useState(false);
    const [newItem, setNewItem] = useState({ name: '', quantity: '', unit: 'pcs', expiryDate: '' });

    const handleAddItem = async (e) => {
        e.preventDefault();
        try {
            await pantryService.add(newItem);
            toast.success('Added to pantry');
            setShowAddForm(false);
            setNewItem({ name: '', quantity: '', unit: 'pcs', expiryDate: '' });
            // Refresh logic needs to be extracted or use window.location.reload() or better: trigger useEffect
            // For now, I'll allow a full refresh or just refetch if I extract it.
            // Let's extract fetchPantry to outside useEffect.
            window.location.reload();
        } catch (error) {
            toast.error('Failed to add item');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Remove from pantry?')) return;
        try {
            await pantryService.delete(id);
            toast.success('Removed item');
            setItems(items.filter(i => i._id !== id));
        } catch (error) {
            toast.error('Failed to remove');
        }
    };

    return (
        <DashboardLayout>
            <div className="pantry-page">
                <div className="page-header">
                    <div>
                        <h1>🥫 Pantry Management</h1>
                        <p>Track your inventory with smart expiry alerts</p>
                    </div>
                    <button className="btn btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
                        <Plus size={18} />
                        {showAddForm ? 'Cancel' : 'Add Item'}
                    </button>
                </div>

                {showAddForm && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-card"
                        style={{ padding: '20px', marginBottom: '20px' }}
                    >
                        <form onSubmit={handleAddItem} style={{ display: 'grid', gap: '10px', gridTemplateColumns: '1fr 1fr 1fr auto' }}>
                            <input
                                placeholder="Item Name"
                                value={newItem.name}
                                onChange={e => setNewItem({ ...newItem, name: e.target.value })}
                                required
                                style={{ padding: '8px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)', color: 'black' }}
                            />
                            <input
                                placeholder="Qty (e.g. 2)"
                                value={newItem.quantity}
                                onChange={e => setNewItem({ ...newItem, quantity: e.target.value })}
                                required
                                style={{ padding: '8px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)', color: 'black' }}
                            />
                            <input
                                type="date"
                                value={newItem.expiryDate}
                                onChange={e => setNewItem({ ...newItem, expiryDate: e.target.value })}
                                style={{ padding: '8px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)', color: 'black' }}
                            />
                            <button type="submit" className="btn btn-accent">Save</button>
                        </form>
                    </motion.div>
                )}

                {/* Stats */}
                <div className="pantry-stats">
                    <div className="stat-card glass-card">
                        <Package className="stat-icon" style={{ color: 'var(--color-primary)' }} />
                        <div>
                            <div className="stat-value">{totalItems}</div>
                            <div className="stat-label">Total Items</div>
                        </div>
                    </div>
                    <div className="stat-card glass-card">
                        <AlertTriangle className="stat-icon" style={{ color: 'var(--color-warning)' }} />
                        <div>
                            <div className="stat-value">{lowStockCount}</div>
                            <div className="stat-label">Low Stock</div>
                        </div>
                    </div>
                    <div className="stat-card glass-card">
                        <Clock className="stat-icon" style={{ color: 'var(--color-error)' }} />
                        <div>
                            <div className="stat-value">{expiringCount}</div>
                            <div className="stat-label">Expiring Soon</div>
                        </div>
                    </div>
                </div>

                {/* Pantry Grid */}
                <div className="pantry-grid">
                    {pantryItems.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                            className={`pantry-card glass-card status-${item.status}`}
                        >
                            <div className="pantry-card-header">
                                <span className="pantry-icon">{item.icon}</span>
                                <span className={`status-indicator status-${item.status}`}></span>
                            </div>
                            <div className="pantry-card-body">
                                <h4>{item.name}</h4>
                                <div className="pantry-info">
                                    <div className="info-row">
                                        <span className="info-label">Quantity:</span>
                                        <span className="info-value">{item.quantity}</span>
                                    </div>
                                    <div className="info-row">
                                        <span className="info-label">Expiry:</span>
                                        <span className={`info-value ${item.status === 'expired' || item.status === 'critical' ? 'text-error' : ''}`}>
                                            {item.expiry}
                                        </span>
                                    </div>
                                    <div className="info-row">
                                        <span className="info-label">Last used:</span>
                                        <span className="info-value">{item.lastUsed}</span>
                                    </div>
                                    <button onClick={() => handleDelete(item._id)} style={{ marginTop: '10px', padding: '4px', background: 'none', border: 'none', color: '#ff6b6b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem' }}>
                                        <Trash2 size={14} /> Remove
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Pantry;
