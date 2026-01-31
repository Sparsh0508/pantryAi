import express from 'express';
import { body, validationResult } from 'express-validator';
import MealPlan from '../models/MealPlan.js';
import Activity from '../models/Activity.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/meals
// @desc    Get meal plans for a date range
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        let query = { userId: req.userId };

        if (startDate && endDate) {
            query.date = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        const meals = await MealPlan.find(query).sort({ date: 1, mealType: 1 });
        res.json(meals);
    } catch (error) {
        console.error('Get meal plans error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST /api/meals
// @desc    Add a new meal plan
// @access  Private
router.post('/', [auth, [
    body('date').notEmpty().withMessage('Date is required'),
    body('mealType').notEmpty().withMessage('Meal type is required'),
    body('recipeName').notEmpty().withMessage('Recipe name is required')
]], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const newMeal = new MealPlan({
            userId: req.userId,
            ...req.body
        });

        const meal = await newMeal.save();

        // Log activity
        await new Activity({
            userId: req.userId,
            action: `Planned meal: ${meal.recipeName}`,
            actor: 'You',
            icon: '🍽️',
            metadata: { mealId: meal._id }
        }).save();

        res.json(meal);
    } catch (error) {
        console.error('Add meal plan error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   DELETE /api/meals/:id
// @desc    Delete a meal plan
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const meal = await MealPlan.findById(req.params.id);

        if (!meal) return res.status(404).json({ message: 'Meal plan not found' });
        if (meal.userId.toString() !== req.userId) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await MealPlan.findByIdAndDelete(req.params.id);
        res.json({ message: 'Meal plan removed' });
    } catch (error) {
        console.error('Delete meal plan error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
