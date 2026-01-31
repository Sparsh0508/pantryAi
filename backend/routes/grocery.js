import express from 'express';
import { body, validationResult } from 'express-validator';
import GroceryItem from '../models/GroceryItem.js';
import PantryItem from '../models/PantryItem.js';
import Activity from '../models/Activity.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/grocery
// @desc    Get all grocery items
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const items = await GroceryItem.find({ userId: req.userId }).sort({ checked: 1, createdAt: -1 });
        res.json(items);
    } catch (error) {
        console.error('Get grocery list error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST /api/grocery
// @desc    Add a new grocery item
// @access  Private
router.post('/', [auth, [
    body('name').notEmpty().withMessage('Name is required'),
    body('category').notEmpty().withMessage('Category is required')
]], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Check for duplicates
        const existingItem = await GroceryItem.findOne({
            userId: req.userId,
            name: { $regex: new RegExp(`^${req.body.name}$`, 'i') }
        });

        if (existingItem) {
            existingItem.quantity += 1;
            const updatedItem = await existingItem.save();

            await new Activity({
                userId: req.userId,
                action: `Increased quantity of ${updatedItem.name}`,
                actor: 'You',
                icon: '➕',
                metadata: { itemId: updatedItem._id }
            }).save();

            return res.json(updatedItem);
        }

        const newItem = new GroceryItem({
            userId: req.userId,
            ...req.body
        });

        const item = await newItem.save();

        // Log activity
        await new Activity({
            userId: req.userId,
            action: `Added ${item.name} to grocery list`,
            actor: 'You',
            icon: '🛒',
            metadata: { itemId: item._id }
        }).save();

        res.json(item);
    } catch (error) {
        console.error('Add grocery item error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   PUT /api/grocery/:id
// @desc    Update a grocery item
// @access  Private
router.put('/:id', auth, async (req, res) => {
    try {
        let item = await GroceryItem.findById(req.params.id);

        if (!item) return res.status(404).json({ message: 'Item not found' });
        if (item.userId.toString() !== req.userId) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        item = await GroceryItem.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );

        res.json(item);
    } catch (error) {
        console.error('Update grocery item error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   DELETE /api/grocery/:id
// @desc    Delete a grocery item
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const item = await GroceryItem.findById(req.params.id);

        if (!item) return res.status(404).json({ message: 'Item not found' });
        if (item.userId.toString() !== req.userId) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await GroceryItem.findByIdAndDelete(req.params.id);
        res.json({ message: 'Item removed' });
    } catch (error) {
        console.error('Delete grocery item error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST /api/grocery/move-to-pantry
// @desc    Move checked items to pantry
// @access  Private
router.post('/move-to-pantry', auth, async (req, res) => {
    try {
        const { itemIds } = req.body;

        // Find items to move
        const itemsToMove = await GroceryItem.find({
            _id: { $in: itemIds },
            userId: req.userId
        });

        if (itemsToMove.length === 0) {
            return res.status(400).json({ message: 'No valid items found to move' });
        }

        // Create pantry items
        const pantryItems = itemsToMove.map(item => ({
            userId: req.userId,
            name: item.name,
            quantity: item.quantity,
            unit: item.unit,
            category: item.category,
            addedBy: item.addedBy,
            lowStockThreshold: 1 // Default
        }));

        await PantryItem.insertMany(pantryItems);

        // Delete from grocery list
        await GroceryItem.deleteMany({
            _id: { $in: itemIds },
            userId: req.userId
        });

        // Log activity
        await new Activity({
            userId: req.userId,
            action: `Moved ${itemsToMove.length} items to pantry`,
            actor: 'You',
            icon: '📦',
            metadata: { count: itemsToMove.length }
        }).save();

        res.json({ message: `Moved ${itemsToMove.length} items to pantry` });
    } catch (error) {
        console.error('Move to pantry error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
