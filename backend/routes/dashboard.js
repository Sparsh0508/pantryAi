import express from 'express';
import PantryItem from '../models/PantryItem.js';
import GroceryItem from '../models/GroceryItem.js';
import MealPlan from '../models/MealPlan.js';
import Activity from '../models/Activity.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/dashboard/stats
// @desc    Get dashboard statistics
// @access  Private
router.get('/stats', auth, async (req, res) => {
    try {
        const pantryCount = await PantryItem.countDocuments({ userId: req.userId });
        const groceryCount = await GroceryItem.countDocuments({ userId: req.userId });

        // Count meals for this week
        const startOfWeek = new Date();
        startOfWeek.setHours(0, 0, 0, 0);
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(endOfWeek.getDate() + 7);

        const mealCount = await MealPlan.countDocuments({
            userId: req.userId,
            date: { $gte: startOfWeek, $lt: endOfWeek }
        });

        // Recent activity
        const recentActivity = await Activity.find({ userId: req.userId })
            .sort({ createdAt: -1 })
            .limit(5);

        // Low stock items
        const lowStockItems = await PantryItem.find({ userId: req.userId })
            .$where('this.quantity <= this.lowStockThreshold')
            .limit(5);

        res.json({
            stats: [
                { label: 'Items in Pantry', value: pantryCount, trend: '+0', color: 'var(--color-primary)' },
                { label: 'Grocery List', value: groceryCount, trend: '+0', color: 'var(--color-accent)' },
                { label: 'Meals This Week', value: mealCount, trend: '+0', color: 'var(--color-info)' },
                { label: 'Monthly Savings', value: '₹0', trend: '+0%', color: 'var(--color-success)' },
            ],
            recentActivity,
            lowStockItems
        });
    } catch (error) {
        console.error('Get dashboard stats error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
