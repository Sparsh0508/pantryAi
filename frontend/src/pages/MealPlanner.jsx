import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '../components/DashboardLayout';
import { Plus, Sparkles, ShoppingCart, Trash2 } from 'lucide-react';
import { mealService, groceryService } from '../services/api';
import toast from 'react-hot-toast';
import './Dashboard.css';
import './MealPlanner.css';

const MealPlanner = () => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const [meals, setMeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newMeal, setNewMeal] = useState({ date: '', mealType: 'dinner', recipeName: '' });

    useEffect(() => {
        fetchMeals();
    }, []);

    const fetchMeals = async () => {
        try {
            // Fetch for current week range or just all for now
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - startDate.getDay() + 1); // Monday
            const endDate = new Date(startDate);
            endDate.setDate(endDate.getDate() + 6); // Sunday

            const response = await mealService.getMeals(startDate.toISOString(), endDate.toISOString());
            setMeals(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching meals:", error);
            setLoading(false);
        }
    };

    const handleAddMeal = async (e) => {
        e.preventDefault();
        try {
            await mealService.add(newMeal);
            toast.success('Meal added!');
            setShowAddForm(false);
            setNewMeal({ date: '', mealType: 'dinner', recipeName: '' });
            fetchMeals();
        } catch (error) {
            toast.error('Failed to add meal');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this meal?')) return;
        try {
            await mealService.delete(id);
            toast.success('Meal deleted');
            setMeals(meals.filter(m => m._id !== id));
        } catch (error) {
            toast.error('Failed to delete meal');
        }
    };

    // Helper to map DB meals to days
    const getMealForDay = (day) => {
        return meals.find(m => new Date(m.date).toLocaleDateString('en-US', { weekday: 'long' }) === day);
    };

    return (
        <DashboardLayout>
            <div className="meal-planner-page">
                <div className="page-header">
                    <div>
                        <h1>🍳 Meal Planner</h1>
                        <p>Plan your week and get smart ingredient suggestions</p>
                    </div>
                    <button className="btn btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
                        <Plus size={18} />
                        {showAddForm ? 'Cancel' : 'Add Meal'}
                    </button>
                </div>

                {showAddForm && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-card"
                        style={{ padding: '20px', marginBottom: '20px' }}
                    >
                        <form onSubmit={handleAddMeal} style={{ display: 'grid', gap: '10px', gridTemplateColumns: 'repeat(4, 1fr)' }}>
                            <input
                                type="date"
                                required
                                value={newMeal.date}
                                onChange={e => setNewMeal({ ...newMeal, date: e.target.value })}
                                style={{ padding: '8px', borderRadius: '8px', background: 'rgba(255,255,255,0.1)', color: 'black', border: '1px solid rgba(255,255,255,0.2)' }}
                            />
                            <select
                                value={newMeal.mealType}
                                onChange={e => setNewMeal({ ...newMeal, mealType: e.target.value })}
                                style={{ padding: '8px', borderRadius: '8px', background: 'rgba(255,255,255,0.1)', color: 'black', border: '1px solid rgba(255,255,255,0.2)' }}
                            >
                                <option value="breakfast">Breakfast</option>
                                <option value="lunch">Lunch</option>
                                <option value="dinner">Dinner</option>
                                <option value="snack">Snack</option>
                            </select>
                            <input
                                placeholder="Recipe Name"
                                required
                                value={newMeal.recipeName}
                                onChange={e => setNewMeal({ ...newMeal, recipeName: e.target.value })}
                                style={{ padding: '8px', borderRadius: '8px', background: 'rgba(255,255,255,0.1)', color: 'black', border: '1px solid rgba(255,255,255,0.2)' }}
                            />
                            <button type="submit" className="btn btn-accent">Save Plan</button>
                        </form>
                    </motion.div>
                )}

                {/* Weekly Calendar */}
                <div className="meal-calendar">
                    {days.map((day, index) => {
                        const meal = getMealForDay(day);
                        return (
                            <motion.div
                                key={day}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="day-card glass-card"
                            >
                                <div className="day-header">
                                    <h4>{day}</h4>
                                </div>

                                {meal ? (
                                    <div className="meal-content">
                                        <div className="meal-icon">{meal.icon || '🍽️'}</div>
                                        <div className="meal-name">{meal.recipeName}</div>
                                        <div className="meal-type-badge" style={{ fontSize: '0.7em', opacity: 0.7 }}>{meal.mealType}</div>

                                        <div style={{ marginTop: '10px', display: 'flex', gap: '5px' }}>
                                            <button className="btn btn-accent btn-xs" onClick={() => toast.success('Added ingredients to list')}>
                                                <ShoppingCart size={14} />
                                            </button>
                                            <button className="btn btn-danger btn-xs" onClick={() => handleDelete(meal._id)} style={{ padding: '4px', background: 'rgba(255, 100, 100, 0.2)', color: '#ff6b6b', borderRadius: '4px' }}>
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="empty-meal">
                                        <button className="add-meal-btn" onClick={() => setShowAddForm(true)}>
                                            <Plus size={24} />
                                            <span>Add</span>
                                        </button>
                                    </div>
                                )}
                            </motion.div>
                        )
                    })}
                </div>

                {/* AI Meal Suggestions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="meal-suggestions glass-card"
                >
                    <div className="card-header">
                        <h3>🤖 AI Meal Suggestions</h3>
                        <span className="ai-badge sparkle">
                            <Sparkles size={14} />
                            Smart
                        </span>
                    </div>
                    <div className="suggestion-grid">
                        <div className="suggestion-card">
                            <span className="suggestion-icon">🥗</span>
                            <div className="suggestion-name">Caesar Salad</div>
                            <div className="suggestion-reason">Based on pantry items</div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </DashboardLayout>
    );
};

export default MealPlanner;
