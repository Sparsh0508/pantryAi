import mongoose from 'mongoose';

const groceryItemSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    quantity: {
        type: Number,
        default: 1
    },
    unit: {
        type: String,
        default: 'pcs'
    },
    category: {
        type: String,
        required: true,
        enum: ['grains', 'dairy', 'vegetables', 'fruits', 'meat', 'spices', 'snacks', 'beverages', 'other']
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    isAISuggested: {
        type: Boolean,
        default: false
    },
    aiReason: {
        type: String
    },
    usedIn: {
        type: String
    },
    checked: {
        type: Boolean,
        default: false
    },
    icon: {
        type: String,
        default: '🛒'
    },
    addedBy: {
        type: String,
        default: 'You'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const GroceryItem = mongoose.model('GroceryItem', groceryItemSchema);

export default GroceryItem;
