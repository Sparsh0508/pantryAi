import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import DashboardLayout from '../components/DashboardLayout';
import { Sparkles, Plus, Check, RefreshCw, Share2, Filter, Search, Trash2 } from 'lucide-react';
import { groceryService } from '../services/api';
import './Dashboard.css';
import './GroceryList.css';

const GroceryList = () => {
    const [filter, setFilter] = useState('all');

    const [items, setItems] = useState([]);
    const [newItemName, setNewItemName] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const response = await groceryService.getAll();
            setItems(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching grocery list:", error);
        }
    };

    const handleAddItem = async () => {
        if (!newItemName.trim()) return;
        try {
            await groceryService.add({
                name: newItemName,
                category: 'other',
                quantity: 1
            });
            setNewItemName('');
            fetchItems();
        } catch (error) {
            console.error("Error adding item:", error);
        }
    };

    const handleToggleCheck = async (id, currentStatus) => {
        try {
            const updatedItems = items.map(item =>
                item._id === id ? { ...item, checked: !currentStatus } : item
            );
            setItems(updatedItems);
            await groceryService.update(id, { checked: !currentStatus });
        } catch (error) {
            console.error("Error updating item:", error);
        }
    };

    // Filter items based on logic
    const aiSuggested = items.filter(item => item.isAISuggested && !item.checked);
    const userAdded = items.filter(item => !item.isAISuggested && !item.checked);
    const checkedItems = items.filter(item => item.checked);


    const handleMoveToPantry = async () => {
        const checkedIds = checkedItems.map(i => i._id);
        if (checkedIds.length === 0) return toast.error('No items checked');

        try {
            await groceryService.moveToPantry(checkedIds);
            toast.success('Moved to pantry!');
            fetchItems();
        } catch (error) {
            toast.error('Failed to move items');
            console.error(error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this item?')) return;
        try {
            await groceryService.delete(id);
            toast.success('Item deleted');
            setItems(items.filter(i => i._id !== id));
        } catch (error) {
            toast.error('Failed to delete');
        }
    };

    return (
        <DashboardLayout>
            <div className="grocery-list-page">
                <div className="page-header">
                    <div>
                        <h1>🛒 Smart Grocery List</h1>
                        <p>AI-powered suggestions based on your pantry and meals</p>
                    </div>
                    <div className="header-actions">
                        <button className="btn btn-secondary" onClick={fetchItems}>
                            <RefreshCw size={18} />
                            Refresh
                        </button>
                        <button className="btn btn-primary" onClick={() => toast('Sharing coming soon!', { icon: '🚧' })}>
                            <Share2 size={18} />
                            Share List
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="filters-bar glass-card">
                    <div className="filter-tabs">
                        <button
                            className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
                            onClick={() => setFilter('all')}
                        >
                            All Items
                        </button>
                    </div>
                    <div className="add-item-wrapper" style={{ display: 'flex', gap: '8px' }}>
                        <input
                            type="text"
                            placeholder="Add item..."
                            className="search-input"
                            value={newItemName}
                            onChange={(e) => setNewItemName(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleAddItem()}
                            style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)', color: 'black' }}
                        />
                        <button className="btn btn-accent" onClick={handleAddItem}>
                            <Plus size={18} />
                        </button>
                    </div>
                </div>

                {/* AI Suggested Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="list-section"
                >
                    <div className="section-header-with-badge">
                        <h3>✅ Suggested by AI</h3>
                        <span className="ai-badge sparkle">
                            <Sparkles size={14} />
                            Smart
                        </span>
                    </div>
                    <div className="grocery-items">
                        {aiSuggested.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="grocery-item glass-card hover-glow"
                            >
                                <div className="item-checkbox">
                                    <input type="checkbox" id={`ai-${index}`} />
                                    <label htmlFor={`ai-${index}`}></label>
                                </div>
                                <span className="item-icon-large">{item.icon}</span>
                                <div className="item-details">
                                    <div className="item-name-large">{item.name}</div>
                                    <div className="item-meta">
                                        <span className="meta-tag status-yellow">{item.reason}</span>
                                        <span className="meta-text">{item.usedIn}</span>
                                    </div>
                                </div>
                                <button className="item-action-btn">
                                    <Plus size={18} />
                                </button>
                            </motion.div>
                        ))}
                    </div>
                    <button className="btn btn-primary btn-sm" onClick={handleMoveToPantry}>
                        <Check size={16} />
                        Move Checked to Pantry
                    </button>
                </motion.div>

                {/* Usually Buy Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="list-section"
                >
                    <h3>🧾 Your Items</h3>
                    <div className="grocery-items">
                        {userAdded.map((item, index) => (
                            <div key={item._id || index} className="grocery-item glass-card">
                                <div className="item-checkbox">
                                    <input
                                        type="checkbox"
                                        id={`usual-${index}`}
                                        checked={item.checked}
                                        onChange={() => handleToggleCheck(item._id, item.checked)}
                                    />
                                    <label htmlFor={`usual-${index}`}></label>
                                </div>
                                <span className="item-icon-large">{item.icon || '🛒'}</span>
                                <div className="item-details">
                                    <div className="item-name-large">{item.name}</div>
                                    <div className="item-meta">
                                        <span className="meta-text">{item.quantity} {item.unit}</span>
                                    </div>
                                </div>
                                <button className="item-action-btn btn-delete" onClick={() => handleDelete(item._id)} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#ff6b6b', cursor: 'pointer' }}>
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                        {userAdded.length === 0 && <p style={{ opacity: 0.6, padding: '10px' }}>No items added yet.</p>}
                    </div>
                </motion.div>

                {/* Already in Pantry Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="list-section"
                >
                    <h3>✅ Checked / In Cart</h3>
                    <div className="grocery-items">
                        {checkedItems.map((item, index) => (
                            <div key={item._id || index} className="grocery-item glass-card disabled">
                                <div className="item-checkbox">
                                    <input
                                        type="checkbox"
                                        id={`checked-${index}`}
                                        checked={true}
                                        onChange={() => handleToggleCheck(item._id, true)}
                                    />
                                    <label htmlFor={`checked-${index}`}></label>
                                </div>
                                <span className="item-icon-large">{item.icon || '🛒'}</span>
                                <div className="item-details">
                                    <div className="item-name-large" style={{ textDecoration: 'line-through' }}>{item.name}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </DashboardLayout>
    );
};

export default GroceryList;
