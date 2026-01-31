import express from 'express';
import { body, validationResult } from 'express-validator';
import PantryItem from '../models/PantryItem.js';
import Activity from '../models/Activity.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/pantry
// @desc    Get all pantry items
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const items = await PantryItem.find({ userId: req.userId }).sort({ category: 1, name: 1 });
        res.json(items);
    } catch (error) {
        console.error('Get pantry error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST /api/pantry
// @desc    Add a new pantry item
// @access  Private
router.post('/', [auth, [
    body('name').notEmpty().withMessage('Name is required'),
    body('quantity').isNumeric().withMessage('Quantity must be a number'),
    body('unit').notEmpty().withMessage('Unit is required'),
    body('category').notEmpty().withMessage('Category is required')
]], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const newItem = new PantryItem({
            userId: req.userId,
            ...req.body
        });

        const item = await newItem.save();

        // Log activity
        await new Activity({
            userId: req.userId,
            action: `Added ${item.name} to pantry`,
            actor: 'You',
            icon: '📥',
            metadata: { itemId: item._id }
        }).save();

        res.json(item);
    } catch (error) {
        console.error('Add pantry item error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   PUT /api/pantry/:id
// @desc    Update a pantry item
// @access  Private
router.put('/:id', auth, async (req, res) => {
    try {
        let item = await PantryItem.findById(req.params.id);

        if (!item) return res.status(404).json({ message: 'Item not found' });
        if (item.userId.toString() !== req.userId) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        item = await PantryItem.findByIdAndUpdate(
            req.params.id,
            { $set: req.body, updatedAt: Date.now() },
            { new: true }
        );

        res.json(item);
    } catch (error) {
        console.error('Update pantry item error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   DELETE /api/pantry/:id
// @desc    Delete a pantry item
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const item = await PantryItem.findById(req.params.id);

        if (!item) return res.status(404).json({ message: 'Item not found' });
        if (item.userId.toString() !== req.userId) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await PantryItem.findByIdAndDelete(req.params.id);

        // Log activity
        await new Activity({
            userId: req.userId,
            action: `Removed ${item.name} from pantry`,
            actor: 'You',
            icon: '🗑️',
            metadata: { itemId: item._id }
        }).save();

        res.json({ message: 'Item removed' });
    } catch (error) {
        console.error('Delete pantry item error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
